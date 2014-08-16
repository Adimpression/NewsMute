package ai.finagle.producer;

import ai.finagle.auth.Gatekeeper;
import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueStalk;
import ai.finagle.model.StalkItem;
import ai.finagle.model.YawnItem;
import ai.finagle.util.Feed;
import ai.finagle.util.Printer;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
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
 * Example RSS Feed:
 * <p/>
 * <code>
 * <rss version="2.0">
 * <p/>
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
 * <p/>
 * </rss>
 * <p/>
 * </code>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Stalker implements Runnable {

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

    private Session threadSafeSession;

    public Stalker(final String bindIp, final String port, final String databaseIp) {
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
            connect.execute(DBScripts.CREATE_STALK);

        } catch (final Exception e) {//Table already exists
            System.out.println(e.getMessage());
        }


        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blocking requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final String result = blocking(request);
                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0, HttpResponseStatus.OK);
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

        ServerBuilder.safeBuild(new Gatekeeper().andThen(service), ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(bindIp, Integer.parseInt(port))));

        //this.close();
    }

    private String blocking(HttpRequest request) {

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");
        final String hashUser = BCrypt.hashpw(user.get(0), SuperFriender.GLOBAL_SALT);
        System.out.println("hashUser:" + hashUser);
        final List<String> urlParameter = parameters.get("url");
        final List<String> action = parameters.get(Yawner.ACTION);
        StalkItem[] stalkItems = new StalkItem[]{};

        if (user != null) {
            StalkerAction stalkerAction = StalkerAction.valueOf(action.get(0));
            switch (stalkerAction) {
                case CREATE: {
                    try {
                        System.out.println(stalkerAction.toString());
                        final String url = urlParameter.get(0);
                        System.out.println("url:" + url);
                        final SyndFeed document = Feed.getFeed(url);
                        final String title = document.getTitle();
                        System.out.println("title:" + title);
                        final String description = document.getDescription();
                        System.out.println("description:" + description);

                        threadSafeSession.execute(String.format("insert into Stalk(humanId, mood, urlHash, value) values('%s','%c','%s','%s');", hashUser, MOOD.LIFE.ALIVE.state, url, new Gson().toJson(new StalkItem(url, title, description))));//Yet to hash the urlHash value

                        try {//Please match this with Harvester first time feed setup

                            for (final StalkItem feedItem : Feed.getFeedEntries(url)) {

                                final String feedItemTitle = feedItem.title;
                                System.out.println("title:" + feedItemTitle);

                                final String feedItemLink = feedItem.link;
                                System.out.println("link:" + feedItemLink);

                                final String feedItemDescription = feedItem.description;
                                System.out.println("description:" + feedItemDescription);

                                final ResultSet yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", hashUser, MOOD.LIFE.ALIVE.state, feedItemLink));
                                final ResultSet yawnRowsDidRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", hashUser, MOOD.LIFE.DEAD.state, feedItemLink));

                                final boolean feedItemLinkMissing = yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty();

                                if (feedItemLinkMissing) {
                                    threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", hashUser, MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, url, "0")), DBScripts.INITIAL_INSERT_TTL));//Yet to hash the urlHash value
                                } else {
                                    //Ignoring insert
                                }


                            }
                        } catch (final Throwable throwable) {
                            throwable.printStackTrace(System.err);
                        }

                    } catch (final Throwable e) {
                        e.printStackTrace(System.err);
                    }
                }
                break;
                case READ: {
                    System.out.println("Values in table as follows");
                    final ResultSet execute = threadSafeSession.execute(String.format("select * from Stalk where humanId='%s'", hashUser));
                    final List<Row> all = execute.all();

                    stalkItems = new StalkItem[all.size()];

                    for (int i = 0; i < stalkItems.length; i++) {
                        stalkItems[i] = new Gson().fromJson(all.get(i).getString("value"), StalkItem.class);
                    }
                }
                break;
                case DELETE: {
                    try {
                        System.out.println(stalkerAction.toString());
                        final String source = urlParameter.get(0);
                        System.out.println("url:" + source);
                        threadSafeSession.execute(String.format("delete from Stalk where humanId='%s' and mood='%c' and urlHash='%s';", hashUser, MOOD.LIFE.ALIVE.state, source));//Yet to hash the urlHash value


                        final ResultSet execute = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' and mood='%c'", hashUser, MOOD.LIFE.ALIVE.state));
                        final List<Row> all = execute.all();

                        for (final Row row : all) {
                            final YawnItem yawnItem = new Gson().fromJson(row.getString("value"), YawnItem.class);

                            if (yawnItem.source.equals(source)) {
                                threadSafeSession.execute(String.format("delete from Yawn where humanId='%s' and mood='%c' and urlHash='%s';", hashUser, MOOD.LIFE.ALIVE.state, yawnItem.link));
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace(System.err);
                    }
                }
                break;
                case ERROR:
                    break;
            }

        }

        return new Gson().toJson(new Return<ReturnValueStalk>(new ReturnValueStalk(stalkItems), "", "OK"));
    }

    void open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        cluster.connect();
        threadSafeSession = cluster.connect("NewsMute");
        Printer.printClusterMetadata(cluster);
    }

    public void close() {
        cluster.shutdown();
    }


}





