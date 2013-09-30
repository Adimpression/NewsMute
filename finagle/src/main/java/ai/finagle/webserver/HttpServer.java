package ai.finagle.webserver;

import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ClientBuilder;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.finagle.http.MockResponse;
import com.twitter.util.Future;
import com.twitter.util.FutureEventListener;
import org.jboss.netty.handler.codec.http.*;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;


/**
 *
 * This is some messed up code, but we just prove to ourselves that we can create session, client and server with Finagle.
 * It's messed up. To comment on it is also messed up. But,
 * Note that we use the cookies feature provided by Netty.
 * We after this example went as far as checking out a Netty servlet bridge.
 * That didn't turn out to be fruitful due to many unimplemented methods.
 * So we settled for Winstone for the session handling. We sure will have to hook up Winstone in some projects, prossibly this, with Finagle.
 * BTW, did you know how Winstone got it's name? Find out soon, before someone walking with you drops his pants as you enter the alleys :D
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class HttpServer {

    public static void main(final String[] args) {

        final Service<HttpRequest, HttpResponse> client = ClientBuilder.safeBuild(ClientBuilder
                .get()
                .codec(Http.get())
                .hosts("localhost:20000")
                .hostConnectionLimit(1));

        Service<HttpRequest, HttpResponse> internal = new Service<HttpRequest, HttpResponse>() {
            public Future<HttpResponse> apply(HttpRequest request) {
                final HttpResponse httpResponse = new MockResponse();
                System.out.println("Internal service");

                final List<Map.Entry<String, String>> headers = request.getHeaders();

                for (Map.Entry<String, String> header : headers) {
                    System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                }
                return Future.value(httpResponse);
            }
        };

        Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {
            public Future<HttpResponse> apply(HttpRequest request) {
                final HttpResponse httpResponse = new MockResponse();
                System.out.println("External service");
                final List<Map.Entry<String, String>> headers = request.getHeaders();

                for (Map.Entry<String, String> header : headers) {
                    System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                }
                CookieEncoder encoder = new CookieEncoder(true);
                encoder.addCookie("JSESSIONID", "1234");
                httpResponse.setHeader("Set-Cookie", encoder.encode());
                HttpRequest clientRequest = new DefaultHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, "/");
                client.apply(clientRequest).addEventListener(new FutureEventListener<HttpResponse>() {
                    public void onSuccess(HttpResponse response) {
                        System.out.println("received response: " + response);
                    }

                    public void onFailure(Throwable cause) {
                        System.out.println("failed with cause: " + cause);
                    }
                });
                return Future.value(httpResponse);
            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("localhost", 10000)));

        ServerBuilder.safeBuild(internal, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress("localhost", 20000)));
    }


}





