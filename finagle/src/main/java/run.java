import ai.newsmute.Init;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;

/**
 * So here's the new run String. Here goes:
 * <p/>
 * <p/>
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 screamer,30000
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 yawner,40000
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 stalker,16185
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 super_friender,20000
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 guardian,31600
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 counsellor
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 harvester
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 web_app,SCREAMER-30200-23.253.36.42:30000#YAWNER-40200-23.253.36.42:40000#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-23.253.36.42:20000#GUARDIAN-50200-23.253.36.42:31600
 * <p/>
 * <p/>
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 web_app,SCREAMER-30200-23.253.36.42:30000#YAWNER-40200-23.253.36.42:40000+23.253.36.42:40001#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-23.253.36.42:20000#GUARDIAN-50200-23.253.36.42:31600
 * <p/>
 * <p/>
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 screamer,30000 yawner,40000 stalker,16158 super_friender,20000 guardian,31600 counsellor harvester web_app,SCREAMER-30200-23.253.36.42:30000#YAWNER-40200-23.253.36.42:40000#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-23.253.36.42:20000#GUARDIAN-50200-23.253.36.42:31600
 * <p/>
 * <p/>
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.4 web_app,SCREAMER-30200-192.168.3.1:30000+192.168.3.5:30000+192.168.3.4:30000#YAWNER-40200-192.168.3.1:40000+192.168.3.3:40000+192.168.3.4:40000#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-192.168.3.1:20000+192.168.3.3:20000+192.168.3.4:20000#GUARDIAN-50200-192.168.3.1:31600+192.168.3.3:31600+192.168.3.4:31600#GOD_FATHER-40700-192.168.3.5:40500
 * <p/>
 * We are a bit confused what to do next. So here's the deal:
 * <p/>
 * This class will have 3 services exposed for user based triggers.
 * Ideally running in tens of instances to handle the load.
 * That is, http requests:
 * <ul>
 * <li>Screamer</li>
 * <li>Yawner</li>
 * <li>Stalker</li>
 * <li>SuperFriender</li>
 * </ul>
 * <p/>
 * WHere as there are 2 other services, ideally running as one instance
 * <ul>
 * <li>Counsellor</li>
 * <li>Harvester</li>
 * </ul>
 * <p/>
 * You want to know how we do it? We just do
 * "java -cp . Finagle.jar run"
 * "java -cp . Finagle.jar test" //See test class
 * <p/>
 * Thought it was a cool way to do things and keep it memorable.
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:16 PM
 */
public class run {

    public run(final String args[]) {
        System.out.println("Spring initializing run with:" + Arrays.toString(args));
    }

    public static void main(final String args[]) {
        if (args.length == 0) {
            System.err.println("!!!Missing required arguments to run program!!!");
            System.exit(1);
        }

        System.out.println("Initializing Spring Boot");
        SpringApplication.run(Init.class, args);
    }
}
