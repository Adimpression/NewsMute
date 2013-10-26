package ai.finagle.producer;

import ai.finagle.model.Return;
import ai.finagle.model.ReturnValue;
import ai.finagle.model.YawnItem;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.handler.codec.http.*;

import java.io.OptionalDataException;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class OutboxProducer implements Runnable {

    private Cluster cluster;

    public static void main(final String[] args) {

        final OutboxProducer outboxProducer = new OutboxProducer();
        //outboxProducer.open("127.0.0.1");

        new Thread(outboxProducer).run();

        //final OutboxProducer outboxProducer = new OutboxProducer();
        //outboxProducer.open("127.0.0.1");
        //outboxProducer.close();
    }

    /**
     * @TODO:
     * Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("10.208.27.21");

        Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            ExecutorServiceFuturePool esfp = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return esfp.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final String result = blocking(request);

                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0,HttpResponseStatus.OK);
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
                .bindTo(new InetSocketAddress("192.237.246.113", 80)));

        //OutboxProducer.this.close();

    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");
//        try {
//            connect.execute("drop table Inbox;");
//
//
//        } catch (Exception e) {//Table created for the first time
//            e.printStackTrace(System.err);//Temp Fix
//        }
//
//        connect.execute("create table Inbox(\n" +
//                "      humanId varchar,\n" +
//                "      urlHash varchar,\n" +
//                "      value varchar,\n" +
//                "      PRIMARY KEY (humanId, urlHash));");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");


        final List<String> url = parameters.get("url");
        if(url != null){
            for (String s : url) {
                System.out.println("url:" + s);
                connect.execute("insert into Inbox(humanId, urlHash, value) values('" + url.get(0) + "','" + s + "','" + s + "');");//Yet to hash the urlHash value
            }
        }


        Return results;

        final YawnItem[] yawnItems;

        if(user != null){
            System.out.println("Values in table as follows");
            final ResultSet execute = connect.execute("select * from Inbox where humanId='"+ user.get(0) +"'");
            final List<Row> all = execute.all();

            yawnItems = new YawnItem[all.size()];

            for (int i = 0; i < yawnItems.length; i++) {
                yawnItems[i] = new YawnItem(all.get(i).getString("value"), all.get(i).getString("value"), all.get(i).getString("value"));
            }

        } else {
            yawnItems = new YawnItem[0];
        }

        results = new Return(new ReturnValue(yawnItems),"No Error", "OK");





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
        return new Gson().toJson(results);
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





