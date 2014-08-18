package ai.newsmute.auth;

import ai.newsmute.producer.Guardian;
import com.twitter.finagle.Filter;
import com.twitter.finagle.Service;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 9/2/14
 * Time: 1:38 PM
 */
public class Gatekeeper extends Filter<HttpRequest, HttpResponse, HttpRequest, HttpResponse> {
    @Override
    public Future<HttpResponse> apply(final HttpRequest httpRequest, final Service<HttpRequest, HttpResponse> httpRequestHttpResponseService) {
        final HttpResponse unauthorized = new DefaultHttpResponse(HttpVersion.HTTP_1_0, HttpResponseStatus.UNAUTHORIZED);

        String cookieValue = null;

        final String value = httpRequest.getHeader("Cookie");
        if (value != null) {
            final Set<Cookie> cookies = new CookieDecoder().decode(value);
            for (final Cookie cookie : cookies) {
                if (cookie.getName().equals("session")) {
                    cookieValue  = cookie.getValue();
                    break;
                }
            }
        }

        if (cookieValue == null){
            cookieValue = httpRequest.getHeader(Guardian.X_SESSION_HEADER);
            System.out.println(Guardian.X_SESSION_HEADER + ":" + cookieValue);
        }

        if (cookieValue != null) {
            return httpRequestHttpResponseService.apply(httpRequest);
        } else {
            final List<Map.Entry<String, String>> headers = httpRequest.getHeaders();
            if (!headers.isEmpty()) {
                for (Map.Entry<String, String> header : headers) {
                    System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
                }
            } else {
                System.out.println("NO HTTP HEADERS!");
            }

            //return httpRequestHttpResponseService.apply(httpRequest);
            return Future.value(unauthorized);
        }
    }
}
