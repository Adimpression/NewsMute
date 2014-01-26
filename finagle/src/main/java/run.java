import ai.finagle.model.*;
import ai.finagle.producer.*;

enum WHAT_TO_RUN {
    SCREAMER,
    YAWNER,
    COUNSELLOR,
    STALKER,
    HARVESTER,
    SUPER_FRIENDER,
    GUARDIAN,
    CONFIG,
    WEB_APP
}

enum FINAGLE_SERVICE {
    SCREAMER,
    YAWNER,
    STALKER,
    SUPER_FRIENDER,
    GUARDIAN,
}

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
 *
 *
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 web_app,SCREAMER-30200-23.253.36.42:30000#YAWNER-40200-23.253.36.42:40000+23.253.36.42:40001#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-23.253.36.42:20000#GUARDIAN-50200-23.253.36.42:31600
 *
 *
 * java -cp Finagle.jar run config,23.253.36.42,23.253.36.42,192.168.3.2 screamer,30000 yawner,40000 stalker,16158 super_friender,20000 guardian,31600 counsellor harvester web_app,SCREAMER-30200-23.253.36.42:30000#YAWNER-40200-23.253.36.42:40000#STALKER-16285-23.253.36.42:16185#SUPER_FRIENDER-20200-23.253.36.42:20000#GUARDIAN-50200-23.253.36.42:31600
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
    public static void main(final String args[]) {
        try {
            String privateInterfaceIp = null;
            String publicInterfaceIp = null;
            String databaseIp = null;

            config:
            for (final String arg : args) {
                final WHAT_TO_RUN what_to_run = WHAT_TO_RUN.valueOf(arg.toUpperCase().split(",")[0]);
                System.out.println("Configuring " + what_to_run.toString());

                switch (what_to_run) {
                    case CONFIG:
                        final String[] config = arg.split(",");
                        privateInterfaceIp = config[1];
                        publicInterfaceIp = config[2];
                        databaseIp = config[3];
                        break config;
                    default:
                        throw new IllegalStateException("CONFIG parameter required, with private interface ip, public interface ip and database ip");
                }
            }

            for (final String arg : args) {
                final WHAT_TO_RUN what_to_run = WHAT_TO_RUN.valueOf(arg.toUpperCase().split(",")[0]);
                System.out.println("Executing " + what_to_run.toString());
                switch (what_to_run) {
                    case SCREAMER:
                        StartThreadSafely(new Thread(new Screamer(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case YAWNER:
                        StartThreadSafely(new Thread(new Yawner(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case COUNSELLOR:
                        StartThreadSafely(new Thread(new Counsellor(databaseIp)));
                        break;
                    case STALKER:
                        StartThreadSafely(new Thread(new Stalker(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case HARVESTER:
                        StartThreadSafely(new Thread(new Harvester(databaseIp)));
                        break;
                    case SUPER_FRIENDER:
                        StartThreadSafely(new Thread(new SuperFriender(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case GUARDIAN:
                        StartThreadSafely(new Thread(new Guardian(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case WEB_APP:
                        final String binds = arg.split(",")[1];

                        String exposeOnPortScreamer = null;
                        String hookUpWithScreamers = null;

                        String exposeOnPortYawner = null;
                        String hookUpWithYawners = null;

                        String exposeOnPortStalker = null;
                        String hookUpWithStalkers = null;

                        String exposeOnPortGuardian = null;
                        String hookUpWithGuardians = null;

                        String exposeOnPortSuperFriender = null;
                        String hookUpWithSuperFrienders = null;

                        for (final String bind : binds.split("#")) {
                            final String[] type_port_hosts = bind.split("-");
                            final FINAGLE_SERVICE service = FINAGLE_SERVICE.valueOf(type_port_hosts[0]);
                            switch (service) {
                                case SCREAMER:
                                    exposeOnPortScreamer = type_port_hosts[1];
                                    hookUpWithScreamers = type_port_hosts[2];
                                    break;
                                case YAWNER:
                                    exposeOnPortYawner = type_port_hosts[1];
                                    hookUpWithYawners = type_port_hosts[2];
                                    break;
                                case STALKER:
                                    exposeOnPortStalker = type_port_hosts[1];
                                    hookUpWithStalkers = type_port_hosts[2];
                                    break;
                                case SUPER_FRIENDER:
                                    exposeOnPortSuperFriender = type_port_hosts[1];
                                    hookUpWithSuperFrienders = type_port_hosts[2];
                                    break;
                                case GUARDIAN:
                                    exposeOnPortGuardian = type_port_hosts[1];
                                    hookUpWithGuardians =  type_port_hosts[2];
                                    break;
                            }
                        }

                        if (exposeOnPortScreamer == null) {
                            throw new IllegalStateException("Screamer service bind port not given to use with Web");
                        }
                        if (exposeOnPortYawner == null) {
                            throw new IllegalStateException("Yawner service bind port not given to use with Web");
                        }
                        if (exposeOnPortStalker == null) {
                            throw new IllegalStateException("Stalker service bind port not given to use with Web");
                        }
                        if (exposeOnPortSuperFriender == null) {
                            throw new IllegalStateException("Super Friender service bind port not given to use with Web");
                        }
                        if (exposeOnPortGuardian == null) {
                            throw new IllegalStateException("Guardian service bind port not given to use with Web");
                        }

                        StartThreadSafely(new Thread(new Web(
                                new ServiceClientHookupConfigScreamer(publicInterfaceIp, Integer.parseInt(exposeOnPortScreamer), new HostsWithPorts(hookUpWithScreamers.split("[+]"))),
                                new ServiceClientHookupConfigYawner(publicInterfaceIp, Integer.parseInt(exposeOnPortYawner), new HostsWithPorts(hookUpWithYawners.split("[+]"))),
                                new ServiceClientHookupConfigStalker(publicInterfaceIp, Integer.parseInt(exposeOnPortStalker), new HostsWithPorts(hookUpWithStalkers.split("[+]"))),
                                new ServiceClientHookupConfigSuperFriender(publicInterfaceIp, Integer.parseInt(exposeOnPortSuperFriender), new HostsWithPorts(hookUpWithSuperFrienders.split("[+]"))),
                                new ServiceClientHookupConfigGuardian(publicInterfaceIp, Integer.parseInt(exposeOnPortGuardian), new HostsWithPorts(hookUpWithGuardians.split("[+]")))
                        )));
                        break;
                    case CONFIG:
                        //We've already processed this above
                        break;
                    default:
                        final StringBuilder options = new StringBuilder("");
                        for (final WHAT_TO_RUN runOptions : WHAT_TO_RUN.values()) {
                            options.append("\n").append(runOptions.toString());
                        }
                        throw new UnsupportedOperationException("To run, provide one or many of the following, separated by spaces. Case doesn't matter. " + options.toString());
                }
            }
        } catch (final Throwable t) {
            final StringBuilder options = new StringBuilder("");
            for (final WHAT_TO_RUN what_to_run : WHAT_TO_RUN.values()) {
                options.append("\n").append(what_to_run.toString());
            }
            throw new RuntimeException("To run, provide one or many of the following, separated by spaces. Case doesn't matter. " + options.toString(), t);
        }
    }

    private static void StartThreadSafely(final Thread thread) {
        try {
            thread.run();
        } catch (final Exception e) {
            e.printStackTrace(System.err);

        }
    }

}

//        final ResultSet execute = connect.execute("CREATE KEYSPACE Test WITH strategy_class = 'SimpleStrategy' AND strategy_options:replication_factor = 1    ;");
//        try {
//            final ResultSet execute = connect.execute("CREATE KEYSPACE Test1 WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};");
//            for (Row row : execute.all()) {
//                System.out.println("Create Keyspace Result:" + row.toString());
//            }
//        } catch (AlreadyExistsException e) {
//            System.out.println("Keyspace exists. Hence using it.");
//            final Session test = cluster.connect("Test1");
//        }
