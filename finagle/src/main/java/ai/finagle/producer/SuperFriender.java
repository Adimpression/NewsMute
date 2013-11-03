package ai.finagle.producer;

import ai.finagle.model.Return;
import ai.finagle.model.ReturnValueSuperFriend;
import ai.finagle.model.SuperFriendValue;
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

    private Cluster cluster;

    /**
     * @TODO: Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("10.208.27.21");

        final Session connect = cluster.connect("Test1");
        try {
            //connect.execute("drop table SuperFriend;");
            connect.execute("create table SuperFriend(\n" +
                    "      humanId varchar,\n" +
                    "      value varchar,\n" +
                    "      PRIMARY KEY (humanId));");

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
                        final byte[] resultBytes = result.getBytes();
                        final ChannelBuffer buffer = ChannelBuffers.buffer(resultBytes.length);
                        buffer.writeBytes(resultBytes);
                        httpResponse.setContent(buffer);
                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("192.237.246.113", 20000)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> user = parameters.get("user");
        final List<String> usersParameterValues = parameters.get("users");
        final String returnVal;

        if (user != null) {
            if (usersParameterValues != null) {//Adding friends
                    System.out.println("usersParameterValue:" + usersParameterValues.get(0));
                final String[] split = usersParameterValues.get(0).split("|");

                connect.execute("insert into SuperFriend(humanId, value) values('" + user.get(0) + "','" + new Gson().toJson(new SuperFriendValue(user.get(0), split)) + "');");//Yet to hash the urlHash value
                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{}), "", "OK"));

            } else {//querying friends
                final ResultSet execute = connect.execute("select * from SuperFriend where humanId='" + user.get(0) + "'");
                final List<Row> all = execute.all();
                final SuperFriendValue superFriendValue;
                if (all.size() == 0) {
                    superFriendValue = new Gson().fromJson(all.get(0).getString("value"), SuperFriendValue.class);
                } else {
                    superFriendValue = new Gson().fromJson(all.get(0).getString("value"), SuperFriendValue.class);
                }
                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{superFriendValue}), "", "OK"));

            }
        } else {
            returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{}), "MINIMALLY, THE user PARAMETER IS REQUIRED", "ERROR"));
        }

        return returnVal;
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





