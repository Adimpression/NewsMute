package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.model.*;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
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
import org.mindrot.jbcrypt.BCrypt;

import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.net.URL;
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

    private Cluster cluster;

    /**
     * @TODO: Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("192.168.3.2");

        final Session connect = cluster.connect("Test1");

        try {
            //connect.execute("drop table Yawn;");
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

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("23.253.36.42", 40000)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");

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
                final ResultSet execute = connect.execute(String.format("select * from Yawn where humanId='%s' and mood='0'", hashUser));
                final List<Row> all = execute.all();

                yawnItems = new YawnItem[all.size()];

                for (int i = 0; i < yawnItems.length; i++) {
                    yawnItems[i] = new Gson().fromJson(all.get(i).getString("value"), YawnItem.class);
                }

            }
            break;
            case DELETE: {
                yawnItems = new YawnItem[0];//@TODO: This is just to supply the return value, have to move things round
                try {
                    connect.execute(String.format("delete from Yawn where humanId='%s' and mood='0' and urlHash='%s';", hashUser, url));//Yet to hash the urlHash value
                    connect.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','1','%s','') USING TTL %d;", hashUser, url, DBScripts.YAWN_READED_TTL));
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
            System.out.printf("Datatacenter: %s; Host: %s; Rack: %s\n",
                    host.getDatacenter(), host.getAddress(), host.getRack());
            stringBuilder.append("Datatacenter: " + host.getDatacenter() + "; Host: " + host.getAddress() + "; Rack: " + host.getRack());
        }
        return stringBuilder.toString();
    }

    public void close() {
        cluster.shutdown();
    }

    public static String getParameter(final List<String> urlParameter){
        final String returnVal;
        if (urlParameter != null){
            returnVal = urlParameter.get(0);
        } else {
            returnVal = null;
        }
        return returnVal;
    }

}





