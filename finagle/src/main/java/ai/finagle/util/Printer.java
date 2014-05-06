package ai.finagle.util;

import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.Host;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponse;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 1/5/14
 * Time: 10:54 PM
 */
public class Printer {
    public static void printHeaders(final HttpRequest request) {
        final List<Map.Entry<String, String>> headers = request.getHeaders();
        for (Map.Entry<String, String> header : headers) {
            System.out.println("Request Header:" + header.getKey() + " value:" + header.getValue());
        }
    }

    public static void printHeaders(final HttpResponse response) {
        final List<Map.Entry<String, String>> headers = response.getHeaders();
        for (Map.Entry<String, String> header : headers) {
            System.out.println("Response Header:" + header.getKey() + " value:" + header.getValue());
        }
    }

    public static StringBuilder printClusterMetadata(final Cluster cluster) {
        System.out.printf("Connected to cluster: %s\n",
                cluster.getClusterName());
        StringBuilder stringBuilder = new StringBuilder("");
        for (Host host : cluster.getMetadata().getAllHosts()) {
            System.out.printf("Datacenter: %s; Host: %s; Rack: %s\n",
                    host.getDatacenter(), host.getAddress(), host.getRack());
            stringBuilder.append("Datacenter: ").append(host.getDatacenter()).append("; Host: ").append(host.getAddress()).append("; Rack: ").append(host.getRack());
        }
        return stringBuilder;
    }


}
