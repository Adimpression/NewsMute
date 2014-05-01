package ai.finagle.util;

import org.jboss.netty.handler.codec.http.HttpRequest;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 1/5/14
 * Time: 10:54 PM
 */
public class Headers {
    public static void printHeaders(final HttpRequest request) {
        final List<Map.Entry<String, String>> headers = request.getHeaders();
        for (Map.Entry<String, String> header : headers) {
            System.out.println("Header:" + header.getKey() + " value:" + header.getValue());
        }
    }
}
