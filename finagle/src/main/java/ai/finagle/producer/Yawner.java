package ai.finagle.producer;

import ai.finagle.auth.Gatekeeper;
import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.*;
import ai.finagle.util.Printer;
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
import org.mindrot.jbcrypt.BCrypt;

import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.util.HashMap;
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
public class Yawner implements Runnable {

    public static final String ACTION = "nmact";

    private final String port;

    private final String bindIp;

    private final String databaseIp;

    private Cluster cluster;

    private Session threadSafeSession;

    public Yawner(final String bindIp, final String port, final String databaseIp) {
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
            connect.execute(DBScripts.CREATE_YAWN);

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
                        final List<Map.Entry<String, String>> headers = request.getHeaders();
                        for (Map.Entry<String, String> header : headers) {
                            System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                        }
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

        ServerBuilder.safeBuild(new Gatekeeper().andThen(service), ServerBuilder.get()
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
        final String hashUser = BCrypt.hashpw(user, SuperFriender.GLOBAL_SALT);
        System.out.println("hashUser:" + hashUser);
        final String url = getParameter(parameters.get("url") );
        System.out.println("url:" + url);
        final String action = getParameter(parameters.get(ACTION));
        System.out.println("action:" + action);

        final YawnItem[] yawnItems;
        switch (YawnerAction.to(action.toUpperCase())) {
            case READ:{
                System.out.println("Values in table as follows");
                final ResultSet execute = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' and mood='%c'", hashUser, MOOD.LIFE.ALIVE.state));
                final List<Row> all = execute.all();

                final HashMap<String, YawnItem> mostPopularOfFeedSource = new HashMap<String, YawnItem>();

                for (final Row row : all) {
                    final YawnItem yawnItem = new Gson().fromJson(row.getString("value"), YawnItem.class);
                    final int yawnItemShocks = Integer.parseInt(yawnItem.shocks());
                    final YawnItem lastValue = mostPopularOfFeedSource.put(yawnItem.source, yawnItem);
                    if (lastValue != null && yawnItemShocks > 0) {
                        if (Integer.parseInt(lastValue.shocks()) > yawnItemShocks) {
                            mostPopularOfFeedSource.put(row.getString("urlHash"), lastValue);//Replacing with last value since it is more popular
                        }
                    }
                }

                YawnItem[] temp = new YawnItem[mostPopularOfFeedSource.size()];
                temp  = mostPopularOfFeedSource.values().toArray(temp );
                yawnItems = temp;
            }

            break;
            case READ_ONE:{
                System.out.println("Values in table as follows");
                final ResultSet execute = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' and mood='%c'", hashUser, MOOD.LIFE.ALIVE.state));
                final List<Row> all = execute.all();

                final HashMap<String, YawnItem> mostPopularOfFeedSource = new HashMap<String, YawnItem>();

                for (final Row row : all) {
                    final YawnItem yawnItem = new Gson().fromJson(row.getString("value"), YawnItem.class);
                    final int yawnItemShocks = Integer.parseInt(yawnItem.shocks());
                    final YawnItem lastValue = mostPopularOfFeedSource.put(yawnItem.source, yawnItem);
                    if (lastValue != null && yawnItemShocks > 0) {
                        if (Integer.parseInt(lastValue.shocks()) > yawnItemShocks) {
                            mostPopularOfFeedSource.put(row.getString("urlHash"), lastValue);//Replacing with last value since it is more popular
                        }
                    }
                }

                final YawnItem popularEntryForSource = mostPopularOfFeedSource.get(url);

                if(popularEntryForSource != null){
                    yawnItems = new YawnItem[]{popularEntryForSource};
                } else {
                    yawnItems = new YawnItem[]{};
                }

            }

            break;
            case DELETE: {
                yawnItems = new YawnItem[0];//@TODO: This is just to supply the return value, have to move things round
                try {
                    threadSafeSession.execute(String.format("delete from Yawn where humanId='%s' and mood='%c' and urlHash='%s';", hashUser, MOOD.LIFE.ALIVE.state, url));//Yet to hash the urlHash value
                    threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','') USING TTL %d;", hashUser, MOOD.LIFE.DEAD.state, url, DBScripts.YAWN_READED_TTL));
                } catch (Exception e) {
                    e.printStackTrace(System.err);
                }
            }
            break;
            case ERROR:
                yawnItems = new YawnItem[0];//@TODO: This is just to supply the return value, have to move things round
                break;
            default:
                yawnItems = new YawnItem[0];//@TODO: This is just to supply the return value, have to move things round
        }



        return new Gson().toJson(new Return<ReturnValueYawn>(new ReturnValueYawn(yawnItems), "No Error", "OK"));
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





