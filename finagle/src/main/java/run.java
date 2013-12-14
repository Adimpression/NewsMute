import ai.finagle.producer.*;

enum WHAT_TO_RUN {
    SCREAMER,
    YAWNER,
    COUNSELLOR,
    STALKER,
    HARVESTER,
    SUPER_FRIENDER,
    GUARDIAN,
    WEB_APP
}

/**
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
            for (final String arg : args) {
                final WHAT_TO_RUN what_to_run = WHAT_TO_RUN.valueOf(arg.toUpperCase());
                System.out.println("Executing " + what_to_run.toString());
                switch (what_to_run) {
                    case SCREAMER:
                        StartThreadSafely(new Thread(new Screamer()));
                        break;
                    case YAWNER:
                        StartThreadSafely(new Thread(new Yawner()));
                        break;
                    case COUNSELLOR:
                        StartThreadSafely(new Thread(new Counsellor()));
                        break;
                    case STALKER:
                        StartThreadSafely(new Thread(new Stalker()));
                        break;
                    case HARVESTER:
                        StartThreadSafely(new Thread(new Harvester()));
                        break;
                    case SUPER_FRIENDER:
                        StartThreadSafely(new Thread(new SuperFriender()));
                        break;
                    case GUARDIAN:
                        StartThreadSafely(new Thread(new Guardian()));
                        break;
                    case WEB_APP:
                        StartThreadSafely(new Thread(new Web()));
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

//        final ResultSet execute = connect.execute("CREATE KEYSPACE Test WITH strategy_class = 'SimpleStrategy' AND strategy_options:replication_factor = 1;");
//        try {
//            final ResultSet execute = connect.execute("CREATE KEYSPACE Test1 WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};");
//            for (Row row : execute.all()) {
//                System.out.println("Create Keyspace Result:" + row.toString());
//            }
//        } catch (AlreadyExistsException e) {
//            System.out.println("Keyspace exists. Hence using it.");
//            final Session test = cluster.connect("Test1");
//        }
