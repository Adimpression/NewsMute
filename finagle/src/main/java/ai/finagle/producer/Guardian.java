package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.model.GuardianItem;
import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueGuardian;
import com.datastax.driver.core.*;
import com.google.common.net.*;
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
import org.jboss.netty.handler.codec.http.HttpHeaders;
import org.mindrot.jbcrypt.BCrypt;

import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.util.*;
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
 *
 * Just logging a few things noticed on the server, to be fixed:
 *
 * If the session isn't present:
 *
 * No such session (humanIdHash is null), UNAUTHORIZED
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Guardian implements Runnable {

    public static final String X_SESSION_HEADER = "x-session-header";

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

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
        this.open(databaseIp);


        final Session connect = cluster.connect("NewsMute");
        try {
            //connect.execute("drop table Guardian;");
            connect.execute(DBScripts.CREATE_GUARDIAN);
        } catch (final Exception e) {//Table already exists
            System.out.println(e.getMessage());
        }
        //Don't merge up and down try/catches, we need to see the failure upon consecutive runs
        try {
            //connect.execute("drop table Guardian;");
            connect.execute(DBScripts.CREATE_SESSION);
        } catch (final Exception e) {//Table already exists
            System.out.println(e.getMessage());
        }


        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {

                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK);

                        String cookieValue = null;

                        final String value = request.getHeader(HttpHeaders.Names.COOKIE);
                        if(value != null){
                            final Set<Cookie> cookies = new CookieDecoder().decode(value);
                            for (final Cookie cookie : cookies) {
                                if (cookie.getName().equals("session")) {
                                    cookieValue = cookie.getValue();
                                    break;
                                }
                            }
                        }

                        if (cookieValue == null){
                            cookieValue = request.getHeader(X_SESSION_HEADER);
                            System.out.println(X_SESSION_HEADER + ":" + cookieValue);
                        }


                        final Return<ReturnValueGuardian> result;

                        if (cookieValue != null) {//User already has a session

                            final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
                            final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

                            final List<String> user = parameters.get("user");
                            final String hashUser = BCrypt.hashpw(user.get(0), SuperFriender.GLOBAL_SALT);
                            System.out.println("hashUser:" + hashUser);

                            final String humanIdHash = blockingSessionRead(cookieValue);
                            System.out.println("humanIdHash:" + humanIdHash);

                            if (humanIdHash != null) {
                                if (humanIdHash.equals(hashUser)) {
                                    httpResponse.setStatus(HttpResponseStatus.OK);
                                    httpResponse.addHeader(HttpHeaders.Names.SET_COOKIE, cookieValue);
                                    result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.OK)}), "Session ok", "OK");
                                } else {//Crazy stuff, either the session was hijacked our we did a client programming mess
                                    System.out.println("Session present, but humanId hashes don't match!");
                                    //We just reset the cookie
                                    {
                                        CookieEncoder encoder = new CookieEncoder(true);
                                        final DefaultCookie defaultCookie = new DefaultCookie("session", "BAD! COOKIE DELETION ON BROWSER HAS FAILED");
                                        //defaultCookie.setHttpOnly(true);
                                        defaultCookie.setMaxAge(0);//A day
                                        //defaultCookie.setDomain();

                                        encoder.addCookie(defaultCookie);

                                        httpResponse.setHeader(HttpHeaders.Names.SET_COOKIE, encoder.encode());

                                        httpResponse.setHeader(X_SESSION_HEADER, "");
                                    }
                                    result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Session matched but users don't match", "OK");
                                }
                            } else {//Wrong session, bad bad bad
                                System.out.println("No such session!");
                                {
                                    final CookieEncoder encoder = new CookieEncoder(true);
                                    final DefaultCookie defaultCookie = new DefaultCookie("session", "BAD! COOKIE DELETION ON BROWSER HAS FAILED");
                                    //defaultCookie.setHttpOnly(true);
                                    defaultCookie.setMaxAge(0);//Remove immediately
                                    //defaultCookie.setDomain();

                                    encoder.addCookie(defaultCookie);

                                    httpResponse.setHeader(HttpHeaders.Names.SET_COOKIE, encoder.encode());

                                    httpResponse.setHeader(X_SESSION_HEADER, "");
                                }
                                result = new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "No such session", "OK");
                            }

                        } else {//We need to create a session

                            System.out.println("COOKIE IS MISSING");

                            result = blocking(request);

                            final GuardianItem guardianItem = result.returnValue.data[0];
                            if (result.returnStatus.equals("OK") && guardianItem.status.equals(GuardianItem.OK)) {
                                final String randomUnique = guardianItem.tokenHash + System.currentTimeMillis();
                                blockingSessionWrite(randomUnique, guardianItem.humanIdHash);

                                CookieEncoder encoder = new CookieEncoder(true);
                                final DefaultCookie defaultCookie = new DefaultCookie("session", randomUnique);
                                //defaultCookie.setHttpOnly(true);
                                defaultCookie.setMaxAge(86400);//A day
                                //http://stackoverflow.com/questions/106`2963/how-do-browser-cookie-domains-work
                                //defaultCookie.setDomain();

                                encoder.addCookie(defaultCookie);

                                httpResponse.setHeader(HttpHeaders.Names.SET_COOKIE, encoder.encode());

                                httpResponse.setHeader(X_SESSION_HEADER, randomUnique);
                            } else {
                                System.out.println("UNIDENTIFIED ERROR");
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

                        for (Map.Entry<String, String> header : request.getHeaders()) {
                            System.out.println("Request Header:" + header.getKey() + " value:" + header.getValue());
                        }

                        for (final Map.Entry<String, String> next : httpResponse.getHeaders()) {
                            System.out.println("Response Header:" + next.getKey() + " value:" + next.getValue());
                        }

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
        final Session connect = cluster.connect("NewsMute");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");
        final String hashUser = BCrypt.hashpw(user.get(0), SuperFriender.GLOBAL_SALT);
        System.out.println("hashUser:" + hashUser);
        final List<String> tokenParameter = parameters.get("token");
        final String token = tokenParameter.get(0);
        System.out.println("token:" + token);
        final List<String> action = parameters.get(Yawner.ACTION);
        final GuardianAction guardianAction = GuardianAction.valueOf(action.get(0));
        System.out.println("guardianAction:" + guardianAction.toString());

        switch (guardianAction) {
            case CREATE: {
                connect.execute(String.format("insert into Guardian(humanId, value) values('%s','%s');", hashUser, BCrypt.hashpw(token, BCrypt.gensalt(12))));
                new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.OK)}), "Create", "OK");
            }
            case READ: {
                final ResultSet execute = connect.execute(String.format("select * from Guardian where humanId='%s'", hashUser));
                final List<Row> all = execute.all();
                if (!all.isEmpty()) {
                    final Row row = all.get(0);
                    final String tokenHash = row.getString("value");
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
            case ERROR:
                return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Unknown action", "ERROR");
        }
        return new Return<ReturnValueGuardian>(new ReturnValueGuardian(new GuardianItem[]{new GuardianItem(hashUser, null, GuardianItem.ERROR)}), "Unhandled operation", "ERROR");
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
        final Session connect = cluster.connect("NewsMute");
        connect.execute(String.format("insert into Session(sessionId, value) values('%s','%s') USING TTL %d;", sessionId, humanId, DBScripts.SESSION_TTL));
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





