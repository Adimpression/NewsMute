package ai.finagle.producer;

import ai.finagle.auth.Gatekeeper;
import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueScream;
import ai.finagle.model.YawnItem;
import ai.finagle.util.Feed;
import ai.finagle.util.Printer;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.google.gson.Gson;
import com.sun.syndication.feed.synd.SyndFeed;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.handler.codec.http.*;
import org.mindrot.jbcrypt.BCrypt;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Answers the question: What do I find interesting that I can share with my super friends
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Screamer implements Runnable {

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

    private Session threadSafeSession;

    public Screamer(final String bindIp, final String port, final String databaseIp) {
        this.bindIp = bindIp;
        this.port = port;
        this.databaseIp = databaseIp;
    }

    /**
     * @TODO: Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open(databaseIp);

        final Session connect = cluster.connect("NewsMute");
        try {
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
                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0, HttpResponseStatus.OK);
                        Printer.printHeaders(request);
                        final byte[] resultBytes = result.getBytes();
                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(new Gatekeeper().andThen(service), ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(bindIp, Integer.parseInt(port))));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        try {

            final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
            final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

            final List<String> user = parameters.get("user");
            final List<String> urlParameter = parameters.get("url");

            if (user != null && urlParameter != null) {
                for (String s : urlParameter) {
                    try {
                        System.out.println("url:" + s);
                        final String unhashedUser = user.get(0);
                        System.out.println("user:" + unhashedUser);
                        final String hashedUser = BCrypt.hashpw(unhashedUser, SuperFriender.GLOBAL_SALT);
                        System.out.println("hashed user:" + hashedUser);

                        final List<Row> screamRowsCounselled = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", hashedUser, MOOD.LIFE.DEAD.state, s)).all();
                        if (screamRowsCounselled.isEmpty()) {
                            try {
                                final SyndFeed document = Feed.getFeed(s);

                                final String title = document.getTitle();
                                System.out.println("title:" + title);
                                String description = document.getDescription();

                                System.out.println("description:" + description);
                                threadSafeSession.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", hashedUser, MOOD.LIFE.ALIVE.state, s, new Gson().toJson(new YawnItem(s, title, description, hashedUser, "0")), DBScripts.YAWN_COUNSEL));//Yet to hash the urlHash value
                            } catch (final Throwable e) {//Leave the insert here alone. Works as a default if the internet connectivity decides to break. We discovered this when application was running on a non www accessible server
                                e.printStackTrace(System.out);
                                threadSafeSession.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", hashedUser, MOOD.LIFE.ALIVE.state, s, new Gson().toJson(new YawnItem(s, s, s, hashedUser, "0")), DBScripts.YAWN_COUNSEL));//Yet to hash the urlHash value
                            }
                        } else {
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

    public void open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        cluster.connect();
        this.threadSafeSession = cluster.connect("NewsMute");
        Printer.printClusterMetadata(cluster);
    }


    public void close() {
        cluster.shutdown();
    }


}





