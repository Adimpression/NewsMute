package ai.newsmute.service;

import ai.newsmute.auth.Gatekeeper;
import ai.newsmute.db.DBScripts;
import ai.newsmute.db.MOOD;
import ai.newsmute.model.Return;
import ai.newsmute.model.ReturnValueScream;
import ai.newsmute.model.YawnItem;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.*;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

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

    private static final Logger LOG = LoggerFactory.getLogger(Screamer.class);

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    @Autowired
    public DBScripts.DB db;

    private Cluster cluster;

    private Session threadSafeSession;

    private DynamoDB dynamoDB;

    private Table tableScream;
    private Table tableYawn;

    public Screamer(final String bindIp, final String port, final String databaseIp) {
        this.bindIp = bindIp;
        this.port = port;
        this.databaseIp = databaseIp;
    }

    /**
     * @TODO:
     * Command line config for IP, Port, Thread Pool Size
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
                        connect.execute(DBScripts.CREATE_SCREAM);
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
                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0,HttpResponseStatus.OK);
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

            if(user != null && urlParameter != null){
                for (String s : urlParameter) {
                    try {
                        LOG.info("url:" + s);
                        final String unhashedUser = user.get(0);
                        LOG.info("user:" +unhashedUser);
                        final String hashedUser = BCrypt.hashpw(unhashedUser, SuperFriender.GLOBAL_SALT);
                        LOG.info("hashed user:" + hashedUser);

                        final boolean noRecord;
                        switch (db) {
                            case DynamoDB:
                                noRecord = tableYawn.getItem(new PrimaryKey().addComponents(new KeyAttribute("humanId", hashedUser), new KeyAttribute("mood", MOOD.LIFE.DEAD.state), new KeyAttribute("urlHash", s))) == null;
                                break;
                            case Cassandra:
                                final List<Row> screamRowsCounselled = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", hashedUser, MOOD.LIFE.DEAD.state, s)).all();
                                noRecord = screamRowsCounselled.isEmpty();
                                break;
                            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                        }

                        if(noRecord){
                            try {
                                final Document document = Jsoup.parse(new URL(s).openStream(), "UTF-8", s);

                                final String title = document.getElementsByTag("title").first().text();
                                LOG.info("title:" + title);
                                String description = title;
                                for (final Element meta : document.getElementsByTag("meta")) {
                                    if (meta.attr("name").equalsIgnoreCase("description")) {
                                        description = meta.attr("content");
                                        break;
                                    }
                                }
                                LOG.info("description:" + description);

                                final String value = new Gson().toJson(new YawnItem(s, title, description, hashedUser, "0"));

                                switch (db) {
                                    case DynamoDB:
                                        tableScream.putItem(new Item().withPrimaryKey(new PrimaryKey(new KeyAttribute("humanId", hashedUser),new KeyAttribute("mood", MOOD.LIFE.ALIVE.state), new KeyAttribute("urlHash", s))).withString("value", value));
                                        break;
                                    case Cassandra:
                                        threadSafeSession.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", hashedUser, MOOD.LIFE.ALIVE.state, s, value, DBScripts.YAWN_COUNSEL));//Yet to hash the urlHash value
                                        break;
                                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                                }

                            } catch (final Throwable e) {//Leave the insert here alone. Works as a default if the internet connectivity decides to break. We discovered this when application was running on a non www accessible server
                                e.printStackTrace(System.out);

                                final String defaultValue = new Gson().toJson(new YawnItem(s, s, s, hashedUser, "0"));

                                switch (db) {
                                    case DynamoDB:
                                        tableScream.putItem(new Item().withPrimaryKey(new PrimaryKey(new KeyAttribute("humanId", hashedUser),new KeyAttribute("mood", MOOD.LIFE.ALIVE.state), new KeyAttribute("urlHash", s))).withString("value", defaultValue));
                                        break;
                                    case Cassandra:
                                        threadSafeSession.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", hashedUser, MOOD.LIFE.ALIVE.state, s, defaultValue, DBScripts.YAWN_COUNSEL));//Yet to hash the urlHash value
                                        break;
                                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                                }
                            }
                        } else{
                            LOG.info("Ignoring already screamed item for humanId:" + hashedUser + " for url:" + s);
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

    void open(String node) {
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





