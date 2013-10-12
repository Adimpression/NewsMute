package ai.finagle.util;

import ai.reaver.Return;
import ai.reaver.ReturnImpl;
import org.apache.avro.io.BinaryEncoder;
import org.apache.avro.io.DatumWriter;
import org.apache.avro.io.EncoderFactory;
import org.apache.avro.specific.SpecificDatumWriter;
import org.apache.avro.specific.SpecificRecord;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.*;

import java.io.*;


//{NAME => 'Subscriber', FAMILIES => [{NAME => 'value', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0' true, VERSIONS => '3', COMPRESSION => 'NONE', MIN_VERSIONS => '0', TTL => '2147483647', BLOCKSIZE => '65536', IN_MEMORY => 'false', BLOCKCACHE => 'true'}]}
//curl -H "Content-Type: application/json" --data "{ NAME=> 'GeohashSubscriber', IS_META => 'false', IS_ROOT => 'false', COLUMNS => [ { NAME => 'value', BLOCKSIZE => '65536', BLOOMFILTER => 'NONE', MIN_VERSIONS => '0', BLOCKCACHE => 'true', COMPRESSION => 'NONE', VERSIONS => '3', REPLICATION_SCOPE => '0', TTL => '2147483647', IN_MEMORY => 'false' } ] }" http://166.78.125.227:9090/GeohashSubscriber/schema

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 16/2/13
 * Time: 5:06 PM
 */
public class HBaseCrudService<T extends SpecificRecord> {


    /**
     * Please take into account that when you deploy an HBase Rest Server, your data is wide open to the web.
     * I believe Kerbose or similar authentication mechanisms are available with some integration effort.
     * As an additional layer of security, please ensure your firewall points
     */
    public static final String HBASE_REST_SERVER = "localhost";

    public T create(final RowKey rowKey, final T t) {
        //System.out.println("Attempting to write:" + t.toString());

//            final ByteArrayOutputStream _outputStream = new ByteArrayOutputStream();
//            final BinaryEncoder _binaryEncoder = EncoderFactory.get().binaryEncoder(_outputStream, null);
//
//            final DatumWriter<T> _datumWriter = new SpecificDatumWriter<T>(t.getSchema());
//            _datumWriter.write(t, _binaryEncoder);
//            _binaryEncoder.flush();
//
//            final byte[] dataByteArray = _outputStream.toByteArray();


        final org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();

        //curl -H "Content-Type: application/octet-stream" --data '[Sample Data]' http://localhost:9090/Subscriber/samplerow1/value:value

        final PutMethod _putMethod = new PutMethod("http://" + HBASE_REST_SERVER + ":9090/" + t.getClass().getSimpleName() + "/" + rowKey.getRowKey() + "/value:value");
        _putMethod.setRequestHeader("Content-Type", "application/octet-stream");
        _putMethod.setRequestEntity(new ByteArrayRequestEntity(("Finagle Data" + ((Subscriber) t).getMockData()).getBytes()));

        int statusCode = 0;
        try {
            statusCode = httpClient.executeMethod(_putMethod);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }

        if (statusCode != HttpStatus.SC_OK) {
            throw new RuntimeException(String.valueOf(statusCode));
        }
        InputStream inputStream = null;

        try {
            inputStream = _putMethod.getResponseBodyAsStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        String accumulator = "";
        try {
            while ((line = br.readLine()) != null) {
                accumulator += line;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            br.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(accumulator);
        return null;
    }

    public T find(final T t, final Object id) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    public Return<Scanner> scan(final T t, final int batchAmount, final String startRowAsBase64Binary) {

        Return<Scanner> returnVal;

        try {
            final org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();

            final String _uri = "http://" + HBASE_REST_SERVER + ":9090/" + t.getClass().getSimpleName() + "/" + "scanner";
            System.out.println("Calling:" + _uri);
            final PutMethod _putMethod = new PutMethod(_uri);
            _putMethod.setRequestHeader("Content-Type", "text/xml");
            _putMethod.setRequestHeader("Accept", "application/json");
            _putMethod.setRequestEntity(new StringRequestEntity("<Scanner batch=\"" + batchAmount + "\" startRow=\"" + startRowAsBase64Binary + "\"/>"));


            int statusCode = 0;
            statusCode = httpClient.executeMethod(_putMethod);

            if (statusCode != HttpStatus.SC_OK && statusCode != HttpStatus.SC_CREATED && statusCode != HttpStatus.SC_NO_CONTENT) {
                throw new RuntimeException(String.valueOf("Http request ended up with status code:" + statusCode));
            }
            InputStream inputStream = null;

            inputStream = _putMethod.getResponseBodyAsStream();

            final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            String accumulator = "";
            while ((line = br.readLine()) != null) {
                accumulator += line;
            }
            br.close();
            System.out.println(accumulator);

            final Header _responseHeader = _putMethod.getResponseHeader("Location");
            final String _location = _responseHeader.getValue();

            final Return<Scanner> _scan = scan(t, new Scanner()/*Since varargs length is 0*/
                    .setNewScanUrl(_location)
                    .setNewValue(null));

            returnVal = new ReturnImpl<Scanner>(_scan.returnValueBadly(), "SUCCESS");
        } catch (final Throwable throwable) {
            returnVal = new ReturnImpl<Scanner>(throwable, "ERROR", true);
        }

        return returnVal;

    }

    //curl -H "Content-Type: text/xml" -d '<Scanner batch="1"/>' http://localhost:9090/GeohashSubscriber/scanner
    //curl -H "Content-Type: text/xml" http://localhost:9090/GeohashSubscriber/scanner/136143105884034f34071
    public Return<Scanner> scan(final T t, final Scanner scanner) {
        Return<Scanner> returnVal;
        try {
            final org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();

            System.out.println("Calling:" + scanner.getNewScanUrl());

            final GetMethod _getMethod = new GetMethod(scanner.getNewScanUrl());
            _getMethod.setRequestHeader("Content-Type", "text/xml");
            _getMethod.setRequestHeader("Accept", "application/json");

            int statusCode = 0;
            statusCode = httpClient.executeMethod(_getMethod);

            if (statusCode != HttpStatus.SC_OK && statusCode != HttpStatus.SC_CREATED && statusCode != HttpStatus.SC_NO_CONTENT) {
                throw new RuntimeException(String.valueOf(statusCode));
            }
            final String accumulator = _getMethod.getResponseBodyAsString();
            System.out.println("Row:" + accumulator);


            returnVal = new ReturnImpl<Scanner>(scanner
                    .setNewValue(accumulator), "SUCCESS");

        } catch (final Throwable throwable) {
            returnVal = new ReturnImpl<Scanner>(throwable, "FAILURE", true);
        }

        return returnVal;

    }

    public Return<Scanner> scan(final T t, final int batchAmount) {

        Return<Scanner> returnVal;

        try {
            final org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();

            final String _uri = "http://" + HBASE_REST_SERVER + ":9090/" + t.getClass().getSimpleName() + "/" + "scanner";
            System.out.println("Calling:" + _uri);
            final PutMethod _putMethod = new PutMethod(_uri);
            _putMethod.setRequestHeader("Content-Type", "text/xml");
            _putMethod.setRequestHeader("Accept", "application/json");
            _putMethod.setRequestEntity(new StringRequestEntity("<Scanner batch=\"" + batchAmount + "\"/>"));


            int statusCode = 0;
            statusCode = httpClient.executeMethod(_putMethod);

            if (statusCode != HttpStatus.SC_OK && statusCode != HttpStatus.SC_CREATED && statusCode != HttpStatus.SC_NO_CONTENT) {
                throw new RuntimeException(String.valueOf("Http request ended up with status code:" + statusCode));
            }
            InputStream inputStream = null;

            inputStream = _putMethod.getResponseBodyAsStream();

            final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            String accumulator = "";
            while ((line = br.readLine()) != null) {
                accumulator += line;
            }
            br.close();
            System.out.println(accumulator);

            final Header _responseHeader = _putMethod.getResponseHeader("Location");
            final String _location = _responseHeader.getValue();

            final Return<Scanner> _scan = scan(t, new Scanner()/*Since varargs length is 0*/
                    .setNewScanUrl(_location)
                    .setNewValue(null));

            returnVal = new ReturnImpl<Scanner>(_scan.returnValueBadly(), "SUCCESS");
        } catch (final Throwable throwable) {
            returnVal = new ReturnImpl<Scanner>(throwable, "ERROR", true);
        }

        return returnVal;

    }

    public T findBadly(final Class typeOfEntity, final Object idByWhichToLookup) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    public T update(final T t) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    public void delete(final RowKey rowKey, final T t) {

        System.out.println("Attempting to delete:" + t.toString());


        final org.apache.commons.httpclient.HttpClient httpClient = new org.apache.commons.httpclient.HttpClient();

        //curl -H "Content-Type: application/octet-stream" --data '[Sample Data]' http://localhost:9090/Subscriber/samplerow1/value:value

        final DeleteMethod _putMethod = new DeleteMethod("http://" + HBASE_REST_SERVER + ":9090/" + t.getClass().getSimpleName() + "/" + rowKey.getRowKey());
        _putMethod.setRequestHeader("Content-Type", "application/octet-stream");
//            _putMethod.setRequestEntity(new ByteArrayRequestEntity(dataByteArray));

        int statusCode = 0;
        try {
            statusCode = httpClient.executeMethod(_putMethod);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }

        if (statusCode != HttpStatus.SC_OK) {
            throw new RuntimeException(String.valueOf(statusCode));
        }
        InputStream inputStream = null;

        try {
            inputStream = _putMethod.getResponseBodyAsStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        String accumulator = "";
        try {
            while ((line = br.readLine()) != null) {
                accumulator += line;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            br.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(accumulator);
    }

    public class Scanner {
        private String newScanUrl;

        private String newValue;

        public String getNewValue() {
            return newValue;
        }

        public Scanner setNewValue(final String __newValue) {
            newValue = __newValue;
            return this;
        }

        public String getNewScanUrl() {
            return newScanUrl;
        }

        public Scanner setNewScanUrl(final String __newScanUrl) {
            newScanUrl = __newScanUrl;
            return this;
        }
    }
}
