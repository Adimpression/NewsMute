By the time the client gets here, it knows it's session.
So, we here, are stateless.

Hello Netty Query Parameter
===========================

Logs:

/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/bin/java -Didea.launcher.port=7533 "-Didea.launcher.bin.path=/Applications/IntelliJ IDEA 12.app/bin" -Dfile.encoding=UTF-8 -classpath "/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/deploy.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/dt.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/javaws.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jce.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/jconsole.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/management-agent.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/plugin.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/sa-jdi.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/charsets.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/classes.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/jsse.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Classes/ui.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/apple_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/dnsns.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/localedata.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunjce_provider.jar:/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home/lib/ext/sunpkcs11.jar:/Users/ravindranathakila/ilikeplaces/NewsMute/finagle/target/classes:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-core/5.3.1/finagle-core-5.3.1.jar:/Users/ravindranathakila/.m2/repository/io/netty/netty/3.5.1.Final/netty-3.5.1.Final.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-collection/5.3.1/util-collection-5.3.1.jar:/Users/ravindranathakila/.m2/repository/com/google/guava/guava/11.0.2/guava-11.0.2.jar:/Users/ravindranathakila/.m2/repository/com/google/code/findbugs/jsr305/1.3.9/jsr305-1.3.9.jar:/Users/ravindranathakila/.m2/repository/commons-collections/commons-collections/3.2.1/commons-collections-3.2.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-core/5.3.1/util-core-5.3.1.jar:/Users/ravindranathakila/.m2/repository/org/scala-lang/scala-library/2.9.2/scala-library-2.9.2.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-hashing/5.3.1/util-hashing-5.3.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-jvm/5.3.1/util-jvm-5.3.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-logging/5.3.1/util-logging-5.3.1.jar:/Users/ravindranathakila/.m2/repository/com/twitter/finagle-http/5.3.1/finagle-http-5.3.1.jar:/Users/ravindranathakila/.m2/repository/commons-lang/commons-lang/2.6/commons-lang-2.6.jar:/Users/ravindranathakila/.m2/repository/com/twitter/util-codec/5.3.1/util-codec-5.3.1.jar:/Users/ravindranathakila/.m2/repository/commons-codec/commons-codec/1.5/commons-codec-1.5.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/kafka_2.8.0-0.8.0-beta1.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/jopt-simple-3.2.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/log4j-1.2.15.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/metrics-annotation-2.2.0.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/metrics-core-2.2.0.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/scala-compiler.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/scala-library.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/slf4j-api-1.7.2.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/slf4j-simple-1.6.4.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/snappy-java-1.0.4.1.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/zkclient-0.3.jar:/Users/ravindranathakila/ilikeplaces/kafka_2.8.0-0.8.0-beta1/libs/zookeeper-3.3.4.jar:/Applications/IntelliJ IDEA 12.app/lib/idea_rt.jar" com.intellij.rt.execution.application.AppMain ai.finagle.producer.OutboxProducer
External service
Header:Host value:localhost:10000
Header:Connection value:keep-alive
Header:Accept value:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Header:User-Agent value:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36
Header:Accept-Encoding value:gzip,deflate,sdch
Header:Accept-Language value:en-US,en;q=0.8,fr;q=0.6
External service
Header:Host value:localhost:10000
Header:Connection value:keep-alive
Header:Accept value:*/*
Header:User-Agent value:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36
Header:Accept-Encoding value:gzip,deflate,sdch
Header:Accept-Language value:en-US,en;q=0.8,fr;q=0.6
Header:Cookie value:JSESSIONID=1234
key:url
values:
Key's value:funny
External service
Header:Host value:localhost:10000
Header:Connection value:keep-alive
Header:Accept value:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Header:User-Agent value:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36
Header:Accept-Encoding value:gzip,deflate,sdch
Header:Accept-Language value:en-US,en;q=0.8,fr;q=0.6
Header:Cookie value:JSESSIONID=1234
External service
Header:Host value:localhost:10000
Header:Connection value:keep-alive
Header:Accept value:*/*
Header:User-Agent value:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36
Header:Accept-Encoding value:gzip,deflate,sdch
Header:Accept-Language value:en-US,en;q=0.8,fr;q=0.6
Header:Cookie value:JSESSIONID=1234

