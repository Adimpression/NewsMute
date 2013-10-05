package ai.finagle.producer;

import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.finagle.http.MockResponse;
import com.twitter.util.Future;
import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;
import org.jboss.netty.handler.codec.http.CookieEncoder;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponse;
import org.jboss.netty.handler.codec.http.QueryStringDecoder;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.Properties;


/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class OutboxProducer implements Runnable {

    private final Producer<String, String> producer;

    public OutboxProducer() {
        final Properties props = new Properties();

        props.put("metadata.broker.list", "localhost:9092");
        props.put("serializer.class", "kafka.serializer.StringEncoder");
        props.put("partitioner.class", "ai.finagle.producer.SimplePartitioner");
        props.put("request.required.acks", "1");

        ProducerConfig config = new ProducerConfig(props);
        producer = new Producer<String, String>(config);
    }

    public static void main(final String[] args) {
        new Thread(new OutboxProducer()).run();
    }

    @Override
    public void run() {

        Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {
            public Future<HttpResponse> apply(HttpRequest request) {

                final QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.getUri());
                final Map<String, List<String>> parameters = queryStringDecoder.getParameters();

                final List<String> url = parameters.get("url");
                if (url != null) {
                    final String s = url.get(0);
                    if (s != null && !s.isEmpty()) {
                        KeyedMessage<String, String> data = new KeyedMessage<String, String>("wall", "user17", s);
                        System.out.println("sent:" + data.message());
                        producer.send(data);
                    } else {
                        System.out.println("No url parameter value is empty:" + s);
                    }
                } else {
                    System.out.println("No url parameter in request");
                }

                final HttpResponse httpResponse = new MockResponse();
                final List<Map.Entry<String, String>> headers = request.getHeaders();

                for (Map.Entry<String, String> header : headers) {
                    System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                }
                CookieEncoder encoder = new CookieEncoder(true);
                encoder.addCookie("JSESSIONID", "1234");
                httpResponse.setHeader("Set-Cookie", encoder.encode());
                return Future.value(httpResponse);
            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("localhost", 10000)));


    }

}





