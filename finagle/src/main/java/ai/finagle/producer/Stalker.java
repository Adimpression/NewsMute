package ai.finagle.producer;

import ai.finagle.model.*;
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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 *
 * Example RSS Feed:
 *
 * <code>
 * <rss version="2.0">
 *
 * <channel>
 * <title>W3Schools Home Page</title>
 * <link>http://www.w3schools.com</link>
 * <description>Free web building tutorials</description>
 * <item>
 * <title>RSS Tutorial</title>
 * <link>http://www.w3schools.com/rss</link>
 * <description>New RSS tutorial on W3Schools</description>
 * </item>
 * <item>
 * <title>XML Tutorial</title>
 * <link>http://www.w3schools.com/xml</link>
 * <description>New XML tutorial on W3Schools</description>
 * </item>
 * </channel>
 *
 * </rss>
 *
 * </code>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Stalker implements Runnable {

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
            //connect.execute("drop table Scream;");
            connect.execute("create table Stalk(\n" +
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
                        final byte[] resultBytes = result.getBytes();
                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("192.237.246.113", 16185)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");
        final List<String> urlParameter = parameters.get("url");

        if(user != null){
            if(urlParameter != null){
                for (String s : urlParameter) {
                    System.out.println("url:" + s);
                    try {
                        final Document document = Jsoup.parse(new URL(s).openStream(), "UTF-8", s);

                        final String title = document.getElementsByTag("title").first().text();
                        System.out.println("title:" + title);
                        final String description = document.getElementsByTag("title").first().text();
                        System.out.println("description:" + description);

                        connect.execute("insert into Stalk(humanId, urlHash, value) values('" + user.get(0) + "','" + s + "','" + new Gson().toJson(new StalkItem(s, title, description)) + "');");//Yet to hash the urlHash value
                    } catch (final Throwable e) {
                        connect.execute("insert into Stalk(humanId, urlHash, value) values('" + user.get(0) + "','" + s + "','" + new Gson().toJson(new StalkItem(s, s, s)) + "');");//Yet to hash the urlHash value
                    }

                }
            }
        }

        return new Gson().toJson(new Return<ReturnValueStalk>(new ReturnValueStalk(new StalkItem[0]), "", "OK"));
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
            System.out.printf("Datacenter: %s; Host: %s; Rack: %s\n",
                    host.getDatacenter(), host.getAddress(), host.getRack());
            stringBuilder.append("Datacenter: ").append(host.getDatacenter()).append("; Host: ").append(host.getAddress()).append("; Rack: ").append(host.getRack());
        }
        return stringBuilder.toString();
    }

    public void close() {
        cluster.shutdown();
    }


}





