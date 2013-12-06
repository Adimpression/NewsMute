import ai.finagle.producer.*;

/**
 * You want to know how we do it? We just do
 * "java -cp . Finagle.jar run"
 * "java -cp . Finagle.jar test" //See test class
 *
 * Thought it was a cool way to do things and keep it memorable.
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:16 PM
 */
public class run {
    public static void main(final String args[]) {
        StartThreadSafely(new Thread(new Screamer()));
        StartThreadSafely(new Thread(new Yawner()));
        StartThreadSafely(new Thread(new Counsellor()));

        StartThreadSafely(new Thread(new SuperFriender()));

        StartThreadSafely(new Thread(new Stalker()));
        StartThreadSafely(new Thread(new Harvester()));
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
