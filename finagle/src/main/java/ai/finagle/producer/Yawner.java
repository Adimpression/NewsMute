package ai.finagle.producer;

import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueYawn;
import ai.finagle.model.YawnItem;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.handler.codec.http.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Answers the question: What have my super friends found interesting
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Yawner implements Runnable {

    private Cluster cluster;

    /**
     * @TODO:
     * Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("10.208.27.21");

        final Session connect = cluster.connect("Test1");

        try {
            //connect.execute("drop table Yawn;");
            connect.execute("create table Yawn(\n" +
                    "      humanId varchar,\n" +
                    "      urlHash varchar,\n" +
                    "      value varchar,\n" +
                    "      PRIMARY KEY (humanId, urlHash));");

        } catch (final Exception e) {//Table already exists
            System.out.println(e.getMessage());
        }


        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final String result = blocking(request);
                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0,HttpResponseStatus.OK);
                        final List<Map.Entry<String, String>> headers = request.getHeaders();
                        for (Map.Entry<String, String> header : headers) {
                            System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                        }
                        byte[] resultBytes;
                        try {
                            resultBytes = result.getBytes("UTF-8");
                        } catch (UnsupportedEncodingException e) {
                            resultBytes = new byte[0];
                        }

                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        httpResponse.setHeader("Content-Type","text/html; charset=utf-8");
                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("192.237.246.113", 40000)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");

        final YawnItem[] yawnItems;

        if(user != null){
            System.out.println("Values in table as follows");
            final ResultSet execute = connect.execute("select * from Yawn where humanId='"+ user.get(0) +"'");
            final List<Row> all = execute.all();

            yawnItems = new YawnItem[all.size()];

            for (int i = 0; i < yawnItems.length; i++) {
                try {
                    final File file = new File("/tmp/" + System.currentTimeMillis() + ".yaw");
                    FileOutputStream fileOutputStream = new FileOutputStream(file);
                    OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
                    outputStreamWriter.write(all.get(i).getString("value"));
                    outputStreamWriter.close();
                    fileOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace(System.err);  //To change body of catch statement use File | Settings | File Templates.
                }

                try {
                    yawnItems[i] = new Gson().fromJson(all.get(i).getString("value"), YawnItem.class);
                } catch (JsonSyntaxException e) { //@TODO: Remove after table cleanup
                    yawnItems[i] = new YawnItem(all.get(i).getString("value"),all.get(i).getString("value"),all.get(i).getString("value"));
                }
            }

        } else {
            yawnItems = new YawnItem[0];
        }

        final String result = new Gson().toJson(new Return<ReturnValueYawn>(new ReturnValueYawn(yawnItems), "No Error", "OK"));

        try {
            final File file = new File("/tmp/" + System.currentTimeMillis() + ".yaw");
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
            outputStreamWriter.write(result);
            outputStreamWriter.close();
            fileOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace(System.err);  //To change body of catch statement use File | Settings | File Templates.
        }

        return result;
    }

    public String open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        cluster.connect();
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





