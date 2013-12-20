package ai.finagle.producer;

import ai.finagle.db.DBScripts;
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

    private Cluster cluster;

    @Override
    public void run() {
        this.open("192.168.3.2");

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
                        final List<Row> allSuperFriends = connect.execute("select * from SuperFriend where humanId='" + screamRow.getString(0) + "'").all();
                        final SuperFriendValue superFriendValue;
                        if (allSuperFriends.size() != 0) {
                            superFriendValue = new Gson().fromJson(allSuperFriends.get(0).getString("value"), SuperFriendValue.class);
                        } else {
                            superFriendValue = new SuperFriendValue(screamRow.getString(0), new String[0]);
                        }

                        for (final String friend : superFriendValue.superFriends) {//Ideally, all screams are not friends of this person, but we do so for now for testing
                            if(Integer.parseInt(screamRow.getString("mood")) == 0){


                                final String urlHash = screamRow.getString("urlHash");
                                final String value = screamRow.getString("value");

                                final List<Row> yawnRowsNotRead = connect.execute("select * from Yawn where humanId='" + friend + "' AND mood='" + "0" + "' AND urlHash='" + urlHash + "'").all();
                                final List<Row> yawnRowsRead = connect.execute("select * from Yawn where humanId='" + friend + "' AND mood='" + "1" + "' AND urlHash='" + urlHash + "'").all();

                                if (yawnRowsNotRead.size() == 0 && yawnRowsRead.size() == 0) {
                                    connect.execute("insert into Yawn(humanId, mood, urlHash, value) values('" + friend + "','" + "0" + "','" + urlHash + "','" + value + "') USING TTL " + DBScripts.YAWN_TTL + ";");
                                } else if (yawnRowsNotRead.size() != 0) {
                                    final Row yawnRow = yawnRowsNotRead.get(0);
                                    final YawnItem yawnFeedItem = new Gson().fromJson(yawnRow.getString("value"), YawnItem.class);
                                    System.out.println("Fetched:" + yawnFeedItem.toString());
                                    yawnFeedItem.shock();
                                    System.out.println("Inserting:" + yawnFeedItem.toString());
                                    connect.execute("insert into Yawn(humanId, mood, urlHash, value) values('" + friend + "','" + "0" + "','" + yawnRow.getString("urlHash") + "','" + new Gson().toJson(yawnFeedItem) + "');");
                                }
                                System.out.println(String.format("delete from Scream where humanId='%s' and mood='0' and urlHash='%s';",
                                        superFriendValue.humanId, urlHash));
                                connect.execute(String.format("delete from Scream where humanId='%s' and mood='0' and urlHash='%s';",
                                        superFriendValue.humanId, urlHash));//Yet to hash the urlHash value

                                System.out.println(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','1','%s','%s') USING TTL %d;",
                                        superFriendValue.humanId, urlHash, value, DBScripts.YAWN_TTL));
                                connect.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','1','%s','%s') USING TTL %d;",
                                        superFriendValue.humanId, urlHash, value, DBScripts.YAWN_TTL));


                                totalInsertions++;
                            } else {
                                System.out.println("Ignoring already counselled item");
                            }
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
