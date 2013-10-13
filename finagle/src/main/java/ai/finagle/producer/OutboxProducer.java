package ai.finagle.producer;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Host;
import com.datastax.driver.core.Metadata;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.finagle.http.MockResponse;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.CookieEncoder;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponse;

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
        //outboxProducer.connect("127.0.0.1");

        new Thread(outboxProducer).run();

        //final OutboxProducer outboxProducer = new OutboxProducer();
        //outboxProducer.connect("127.0.0.1");
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
                        blocking(request);

                        final HttpResponse httpResponse = new MockResponse();
                        final List<Map.Entry<String, String>> headers = request.getHeaders();

                        for (Map.Entry<String, String> header : headers) {
                            System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                        }
                        CookieEncoder encoder = new CookieEncoder(true);
                        encoder.addCookie("JSESSIONID", "1234");
                        httpResponse.setHeader("Set-Cookie", encoder.encode());
                        return httpResponse;
                    }
                });


//                final Session session = cluster.connect();
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

    private void blocking(HttpRequest request) {
        new OutboxProducer().connect("127.0.0.1");

    }

    public String connect(String node) {
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





