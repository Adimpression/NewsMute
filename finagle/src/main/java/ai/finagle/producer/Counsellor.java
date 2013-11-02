package ai.finagle.producer;

import com.datastax.driver.core.*;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Counsellor implements Runnable {

    private Cluster cluster;

    @Override
    public void run() {
        this.open("10.208.27.21");

        final Timer timer = new Timer();
        final TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    System.out.println("Counselling...");

                    final Session connect = cluster.connect("Test1");

                    final ResultSet executeScreamFetch = connect.execute("select * from Scream;");
                    final ResultSet executeYawnFetch = connect.execute("select * from Yawn;");
                    final List<Row> allScreams = executeScreamFetch.all();
                    final List<Row> allYawns = executeYawnFetch.all();

                    System.out.println("Counselling " + allScreams.size() + " screams");
                    System.out.println("Counselling " + allYawns.size() + " yawns");

                    int totalInsertions = 0;

                    for (final Row scream : allScreams) {
                        for (final Row friend : allScreams) {//Ideally, all screams are not friends of this person, but we do so for now for testing
                            connect.execute("insert into Yawn(humanId, urlHash, value) values('" + scream.getString("humanId") + "','" + friend.getString("urlHash") + "','" + friend.getString("value") + "');");
                            totalInsertions++;
                        }
                    }

                    System.out.println("Counselled successfully " + totalInsertions + " sessions");
                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }
        };

        timer.scheduleAtFixedRate(task, 0, 10000);
    }

    public String open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        cluster.connect();
        Metadata metadata = cluster.getMetadata();
        System.out.printf("Connected to cluster: %s\n",
                metadata.getClusterName());
        StringBuilder stringBuilder = new StringBuilder("");
        for (Host host : metadata.getAllHosts()) {
            System.out.printf("Datacenter: %s; Host: %s; Rack: %s\n",
                    host.getDatacenter(), host.getAddress(), host.getRack());
            stringBuilder.append("Datacenter: ").append(host.getDatacenter()).append("; Host: ").append(host.getAddress()).append("; Rack: ").append(host.getRack());
        }
        return stringBuilder.toString();
    }

    public void close() {
        cluster.shutdown();
    }
}