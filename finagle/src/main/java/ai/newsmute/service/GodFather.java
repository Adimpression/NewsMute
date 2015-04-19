package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import ai.newsmute.model.*;
import ai.newsmute.util.Email;
import ai.newsmute.util.Printer;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
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

import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;


/**
 * Answers the question: What have my super friends found interesting
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class GodFather implements Runnable {

    private static final String ACTION = "nmact";

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

    private Session threadSafeSession;

    public GodFather(final String bindIp, final String port, final String databaseIp) {
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

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blocking requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final String result = blocking(request);
                        final HttpResponse httpResponse = new DefaultHttpResponse(HttpVersion.HTTP_1_0, HttpResponseStatus.OK);
                        Printer.printHeaders(request);
                        byte[] resultBytes;
                        try {
                            resultBytes = result.getBytes("UTF-8");
                        } catch (UnsupportedEncodingException e) {
                            resultBytes = new byte[0];
                        }

                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        httpResponse.setHeader("Content-Type", "text/html; charset=utf-8");
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

    private String blocking(HttpRequest request) {
        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final String user = getParameter(parameters.get("user"));
        System.out.println("user:" +user);
        final List<String> emailParameter = parameters.get("email");
        final String email = (emailParameter != null && !emailParameter.isEmpty()) ? emailParameter.get(0) : null;
        System.out.println("email:" + email);
        final List<String> tokenParameter = parameters.get("token");
        final String token = tokenParameter.get(0);
        System.out.println("token:" + token);
        final String action = getParameter(parameters.get(ACTION));
        System.out.println("action:" + action);


        final String hashUser = BCrypt.hashpw(user, SuperFriender.GLOBAL_SALT);
        System.out.println("hashUser:" + hashUser);

        switch (GodFatherAction.to(action.toUpperCase())) {
            case CREATE: {
                final String verifyToken = hashUser + System.currentTimeMillis();
                blockingEmailValidationSessionWrite(verifyToken, token);
                Email.sendHtml("News Mute <emailcheck@mutenews.com>", email, "Verify Email", String.format("Click <a href='http://yawn.newsmute.com:40700/?user=%s&token=%s&nmact=VERIFIED&email=%s'>here</a> to verify your email address.", user, verifyToken, email));
                return new Gson().toJson(new Return<ReturnValueGodFather>(new ReturnValueGodFather(new GodFatherItem[]{new GodFatherItem(email)}), "No Error", "OK"));
            }
            case VERIFIED: {
                final boolean didCreate = blockingValidatedEmailBasedCreate(hashUser, token);
                return didCreate ? "YOUR EMAIL ACCOUNT HAS BEEN VERIFIED" : "EMAIL ACCOUNT VERIFICATION FAILED";
            }
            case ERROR:
                return "Unknown error";
            default:
                return "Unknown case";
        }
    }


    private void  blockingEmailValidationSessionWrite(final String verifyToken, final String hash1Password) {
        threadSafeSession.execute(String.format("insert into Session(sessionId, value) values('%s','%s') USING TTL %d;", verifyToken, hash1Password, DBScripts.EMAIL_VALIDATION_SESSION_TTL ));
    }

    private boolean blockingValidatedEmailBasedCreate(final String hashUser, final String token) {
        final String has1hPassword = blockingSessionRead(token);
        final boolean returnVal;
        if(has1hPassword != null) {
            blockingSessionDelete(token);
            final String hash2Password = BCrypt.hashpw(has1hPassword, BCrypt.gensalt(12));
            threadSafeSession.execute(String.format("insert into Guardian(humanId, value) values('%s','%s');", hashUser, hash2Password));
            returnVal = true;
        }else{
            System.out.println("No such email validation session:" + token);
            returnVal = false;
        }
        return returnVal;
    }



    private Row blockingReadGuardianEntry(final String hashUser) {
        final ResultSet execute = threadSafeSession.execute(String.format("select * from Guardian where humanId='%s'", hashUser));
        final List<Row> all = execute.all();
        if(all.isEmpty()){
            return null;
        } else {
            return all.get(0);
        }
    }

    private String blockingSessionRead(final String sessionId) {
        final ResultSet execute = threadSafeSession.execute(String.format("select * from Session where sessionId='%s'", sessionId));
        for (final Row row : execute) {
            final String aStoredSessionId = row.getString("sessionId");
            if(aStoredSessionId.equals(sessionId)){
                return  row.getString("value");
            }
        }
        return null;
    }

    private void blockingSessionDelete(final String sessionId) {
        threadSafeSession.execute(String.format("delete from Session where sessionId='%s'", sessionId));
    }

    void open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        threadSafeSession = cluster.connect("NewsMute");

        Printer.printClusterMetadata(cluster);
    }

    public void close() {
        cluster.shutdown();
    }

    private static String getParameter(final List<String> urlParameter){
        final String returnVal;
        if (urlParameter != null){
            returnVal = urlParameter.get(0);
        } else {
            returnVal = null;
        }
        return returnVal;
    }

}





