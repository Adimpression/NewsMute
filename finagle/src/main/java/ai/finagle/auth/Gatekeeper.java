package ai.finagle.auth;

import com.twitter.finagle.Service;
import com.twitter.finagle.SimpleFilter;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.*;

import java.util.Set;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 9/2/14
 * Time: 1:38 PM
 */
public class Gatekeeper extends SimpleFilter<HttpRequest, HttpResponse>{
    @Override
    public Future<HttpResponse> apply(final HttpRequest httpRequest, final Service<HttpRequest, HttpResponse> httpRequestHttpResponseService) {
        final HttpResponse httpResponsePostive = new DefaultHttpResponse(HttpVersion.HTTP_1_0, HttpResponseStatus.OK);

        Cookie sessionCookie = null;

        final String value = httpRequest.getHeader("Cookie");
        if(value != null){
            final Set<Cookie> cookies = new CookieDecoder().decode(value);
            for (final Cookie cookie : cookies) {
                if (cookie.getName().equals("session")) {
                    sessionCookie = cookie;
                    break;
                }
            }
        }

        if(sessionCookie != null){
            return  Future.value(httpResponsePostive);
        }   else {
            return  Future.exception(new IllegalAccessError("No session"));
        }

    }
}
