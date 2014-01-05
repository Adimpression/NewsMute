package ai.finagle.producer;

import ai.finagle.db.DBScripts;
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
import org.mindrot.jbcrypt.BCrypt;

import java.net.InetSocketAddress;
import java.util.*;
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

    public static final String GLOBAL_SALT = "$2a$10$SzCczWIG7DFBKi2jr8yDz.";

    private Cluster cluster;

    /**
     * @TODO: Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {
        this.open("192.168.3.2");

        final Session connect = cluster.connect("Test1");
        try {
            //connect.execute("drop table SuperFriend;");
            connect.execute(DBScripts.CREATE_SUPERFRIEND);

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
                        httpResponse.setHeader("Content-Type","text/html; charset=utf-8");
                        return httpResponse;
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("23.253.36.42", 20000)));

        //this.close();
    }

    private String blocking(HttpRequest request) {
        final Session connect = cluster.connect("Test1");

        final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
        final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

        final List<String> userParameterValues = parameters.get("user");
        final List<String> usersParameterValues = parameters.get("users");
        final String returnVal;

        if (userParameterValues != null) {
            //@TODO: Remove unwanted emails such as unsubscribe@mailinglist.com(limit by keyword) or 123123980u09203412341343@_23e234LLgmail.com(limit by length)
            final String user = userParameterValues.get(0);
            System.out.println("user:" +user);
            final String hasheduser = BCrypt.hashpw(user, new String(SuperFriender.GLOBAL_SALT));
            System.out.println("hashed user:" + hasheduser);
            if (usersParameterValues != null) {//Adding friends
                    System.out.println("users:" + usersParameterValues.get(0));
                final ResultSet execute = connect.execute(String.format("select * from SuperFriend where humanId='%s'", hasheduser));
                final List<Row> all = execute.all();
                final SuperFriendValue superFriendValue;
                if (all.size() != 0) {
                    superFriendValue = new Gson().fromJson(all.get(0).getString("value"), SuperFriendValue.class);
                } else {
                    superFriendValue = null;
                }
                final Set<String> contacts = new HashSet<String>();

                if (superFriendValue != null) {
                    contacts.addAll(Arrays.asList(superFriendValue.superFriends));
                }

                final String[] newContacts = usersParameterValues.get(0).split("\\|");

                for (final String contact : newContacts) {
                    if (contact != null && !contact.isEmpty()) {
                        contacts.add(BCrypt.hashpw(contact, new String(GLOBAL_SALT)));
                    }
                }

                final String[] finalContacts = new String[contacts.size()];

                connect.execute(String.format("insert into SuperFriend(humanId, value) values('%s','%s');", hasheduser, new Gson().toJson(new SuperFriendValue(hasheduser, contacts.toArray(finalContacts)))));//Yet to hash the urlHash value
                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(new SuperFriendValue[]{}), "", "OK"));

            } else {//querying friends
                final ResultSet execute = connect.execute(String.format("select * from SuperFriend where humanId='%s'", hasheduser));
                final List<Row> all = execute.all();
                final SuperFriendValue superFriendValue;
                if (all.size() != 0) {
                    superFriendValue = new Gson().fromJson(all.get(0).getString("value"), SuperFriendValue.class);
                } else {
                    superFriendValue = null;
                }
                returnVal = new Gson().toJson(new Return<ReturnValueSuperFriend>(new ReturnValueSuperFriend(superFriendValue != null ? new SuperFriendValue[]{superFriendValue} : new SuperFriendValue[0]), "", "OK"));

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




