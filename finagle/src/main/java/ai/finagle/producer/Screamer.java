package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueScream;
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
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.mindrot.jbcrypt.BCrypt;

import java.net.InetSocketAddress;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Answers the question: What do I find interesting that I can share with my super friends
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Screamer implements Runnable {

    private Cluster cluster;

    /**
     * @TODO:
     * Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("192.168.3.2");

        final Session connect = cluster.connect("Test1");
        try {
            //connect.execute("drop table Scream;");
            connect.execute(DBScripts.CREATE_SCREAM);

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
                .bindTo(new InetSocketAddress("23.253.36.42", 30000)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        try {
            final Session connect = cluster.connect("Test1");

            final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
            final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

            final List<String> user = parameters.get("user");
            final List<String> urlParameter = parameters.get("url");

            if(user != null && urlParameter != null){
                for (String s : urlParameter) {
                    try {
                        System.out.println("url:" + s);
                        final String unhashedUser = user.get(0);
                        System.out.println("user:" +unhashedUser);
                        final String hashedUser = BCrypt.hashpw(unhashedUser, SuperFriender.GLOBAL_SALT);
                        System.out.println("hashed user:" + hashedUser);

                        final List<Row> screamRowsCounselled = connect.execute("select * from Yawn where humanId='" + hashedUser + "' AND mood='" + "1" + "' AND urlHash='" + s + "'").all();
                        if(screamRowsCounselled.isEmpty()){
                            try {
                                final Document document = Jsoup.parse(new URL(s).openStream(), "UTF-8", s);

                                final String title = document.getElementsByTag("title").first().text();
                                System.out.println("title:" + title);
                                String description = title;
                                for (final Element meta : document.getElementsByTag("meta")) {
                                    if (meta.attr("name").equals("description")) {
                                        description = meta.attr("content");
                                        break;
                                    }
                                }
                                System.out.println("description:" + description);
                                connect.execute("insert into Scream(humanId, mood, urlHash, value) values('" + hashedUser + "','"  + "0" + "','" + s + "','" + new Gson().toJson(new YawnItem(s, title, description, hashedUser, "0")) + "') USING TTL 600;");//Yet to hash the urlHash value
                            } catch (final Throwable e) {//@TODO: Get rid of this, plan for missing title and description inside try
                                connect.execute("insert into Scream(humanId, mood, urlHash, value) values('" + hashedUser + "','"  + "0" + "','" + s + "','" + new Gson().toJson(new YawnItem(s, s, s, hashedUser, "0")) + "') USING TTL 600;");//Yet to hash the urlHash value
                            }
                        } else{
                            System.out.println("Ignoring already screamed item for humanId:" + hashedUser + " for url:" + s);
                        }
                    } catch (final Throwable e) {
                        e.printStackTrace(System.err);
                    }

                }
            }

            return new Gson().toJson(new Return<ReturnValueScream>(new ReturnValueScream(new YawnItem[0]), "", "OK"));
        } catch (final Throwable e) {
            e.printStackTrace(System.out);  //To change body of catch statement use File | Settings | File Templates.
            throw new RuntimeException(e);
        }
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





