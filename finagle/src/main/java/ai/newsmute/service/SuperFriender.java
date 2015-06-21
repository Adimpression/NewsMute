package ai.newsmute.service;

import ai.newsmute.auth.Gatekeeper;
import ai.newsmute.db.DBScripts;
import ai.newsmute.model.Return;
import ai.newsmute.model.ReturnValueSuperFriend;
import ai.newsmute.model.SuperFriendValue;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Session;
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
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Answers: Who are my super friends
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class SuperFriender implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(SuperFriender.class);

    public static final String GLOBAL_SALT = "$2a$10$SzCczWIG7DFBKi2jr8yDz.";

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

    @Autowired
    public DBScripts.DB db;

    private DynamoDB dynamoDB;

    private Table tableSuperFriend;

    private Session threadSafeSession;

    public SuperFriender(final String bindIp, final String port, final String databaseIp) {
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
                    connect.execute(DBScripts.CREATE_SUPERFRIEND);

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
                        httpResponse.setHeader("Content-Type", "text/html; charset=utf-8");
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

        final List<String> userParameterValues = parameters.get("user");
        final List<String> usersParameterValues = parameters.get("users");
        final String returnVal;

        if (userParameterValues != null) {
            //@TODO: Remove unwanted emails such as unsubscribe@mailinglist.com(limit by keyword) or 123123980u09203412341343@_23e234LLgmail.com(limit by length)
            final String user = userParameterValues.get(0);
            LOG.info("user:" + user);
            final String hasheduser = BCrypt.hashpw(user, new String(SuperFriender.GLOBAL_SALT));
            LOG.info("hashed user:" + hasheduser);
            if (usersParameterValues != null) {//Adding friends

                final String[] newContacts = usersParameterValues.get(0).split("\\|");

                for (final String contact : newContacts) {
                    if (contact != null && !contact.isEmpty()) {
                        final String superFriendHash = BCrypt.hashpw(contact, new String(GLOBAL_SALT));
                        final String value = new Gson().toJson(new SuperFriendValue(hasheduser, new String[]{superFriendHash}));
                        switch (db) {
                            case DynamoDB:
                                tableSuperFriend.putItem(new Item().withPrimaryKey("humanId", hasheduser, "ranger", superFriendHash).withString("value", value));
                                break;
                            case Cassandra:
                                threadSafeSession.execute(String.format("insert into SuperFriend(humanId, humanSuperFriend, value) values('%s','%s','%s');",
                                        hasheduser,
                                        superFriendHash,
                                        value));//Yet to hash the urlHash value
                                break;
                            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                        }
                    }
                }

                if (newContacts.length == 1) {//woeid
                    final String inverseContact = newContacts[0];
                    if (inverseContact != null && !inverseContact.isEmpty()) {
                        final String inverseSuperFriendHash = BCrypt.hashpw(inverseContact, new String(GLOBAL_SALT));
                        final String value = new Gson().toJson(new SuperFriendValue(hasheduser, new String[]{inverseSuperFriendHash}));
                        switch (db) {
                            case DynamoDB:
                                tableSuperFriend.putItem(new Item().withPrimaryKey("humanId", inverseSuperFriendHash, "ranger", hasheduser).withString("value", value));
                                break;
                            case Cassandra:
                                threadSafeSession.execute(String.format("insert into SuperFriend(humanId, humanSuperFriend, value) values('%s','%s','%s');",
                                        inverseSuperFriendHash,
                                        hasheduser,
                                        value));//Yet to hash the urlHash value
                                break;
                            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                        }
                    }
                }

                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{}), "", "OK"));

            } else {
                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[0]), "MINIMALLY, THE user AND users PARAMETER ARE REQUIRED", "ERROR"));
            }
        } else {
            returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{}), "MINIMALLY, THE user AND users PARAMETER ARE REQUIRED", "ERROR"));
        }

        return returnVal;
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





