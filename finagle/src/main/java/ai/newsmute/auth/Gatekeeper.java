package ai.newsmute.auth;

import ai.newsmute.service.Guardian;
import ai.newsmute.util.Printer;
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
            Printer.printHeaders(httpRequest);
            return Future.value(unauthorized);
        }
    }
}
