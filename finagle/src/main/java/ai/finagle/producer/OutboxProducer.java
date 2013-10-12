package ai.finagle.producer;

import ai.finagle.util.HBaseCrudService;
import ai.finagle.util.RowKey;
import ai.finagle.util.Subscriber;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.finagle.http.MockResponse;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.*;

import java.net.InetSocketAddress;
import java.net.URI;
import java.util.List;
import java.util.Map;


/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class OutboxProducer implements Runnable {

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

//                        URI uri = URI.create("localhost:9090");
//
//                        DefaultHttpRequest hbaseRequest =  new DefaultHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, uri.toASCIIString());
//                        hbaseRequest.setHeader(HttpHeaders.Names.HOST, "localhost");
//                        hbaseRequest.setHeader(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
//                        hbaseRequest.setHeader(HttpHeaders.Names.ACCEPT_ENCODING, HttpHeaders.Values.GZIP + ',' + HttpHeaders.Values.DEFLATE);
//                        hbaseRequest.setHeader(HttpHeaders.Names.CONTENT_TYPE, "text/plain");
//                        hbaseRequest.setHeader(HttpHeaders.Names.REFERER, uri.toString());
//                        hbaseRequest.setHeader(HttpHeaders.Names.USER_AGENT, "Finagle");
//                        hbaseRequest.getContent().writeBytes();
//                        hbaseRequest.setHeader(HttpHeaders.Names.CONTENT_LENGTH, hbaseRequest.getContent().readableBytes());
//
//                        hbaseRequest.


                        final HBaseCrudService<Subscriber> crudService = new HBaseCrudService<Subscriber>();
                        final HBaseCrudService<Subscriber>.Scanner _scanner = crudService.scan(new Subscriber(), 1).returnValueBadly();


                        final Subscriber subscriber = new Subscriber();

                        subscriber.setMockData(s);

                        crudService.create(new RowKey() {
                            @Override
                            public String getRowKey() {
                                return String.valueOf(System.currentTimeMillis());
                            }
                        }, subscriber);

                        while (_scanner.getNewValue() != null) {
                            final String _newValue = _scanner.getNewValue();
                            System.out.println("Scanned value:" + _newValue);
                            crudService.scan(new Subscriber(), _scanner);

                        }

                            //final HBaseCrudService<Subscriber>.Scanner _scanner = crudService.scan(new Subscriber(), 1).returnValueBadly();


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





