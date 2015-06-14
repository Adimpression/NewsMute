package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import ai.newsmute.model.GuardianItem;
import ai.newsmute.model.Return;
import ai.newsmute.model.ReturnValueGuardian;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.*;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.google.gson.Gson;
import com.mashape.unirest.http.*;
import com.mashape.unirest.request.HttpRequestWithBody;
import com.mashape.unirest.request.body.MultipartBody;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.buffer.ChannelBuffer;
import org.jboss.netty.buffer.ChannelBuffers;
import org.jboss.netty.handler.codec.http.*;
import org.jboss.netty.handler.codec.http.HttpResponse;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 *
 *
 *
 * <ul>
 *     <li>
 *         As for password/session management, we have the following things to think about:
 *         <ol>
 *             <li>
 *                  We always consider the user has a trojan enabled bare-bone browser(tebbb), let's say a hacker
 *             </li>
 *             <li>
 *                 User A, with password PA, confirms a to a database match, during which we add a cookie to the users tebbb
 *             </li>
 *             <li>
 *                 Now, this cookie value, is the only item preventing a User B, from mimicking A using a tebbb
 *             </li>
 *             <li>
 *                 Let's say this cookie value, is the hashOf(usernamehash + passwordhash + randomNumber). Now we can check the validity in this way:
 *                 See if the cookie is actually present on our {@link java.util.Map}, then we consider this user valid, for the usernamehash claimed in the request, if it is the same on the {@link java.util.Map}
 *             </li>
 *         </ol>
 *     </li>
 *     <li>
 *         Netty cookie management: http://netty.io/4.0/api/io/netty/handler/codec/http/ServerCookieEncoder.html
 *     </li>
 * </ul>
 *
 * http://netty.io/4.0/api/io/netty/handler/codec/http/Cookie.html
 *
 * Following are the thinking lines for validating the user's email.
 *
 * <ol>
 *     <li>
 *         A malicious user B is using A's email a@example.com to validate himself (B) into our system, with some chosen password.<br/>
 *         This can even be a password reset by A. <br/>
 *         Or a new and ordinary signup by A.      <br/>
 *     </li>
 *     <li>
 *         We store the password + salt has in the session table along with the email hash
 *     </li>
 *     <li>
 *         A or B, now (after clicking on the valid link) is sent to login.
 *     </li>
 *     <li>
 *         By the time A and B login, A should be able to login and B should fail.
 *     </li>
 * </ol>
 *
 * <ol>
 *     <li>
 *         When A or B, sends in a sign up or reset request, we just store the password hash (key) and the email hash (value) in the session table.
 *     </li>
 *     <li>
 *         Once A clicks the validation link, which will point to the password hash, we take the email hash, and store it in the user table as key, and the password hash as value
 *     </li>
 *     <li>
 *         Next time A logs in, it will work because the password set is now the updated value in the table.
 *     </li>
 *     <li>
 *         If B tries a reset on A's account, it won't take effect until the link is clicked from the email sent to A.
 *         A still can login.
 *     </li>
 *     <li>
 *         Though this is a different kind of session put in the session table, is it safe? Will it conflict with existing sessions?
 *
 *     </li>
 * </ol>
 *
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Guardian implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(Guardian.class);

    public static final String X_SESSION_HEADER = "x-session-header";

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    @Autowired
    public DBScripts.DB db;

    private Cluster cluster;

    private Session threadSafeSession;

    private DynamoDB dynamoDB;

    private Table tableGuardian;
    private Table tableSession;

    public Guardian(final String bindIp, final String port, final String databaseIp) {
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
                    connect.execute(DBScripts.CREATE_GUARDIAN);
                } catch (final Exception e) {//Table already exists
                    LOG.info(e.getMessage());
                }
                //Don't merge up and down try/catches, we need to see the failure upon consecutive runs
                try {
                    //threadSafeSession.execute("drop table Guardian;");
                    connect.execute(DBScripts.CREATE_SESSION);
                } catch (final Exception e) {//Table already exists
                    LOG.info(e.getMessage());
                }
                break;
            default:
                throw new UnsupportedOperationException("Unknown DB Type:" + db);
        }

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blocking requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {

                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);

                        final String cookieValue = request.getHeader(X_SESSION_HEADER);
                        LOG.info(X_SESSION_HEADER + ":" + cookieValue);

                        final Return<ReturnValueGuardian> result;

                        if (cookieValue != null) {//User already has a session
                            final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
                            final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

                            final List<String> user = parameters.get("user");
                            final String hashUser = BCrypt.hashpw(user.get(0), SuperFriender.GLOBAL_SALT);
                            LOG.info("hashUser:" + hashUser);

                            final String humanIdHash = blockingSessionRead(cookieValue);
                            LOG.info("humanIdHash:" + humanIdHash);

                            if (humanIdHash != null) {
                                if (humanIdHash.equals(hashUser)) {
                                    httpResponse.setStatus(HttpResponseStatus.OK);
                                    httpResponse.setHeader(X_SESSION_HEADER, cookieValue);
                                    result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.OK)}), "Session ok", "OK");
                                } else {//Crazy stuff, either the session was hijacked our we did a client programming mess
                                    LOG.info("Session present, but humanId hashes don't match! Resetting session to empty string.");
                                    httpResponse.setHeader(X_SESSION_HEADER, "");
                                    result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Session matched but users don't match", "OK");
                                }
                            } else {//Wrong session, bad bad bad
                                LOG.info("No such session! Resetting session to empty string.");
                                httpResponse.setHeader(X_SESSION_HEADER, "");
                                result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "No such session", "OK");
                            }

                        } else {//We need to create a session
                            LOG.info("COOKIE IS MISSING");

                            result = blocking(request);

                            final GuardianItem guardianItem = result.returnValue.data[0];
                            if (result.returnStatus.equals("OK")) {
                                if (guardianItem.status.equals(GuardianItem.OK)) {
                                    final String randomUnique = guardianItem.tokenHash + System.currentTimeMillis();
                                    blockingSessionWrite(randomUnique, guardianItem.humanIdHash);
                                    httpResponse.setHeader(X_SESSION_HEADER, randomUnique);
                                } else if (guardianItem.status.equals(GuardianItem.ERROR)) {
                                    LOG.info(result.returnMessage);
                                } else {
                                    LOG.info("UNIDENTIFIED ERROR");
                                }
                            } else {
                                LOG.info("UNIDENTIFIED ERROR");
                            }
                        }

                        final byte[] resultBytes;
                        try {
                                resultBytes = new Gson().toJson(result).getBytes("UTF-8");
                        } catch (UnsupportedEncodingException e) {
                            throw new RuntimeException(e);
                        }

                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        httpResponse.setHeader("Content-Type", "text/html; charset=utf-8");

                        Printer.printHeaders(request);
                        Printer.printHeaders(httpResponse);

                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(bindIp, Integer.parseInt(port))));

        //this.close();
    }

    private Return<ReturnValueGuardian> blocking(final HttpRequest request) {
        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");
        final String hashUser = BCrypt.hashpw(user.get(0), SuperFriender.GLOBAL_SALT);
        LOG.info("hashUser:" + hashUser);
        final List<String> tokenParameter = parameters.get("token");
        final String token = tokenParameter.get(0);
        LOG.info("token:" + token);
        final List<String> action = parameters.get(Yawner.ACTION);
        final GuardianAction guardianAction = GuardianAction.valueOf(action.get(0));
        LOG.info("guardianAction:" + guardianAction.toString());

        switch (guardianAction) {
            case CREATE: {
                switch (db) {
                    case DynamoDB:
                        tableGuardian.putItem(new Item().withPrimaryKey("humanId", hashUser).withString("value", BCrypt.hashpw(token, BCrypt.gensalt(12))));
                        break;
                    case Cassandra:
                        threadSafeSession.execute(String.format("insert into Guardian(humanId, value) values('%s','%s');", hashUser, BCrypt.hashpw(token, BCrypt.gensalt(12))));
                        break;
                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                }
                new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.OK)}), "Create", "OK");
            }
            case READ: {
                final String tokenHash = blockingReadGuardianEntry(hashUser);
                if (tokenHash != null) {
                    if (BCrypt.checkpw(token, tokenHash)) {
                        return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, tokenHash, GuardianItem.OK)}), "Password correct", "OK");
                    } else {
                        return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Password incorrect", "OK");
                    }
                } else {
                    //Need to signup first
                    return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.NO_ACCOUNT)}), "Not yet signed up", "OK");
                }
            }
            case ERROR:{
                return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Unknown action", "ERROR");
            }
        }
        return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Unhandled operation", "ERROR");
    }

    private String blockingReadGuardianEntry(final String hashUser) {
        switch (db) {
            case DynamoDB:
                return tableGuardian.getItem(new PrimaryKey().addComponents(new KeyAttribute("humanId", hashUser))).getString("humanId");
            case Cassandra:
                    final ResultSet execute = threadSafeSession.execute(String.format("select * from Guardian where humanId='%s'", hashUser));
                    final List<Row> all = execute.all();
                    if(all.isEmpty()){
                        return null;
                    } else {
                        final Row row = all.get(0);
                        if (row == null) {
                            return null;
                        } else {
                            return blockingReadGuardianEntry(hashUser);
                        }
                    }
            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
        }
    }

    private String blockingSessionRead(final String sessionId) {
        final Session connect = cluster.connect("NewsMute");
        final ResultSet execute = connect.execute(String.format("select * from Session where sessionId='%s'", sessionId));
        for (final Row row : execute.all()) {
            final String aStoredSessionId = row.getString("sessionId");
            if(aStoredSessionId.equals(sessionId)){
                return  row.getString("value");
            }
        }
        return null;
    }

    private void  blockingSessionWrite(final String sessionId, final String humanId) {
        switch (db) {
            case DynamoDB:
                tableSession.putItem(new Item().withPrimaryKey("sessionId", sessionId).withString("humanId", humanId));
                break;
            case Cassandra:
                threadSafeSession.execute(String.format("insert into Session(sessionId, value) values('%s','%s') USING TTL %d;", sessionId, humanId, DBScripts.SESSION_TTL));
                break;
            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
        }
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





