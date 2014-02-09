package ai.finagle.producer;

import ai.finagle.model.*;
import com.datastax.driver.core.*;
import com.twitter.finagle.Service;
import com.twitter.finagle.builder.ClientBuilder;
import com.twitter.finagle.builder.ServerBuilder;
import com.twitter.finagle.http.Http;
import com.twitter.util.Duration;
import com.twitter.util.ExecutorServiceFuturePool;
import com.twitter.util.Function0;
import com.twitter.util.Future;
import org.jboss.netty.handler.codec.http.*;
import scala.actors.threadpool.TimeUnit;

import java.net.InetSocketAddress;
import java.util.concurrent.Executors;


/**
 *
 *
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Web implements Runnable {

    public static final String ACTION = "nmact";

    private final ServiceClientHookupConfigScreamer serviceHookupConfigScreamer;

    private final ServiceClientHookupConfigYawner serviceHookupConfigYawner;

    private final ServiceClientHookupConfigStalker serviceHookupConfigStalker;

    private final ServiceClientHookupConfigSuperFriender serviceHookupConfigSuperFriender;

    private final ServiceClientHookupConfigGuardian serviceHookupConfigGuardian;

    private Cluster cluster;

    private Service<HttpRequest, HttpResponse> yawnerClient;

    private Service<HttpRequest, HttpResponse> screamerClient;

    private Service<HttpRequest, HttpResponse> stalkerClient;

    private Service<HttpRequest, HttpResponse> superFrienderClient;

    private Service<HttpRequest, HttpResponse> guardianClient;

    public Web(final ServiceClientHookupConfigScreamer serviceHookupConfigScreamer,
               final ServiceClientHookupConfigYawner serviceHookupConfigYawner,
               final ServiceClientHookupConfigStalker serviceHookupConfigStalker,
               final ServiceClientHookupConfigSuperFriender serviceHookupConfigSuperFriender,
               final ServiceClientHookupConfigGuardian serviceHookupConfigGuardian) {
        this.serviceHookupConfigScreamer = serviceHookupConfigScreamer;
        this.serviceHookupConfigYawner = serviceHookupConfigYawner;
        this.serviceHookupConfigStalker = serviceHookupConfigStalker;
        this.serviceHookupConfigSuperFriender = serviceHookupConfigSuperFriender;
        this.serviceHookupConfigGuardian = serviceHookupConfigGuardian;

    }

    /**
     * @TODO: Command line config for IP, Port, Thread Pool Size
     */
    @Override
    public void run() {

        hookUpYawner();
        hookUpScreamer();
        hookUpStalker();
        hookUpSuperFriender();
        hookUpGuardian();

    }

    private void hookUpYawner() {
        yawnerClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts(serviceHookupConfigYawner.getBindToHosts())
                        .retries(2)
                        .hostConnectionLimit(1));

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        return blockingYawner(request);
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceHookupConfigYawner.exposeOnIp, serviceHookupConfigYawner.exposeOnPort)));
    }

    private void hookUpScreamer() {
        screamerClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts(serviceHookupConfigScreamer.getBindToHosts())
                        .retries(2)
                        .hostConnectionLimit(1));

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        return blockingScreamer(request);
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceHookupConfigScreamer.exposeOnIp, serviceHookupConfigScreamer.exposeOnPort)));
    }

    private void hookUpStalker() {
        stalkerClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts(serviceHookupConfigStalker.getBindToHosts())
                        .retries(2)
                        .hostConnectionLimit(1));

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        return blockingStalker(request);
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceHookupConfigStalker.exposeOnIp, serviceHookupConfigStalker.exposeOnPort)));
    }

    private void hookUpSuperFriender() {
        superFrienderClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts(serviceHookupConfigSuperFriender.getBindToHosts())
                        .retries(2)
                        .hostConnectionLimit(1));

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        return blockingSuperFriender(request);
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceHookupConfigSuperFriender.exposeOnIp, serviceHookupConfigSuperFriender.exposeOnPort)));
    }


    private void hookUpGuardian() {
        guardianClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts(serviceHookupConfigGuardian.getBindToHosts())
                        .retries(2)
                        .hostConnectionLimit(1));

        final Service<HttpRequest, HttpResponse> service = new Service<HttpRequest, HttpResponse>() {

            final ExecutorServiceFuturePool executorServiceFuturePool = new ExecutorServiceFuturePool(Executors.newFixedThreadPool(100)); // Pool to process blockng requests so server thread doesn't

            public Future<HttpResponse> apply(final HttpRequest request) {
                return executorServiceFuturePool.apply(new Function0<HttpResponse>() {
                    @Override
                    public HttpResponse apply() {
                        return blockingGuardian(request);
                    }
                });

            }
        };

        ServerBuilder.safeBuild(service, ServerBuilder.get()
                .codec(Http.get())
                .name("HttpServer")
                .bindTo(new InetSocketAddress(serviceHookupConfigGuardian.exposeOnIp, serviceHookupConfigGuardian.exposeOnPort)));
    }

    private HttpResponse blockingYawner(final HttpRequest request) {
        return yawnerClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }

    private HttpResponse blockingScreamer(final HttpRequest request) {
        return screamerClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }

    private HttpResponse blockingStalker(final HttpRequest request) {
        return stalkerClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }

    private HttpResponse blockingSuperFriender(final HttpRequest request) {
        return superFrienderClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(300)));//300, because the clients burst friends in batches of 20, but all at once
    }

    private HttpResponse blockingGuardian(final HttpRequest request) {
        return guardianClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }

}





