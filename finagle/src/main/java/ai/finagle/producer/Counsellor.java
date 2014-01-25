package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.SuperFriendValue;
import ai.finagle.model.YawnItem;
import com.datastax.driver.core.*;
import com.google.gson.Gson;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Counsellor implements Runnable {

    private final String databaseIp;

    private Cluster cluster;

    public Counsellor(final String databaseIp) {
        this.databaseIp = databaseIp;
    }

    @Override
    public void run() {
        this.open(databaseIp);

        final Timer timer = new Timer();
        final TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    System.out.println("Counselling...");

                    final Session connect = cluster.connect("Test1");

                    /**
                     * This operation is not heavy, Cassandra handles paging(via cursors) transparently
                     */
                    final List<Row> allScreams = connect.execute("select * from Scream;").all();

                    /**
                     * This operation is not heavy, Cassandra handles paging(via cursors) transparently
                     */
                    final List<Row> allYawns = connect.execute("select * from Yawn;").all();

                    System.out.println("Counselling " + allScreams.size() + " screams");
                    System.out.println("Counselling " + allYawns.size() + " yawns");

                    int totalInsertions = 0;

                    for (final Row screamRow : allScreams) {
                        //@FIXME: Duplicate fetches. Can we fetch by partition? For, humanId on one partition will be the same
                        final List<Row> allSuperFriends = connect.execute(String.format("select * from SuperFriend where humanId='%s'", screamRow.getString(0))).all();
                        final SuperFriendValue superFriendValue;
                        if (allSuperFriends.size() != 0) {
                            superFriendValue = new Gson().fromJson(allSuperFriends.get(0).getString("value"), SuperFriendValue.class);
                        } else {
                            superFriendValue = new SuperFriendValue(screamRow.getString(0), new String[0]);
                        }

                        for (final String friend : superFriendValue.superFriends) {//Ideally, all screams are not friends of this person, but we do so for now for testing
                            if(MOOD.DESTINY(screamRow.getString("mood")).life == MOOD.LIFE.ALIVE){

                                final String urlHash = screamRow.getString("urlHash");
                                final String value = screamRow.getString("value");

                                final List<Row> yawnRowsNotRead = connect.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", friend, MOOD.LIFE.ALIVE.state, urlHash)).all();
                                final List<Row> yawnRowsRead = connect.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", friend, MOOD.LIFE.DEAD.state, urlHash)).all();

                                if (yawnRowsNotRead.size() == 0 && yawnRowsRead.size() == 0) {
                                    connect.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, urlHash, value, DBScripts.YAWN_COUNSELLED_TTL));
                                } else if (yawnRowsNotRead.size() != 0) {
                                    final Row yawnRow = yawnRowsNotRead.get(0);
                                    final YawnItem yawnFeedItem = new Gson().fromJson(yawnRow.getString("value"), YawnItem.class);
                                    System.out.println("Fetched:" + yawnFeedItem.toString());
                                    yawnFeedItem.shock();
                                    System.out.println("Inserting:" + yawnFeedItem.toString());
                                    connect.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, yawnRow.getString("urlHash"), new Gson().toJson(yawnFeedItem), DBScripts.YAWN_COUNSELLED_TTL));
                                }
                                connect.execute(String.format("delete from Scream where humanId='%s' and mood='%c' and urlHash='%s';",
                                        superFriendValue.humanId, MOOD.LIFE.ALIVE.state, urlHash));//Yet to hash the urlHash value

                                connect.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;",
                                        superFriendValue.humanId, MOOD.LIFE.DEAD.state, urlHash, value, DBScripts.YAWN_TTL));


                                totalInsertions++;
                            } else {
                                //System.out.println("Ignoring already counselled item");
                            }
                        }
                    }

                    System.out.println("Counselled successfully " + totalInsertions + " sessions");
                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.YAWN_COUNSELLOR_REINCARNATION);
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
