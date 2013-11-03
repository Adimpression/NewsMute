import ai.finagle.producer.Counsellor;
import ai.finagle.producer.Screamer;
import ai.finagle.producer.SuperFriender;
import ai.finagle.producer.Yawner;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 27/10/13
 * Time: 12:16 PM
 */
public class run {
    public static void main(final String args[]) {
        StartThreadSafely(new Thread(new Screamer()));
        StartThreadSafely(new Thread(new Yawner()));
        StartThreadSafely(new Thread(new Counsellor()));
        StartThreadSafely(new Thread(new SuperFriender()));
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
