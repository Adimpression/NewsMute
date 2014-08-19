package ai.newsmute.service;

import ai.newsmute.model.ServiceClientHookupConfig;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ClientBuilder;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.Duration;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.HttpHeaders;
import org.jboss.netty.handler.codec.http.HttpRequest;
import org.jboss.netty.handler.codec.http.HttpResponse;
import scala.actors.threadpool.TimeUnit;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;


/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Web implements Runnable {

    private final ServiceClientHookupConfig[] serviceClientHookupConfigs;

    public Web(final ServiceClientHookupConfig... serviceClientHookupConfigs) {
        this.serviceClientHookupConfigs = serviceClientHookupConfigs;
    }

    @Override
    public void run() {

        for (final ServiceClientHookupConfig serviceClientHookupConfig : serviceClientHookupConfigs) {
            hookUp(serviceClientHookupConfig);
        }
    }

    private void hookUp(final ServiceClientHookupConfig serviceClientHookupConfig) {

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            private final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blocking requests so server thread doesn't

            private final Service<HttpRequest, HttpResponse> client = ClientBuilder
                    .safeBuild(ClientBuilder.get().codec(Http.get())
                            .hosts(serviceClientHookupConfig.getBindToHosts())
                            .retries(2)
                            .hostConnectionLimit(1));

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        final HttpResponse response = client.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
                        response.setHeader(HttpHeaders.Names.ACCESS_CONTROL_ALLOW_HEADERS, "x-session-header");
                        response.setHeader(HttpHeaders.Names.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PUT, DELETE");
                        response.setHeader(HttpHeaders.Names.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
                        return response;
                    }
                });

            }
        };
        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceClientHookupConfig.exposeOnIp, serviceClientHookupConfig.exposeOnPort)));
    }

}





