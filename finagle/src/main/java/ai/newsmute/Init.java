package ai.newsmute;

import ai.newsmute.model.*;
import ai.newsmute.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 19/4/15
 * Time: 4:08 PM
 */
@SpringBootApplication
@Component
public class Init implements CommandLineRunner {

    private static final Logger LOG = LoggerFactory.getLogger(Init.class);

    public Init() {
    }

    enum WHAT_TO_RUN {
        SCREAMER,
        YAWNER,
        COUNSELLOR,
        STALKER,
        HARVESTER,
        INFLUENCER,
        SUPER_FRIENDER,
        GUARDIAN,
        GOD_FATHER,
        CONFIG,
        WEB_APP
    }

    enum FINAGLE_SERVICE {
        SCREAMER,
        YAWNER,
        STALKER,
        SUPER_FRIENDER,
        GUARDIAN,
        GOD_FATHER,
    }


    public void run(final String[] args) {
        try {
            String privateInterfaceIp = null;
            String publicInterfaceIp = null;
            String databaseIp = null;
            config:
            for (final String arg : args) {
                final WHAT_TO_RUN what_to_run = WHAT_TO_RUN.valueOf(arg.toUpperCase().split(",")[0]);
                LOG.info("Configuring " + what_to_run.toString());

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
                LOG.info("Executing " + what_to_run.toString());
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
                    case INFLUENCER:
                        StartThreadSafely(new Thread(new Influencer()));
                        break;
                    case SUPER_FRIENDER:
                        StartThreadSafely(new Thread(new SuperFriender(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case GUARDIAN:
                        StartThreadSafely(new Thread(new Guardian(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case GOD_FATHER:
                        StartThreadSafely(new Thread(new GodFather(privateInterfaceIp, arg.split(",")[1], databaseIp)));
                        break;
                    case WEB_APP:
                        String exposeOnPortScreamer = null;
                        String hookUpWithScreamers = null;

                        String exposeOnPortYawner = null;
                        String hookUpWithYawners = null;

                        String exposeOnPortStalker = null;
                        String hookUpWithStalkers = null;

                        String exposeOnPortGuardian = null;
                        String hookUpWithGuardians = null;

                        String exposeOnPortGodFather = null;
                        String hookUpWithGodFather = null;

                        String exposeOnPortSuperFriender = null;
                        String hookUpWithSuperFrienders = null;

                        final String binds = arg.split(",")[1];

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
                                    hookUpWithGuardians = type_port_hosts[2];
                                    break;
                                case GOD_FATHER:
                                    exposeOnPortGodFather = type_port_hosts[1];
                                    hookUpWithGodFather = type_port_hosts[2];
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
                        if (exposeOnPortGodFather == null) {
                            throw new IllegalStateException("God Father service bind port not given to use with Web");
                        }

                        StartThreadSafely(new Thread(new Web(
                                new ServiceClientHookupConfigScreamer(publicInterfaceIp, Integer.parseInt(exposeOnPortScreamer), new HostsWithPorts(hookUpWithScreamers.split("[+]"))),
                                new ServiceClientHookupConfigYawner(publicInterfaceIp, Integer.parseInt(exposeOnPortYawner), new HostsWithPorts(hookUpWithYawners.split("[+]"))),
                                new ServiceClientHookupConfigStalker(publicInterfaceIp, Integer.parseInt(exposeOnPortStalker), new HostsWithPorts(hookUpWithStalkers.split("[+]"))),
                                new ServiceClientHookupConfigSuperFriender(publicInterfaceIp, Integer.parseInt(exposeOnPortSuperFriender), new HostsWithPorts(hookUpWithSuperFrienders.split("[+]"))),
                                new ServiceClientHookupConfigGuardian(publicInterfaceIp, Integer.parseInt(exposeOnPortGuardian), new HostsWithPorts(hookUpWithGuardians.split("[+]"))),
                                new ServiceClientHookupConfigGodFather(publicInterfaceIp, Integer.parseInt(exposeOnPortGodFather), new HostsWithPorts(hookUpWithGodFather.split("[+]")))
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
            LOG.error("Error starting thread", e);
        }
    }
}
