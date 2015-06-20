package ai.newsmute.service;

import ai.newsmute.auth.Gatekeeper;
import ai.newsmute.db.DBScripts;
import ai.newsmute.db.MOOD;
import ai.newsmute.model.Return;
import ai.newsmute.model.ReturnValueStalk;
import ai.newsmute.model.StalkItem;
import ai.newsmute.model.YawnItem;
import ai.newsmute.util.Feed;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.*;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.InetSocketAddress;
import java.util.ArrayList;
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

    private static final Logger LOG = LoggerFactory.getLogger(Stalker.class);

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    @Autowired
    public DBScripts.DB db;

    private Cluster cluster;

    private Session threadSafeSession;

    private DynamoDB dynamoDB;

    private Table tableStalk;
    private Table tableYawn;
    private Table tableSuperFriend;

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

        switch (db) {
            case DynamoDB:
                break;
            case Cassandra:
                this.open(databaseIp);

                final Session connect = cluster.connect("NewsMute");
                try {
                    connect.execute(DBScripts.CREATE_STALK);

                } catch (final Exception e) {//Table already exists
                    LOG.info(e.getMessage());
                }
                break;
            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
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
                            LOG.info("Header:" + header.getKey() + " value:" + header.getValue());
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
        LOG.info("hashUser:" + hashUser);
        final List<String> urlParameter = parameters.get("url");
        final List<String> action = parameters.get(Yawner.ACTION);
        StalkItem[] stalkItems = new StalkItem[]{};

        StalkerAction stalkerAction = StalkerAction.valueOf(action.get(0));
        switch (stalkerAction) {
            case CREATE: {
                try {
                    LOG.info(stalkerAction.toString());
                    final String url = urlParameter.get(0);
                    LOG.info("url:" + url);
                    final SyndFeed document = Feed.getFeed(url);
                    final String title = document.getTitle();
                    LOG.info("title:" + title);
                    final String description = document.getDescription();
                    LOG.info("description:" + description);

                    switch (db) {
                        case DynamoDB:
                            tableStalk.putItem(new Item().withPrimaryKey("humanId", hashUser, "ranger", MOOD.LIFE.ALIVE.state + url).with("value", new Gson().toJson(new StalkItem(url, title, description))));
                            break;
                        case Cassandra:
                            threadSafeSession.execute(String.format("insert into Stalk(humanId, mood, urlHash, value) values('%s','%c','%s','%s');", hashUser, MOOD.LIFE.ALIVE.state, url, new Gson().toJson(new StalkItem(url, title, description))));//Yet to hash the urlHash value
                            break;
                        default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                    }

                    doHarvestItem(url, hashUser);

                } catch (final Throwable e) {
                    LOG.error("Error during delete", e);
                }
            }
            break;
            case READ: {
                LOG.info("Values in table as follows");
                switch (db) {

                    case DynamoDB:{
                        final ItemCollection<QueryOutcome> all = tableStalk.query("humanId", hashUser);

                        final List<StalkItem> itemArrayList = new ArrayList<StalkItem>();

                        for (final Item item : all) {
                            itemArrayList.add(new Gson().fromJson(item.getString("value"), StalkItem.class));
                        }
                        stalkItems = itemArrayList.toArray(new StalkItem[itemArrayList.size()]);
                        break;
                    }
                    case Cassandra:{
                        final ResultSet execute = threadSafeSession.execute(String.format("select * from Stalk where humanId='%s'", hashUser));
                        final List<Row> all = execute.all();

                        stalkItems = new StalkItem[all.size()];

                        for (int i = 0; i < stalkItems.length; i++) {
                            stalkItems[i] = new Gson().fromJson(all.get(i).getString("value"), StalkItem.class);
                        }
                        break;
                    }
                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                }

            }
            break;
            case DELETE: {
                try {
                    LOG.info(stalkerAction.toString());
                    final String source = urlParameter.get(0);
                    LOG.info("url:" + source);

                    switch (db) {
                        case DynamoDB:{

                            tableStalk.deleteItem("humanId", hashUser,"ranger", MOOD.LIFE.ALIVE.state + source);

                            final ItemCollection<QueryOutcome> all = tableYawn.query("humanId", hashUser, new RangeKeyCondition("ranger").beginsWith(String.valueOf(MOOD.LIFE.ALIVE.state)));

                            for (final Item item : all) {
                                final YawnItem yawnItem = new Gson().fromJson(item.getString("value"), YawnItem.class);

                                if (yawnItem.source.equals(source)) {
                                    tableYawn.deleteItem("humanId", hashUser, "ranger", MOOD.LIFE.ALIVE.state + yawnItem.link);
                                }
                            }
                            break;
                        }
                        case Cassandra:{
                            threadSafeSession.execute(String.format("delete from Stalk where humanId='%s' and mood='%c' and urlHash='%s';", hashUser, MOOD.LIFE.ALIVE.state, source));//Yet to hash the urlHash value

                            final ResultSet execute = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' and mood='%c'", hashUser, MOOD.LIFE.ALIVE.state));
                            final List<Row> all = execute.all();

                            for (final Row row : all) {
                                final YawnItem yawnItem = new Gson().fromJson(row.getString("value"), YawnItem.class);

                                if (yawnItem.source.equals(source)) {
                                    threadSafeSession.execute(String.format("delete from Yawn where humanId='%s' and mood='%c' and urlHash='%s';", hashUser, MOOD.LIFE.ALIVE.state, yawnItem.link));
                                }
                            }
                            break;
                        }
                        default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                    }

                    if(!source.startsWith("http:")){
                        LOG.info("Deleted source:" + source);

                        switch (db) {

                            case DynamoDB:
                                tableSuperFriend.deleteItem("humanId", source, "humanSuperFriend", hashUser);
                                break;
                            case Cassandra:
                                threadSafeSession.execute(String.format("delete from SuperFriend where humanId='%s' and humanSuperFriend='%s';",
                                        source,
                                        hashUser
                                ));
                                break;
                        }
                    }

                } catch (Exception e) {
                    LOG.error("Error during delete", e);
                }
            }
            break;
            case ERROR:
                break;
        }

        return new Gson().toJson(new Return<ReturnValueStalk>(new ReturnValueStalk(stalkItems), "", "OK"));
    }

    private int doHarvestItem( final String feedLink, final String humanId) {
        int totalInsertions = 0;

        try {//Please match this with Stalker first time feed setup
            LOG.info("Processing feed:" + feedLink);

            for (final StalkItem stalkFeedItem : Feed.getFeedEntries(feedLink)) {
                final String feedItemTitle = stalkFeedItem.title;
                final String feedItemLink = stalkFeedItem.link;
                final String feedItemDescription = stalkFeedItem.description;


                switch (db) {
                    case DynamoDB:
                        final Item yawnRowNotRead = tableYawn.getItem("humanId", humanId, "ranger", MOOD.LIFE.ALIVE.state + feedItemLink);
                        final Item yawnRowDidRead = tableYawn.getItem("humanId", humanId, "ranger", MOOD.LIFE.DEAD.state + feedItemLink);
                        if (yawnRowNotRead == null && yawnRowDidRead == null) {
                            tableYawn.putItem(new Item().withPrimaryKey("humanId", humanId, "ranger", MOOD.LIFE.ALIVE.state + feedItemLink).with("value", new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0"))));
                            totalInsertions++;
                        }
                        break;
                    case Cassandra:
                        final ResultSet yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.ALIVE.state, feedItemLink));
                        final ResultSet yawnRowsDidRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.DEAD.state, feedItemLink));
                        if (yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty()) {
                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", humanId, MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0")), DBScripts.HARVESTED_YAWN_TTL));//Yet to hash the urlHash value
                            totalInsertions++;
                        }
                        break;
                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                }
            }
        } catch (final Throwable throwable) {
            System.err.println(throwable.getMessage());//Don't print full stack trace, will be hard to see what is failing and what is not
        }
        return totalInsertions;
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





