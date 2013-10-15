package ai.finagle.producer;

import com.datastax.driver.core.*;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.finagle.http.MockResponse;
import com.twitter.finagle.http.Response;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.handler.codec.http.*;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class OutboxProducer implements Runnable {

    ExecutorService pool = Executors.newFixedThreadPool(4);                     // Java thread pool

    ExecutorServiceFuturePool futurePool = new ExecutorServiceFuturePool(pool); // Java Future thread pool

    private Cluster cluster;

    public static void main(final String[] args) {

        final OutboxProducer outboxProducer = new OutboxProducer();
        //outboxProducer.open("127.0.0.1");

        new Thread(outboxProducer).run();

        //final OutboxProducer outboxProducer = new OutboxProducer();
        //outboxProducer.open("127.0.0.1");
        //outboxProducer.close();
    }

    @Override
    public void run() {

        Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {
            ExecutorService es = Executors.newFixedThreadPool(4); // Number of threads to devote to blocking requests

            ExecutorServiceFuturePool esfp = new ExecutorServiceFuturePool(es); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return esfp.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final String result = blocking(request);

                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0,HttpResponseStatus.FOUND);
                        final List<Map.Entry<String, String>> headers = request.getHeaders();

                        for (Map.Entry<String, String> header : headers) {
                            System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                        }
                        CookieEncoder encoder = new CookieEncoder(true);
                        encoder.addCookie("JSESSIONID", "1234");
                        httpResponse.setHeader("Set-Cookie", encoder.encode());

                        final byte[] resultBytes = result.getBytes();
                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        return httpResponse;
                    }
                });


//                final Session session = cluster.open();
//
//                session.execute("CREATE KEYSPACE Excelsior WITH strategy_class = 'SimpleStrategy'\n" +
//                        "    AND strategy_options:replication_factor = 1;");
//
//                final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
//                final Map<String, List<String>> parameters = queryStringDecoder.getParameters();
//
//                final HttpResponse httpResponse = new MockResponse();
//                final List<Map.Entry<String, String>> headers = request.getHeaders();
//
//                for (Map.Entry<String, String> header : headers) {
//                    System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
//                }
//                CookieEncoder encoder = new CookieEncoder(true);
//                encoder.addCookie("JSESSIONID", "1234");
//                httpResponse.setHeader("Set-Cookie", encoder.encode());
//                return Future.value(httpResponse);
            }
        };


        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("localhost", 10000)));

        //OutboxProducer.this.close();

    }

    private String blocking(HttpRequest request) {
        this.open("127.0.0.1");
        final Session connect = cluster.connect("Test1");
        try {
            connect.execute("drop table Inbox;");


        } catch (Exception e) {//Table created for the first time
            e.printStackTrace(System.err);//Temp Fix
        }

        connect.execute("create table Inbox(\n" +
                "      humanId varchar,\n" +
                "      urlHash varchar,\n" +
                "      value varchar,\n" +
                "      PRIMARY KEY (humanId, urlHash));");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> url = parameters.get("url");
        for (String s : url) {
            System.out.println("url:" + s);
            connect.execute("insert into Inbox(humanId, urlHash, value) values('testuser','" + s + "','" + s + "');");//Yet to hash the urlHash value
        }
        System.out.println("Values in table as follows");
        final ResultSet execute = connect.execute("select * from Inbox");
        final List<Row> all = execute.all();
        StringBuilder allRows = new StringBuilder("");
        for (Row row : all) {
            final String humanId = row.getString("humanId");
            System.out.println("humanId:"+humanId);
            allRows.append(humanId+"|");
            final String urlHash = row.getString("urlHash");
            System.out.println("urlHash:"+urlHash);
            allRows.append(urlHash+"|");
            final String value = row.getString("value");
            System.out.println("value:"+value);
            allRows.append(value+"\n");
        }


//        final ResultSet execute = connect.execute("CREATE KEYSPACE Test WITH strategy_class = 'SimpleStrategy' AND strategy_options:replication_factor = 1;");
//        try {
//            final ResultSet execute = connect.execute("CREATE KEYSPACE Test1 WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};");
//            for (Row row : execute.all()) {
//                System.out.println("Create Keyspace Result:" + row.toString());
//            }
//        } catch (AlreadyExistsException e) {
//            System.out.println("Keyspace exists. Hence using it.");
//            final Session test = cluster.connect("Test1");
//        }
        this.close();//Haha, aren't we hacking through. We also might encounter probelms on concurrent access!
        return allRows.toString();
    }

    public String open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node).build();
        Metadata metadata = cluster.getMetadata();
        System.out.printf("Connected to cluster: %s\n",
                metadata.getClusterName());
        StringBuilder stringBuilder = new StringBuilder("");
        for (Host host : metadata.getAllHosts()) {
            System.out.printf("Datatacenter: %s; Host: %s; Rack: %s\n",
                    host.getDatacenter(), host.getAddress(), host.getRack());
            stringBuilder.append("Datatacenter: " + host.getDatacenter() + "; Host: " + host.getAddress() + "; Rack: " + host.getRack());
        }
        return stringBuilder.toString();
    }

    public void close() {
        cluster.shutdown();
    }


}





