package ai.finagle.producer;

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
 * Answers the question: What have my super friends found interesting
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 15/9/13
 * Time: 2:23 PM
 */
public class Web implements Runnable {

    public static final String ACTION = "nmact";

    private Cluster cluster;

    private Service<HttpRequest, HttpResponse> yawnerClient;

    private Service<HttpRequest, HttpResponse> screamerClient;

    private Service<HttpRequest, HttpResponse> stalkerClient;

    private Service<HttpRequest, HttpResponse> superFrienderClient;

    private Service<HttpRequest, HttpResponse> guardianClient;

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
                        .hosts("192.237.246.113:40000").hostConnectionLimit(1));

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
                .bindTo(new InetSocketAddress("192.237.246.113", 40200)));
    }

    private void hookUpScreamer() {
        screamerClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts("192.237.246.113:30000").hostConnectionLimit(1));

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
                .bindTo(new InetSocketAddress("192.237.246.113", 30200)));
    }

    private void hookUpStalker() {
        stalkerClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts("192.237.246.113:16185").hostConnectionLimit(1));

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
                .bindTo(new InetSocketAddress("192.237.246.113", 16285)));
    }

    private void hookUpSuperFriender() {
        superFrienderClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts("192.237.246.113:20000").hostConnectionLimit(1));

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
                .bindTo(new InetSocketAddress("192.237.246.113", 20200)));
    }


    private void hookUpGuardian() {
        guardianClient = ClientBuilder
                .safeBuild(ClientBuilder.get().codec(Http.get())
                        .hosts("192.237.246.113:50000").hostConnectionLimit(1));

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
                .bindTo(new InetSocketAddress("192.237.246.113", 50200)));
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
        return superFrienderClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }

    private HttpResponse blockingGuardian(final HttpRequest request) {
        return guardianClient.apply(request).apply(new Duration(TimeUnit.SECONDS.toNanos(30)));
    }



}





