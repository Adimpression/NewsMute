package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import ai.newsmute.db.MOOD;
import ai.newsmute.model.YawnItem;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Counsellor implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(Counsellor.class);

    private final String databaseIp;


    @Autowired
    public DBScripts.DB db;

    private Cluster cluster;

    private Session threadSafeSession;

    private DynamoDB dynamoDB;

    private Table tableScream;
    private Table tableYawn;
    private Table tableSuperFriend;


    public Counsellor(final String databaseIp) {
        this.databaseIp = databaseIp;
    }

    @Override
    public void run() {

        switch (db) {
            case DynamoDB:
                break;
            case Cassandra:
                this.open(databaseIp);
                break;
            default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
        }

        final Timer timer = new Timer();
        final TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    final Date startTime = Calendar.getInstance().getTime();

                    LOG.info("Counselling started at {}...", new SimpleDateFormat("MM-dd HH:mm:ss").format(startTime));

                    int totalInsertions = 0;

                    switch (db) {
                        case DynamoDB:    {
                            for (final Item screamRow : tableScream.scan()) {

                                //@FIXME: Duplicate fetches. Can we fetch by partition? For, humanId on one partition will be the same
                                final ItemCollection<QueryOutcome> allSuperFriends = tableSuperFriend.query("humanId", screamRow.getString("humanId"));

                                for (final Item friendRow : allSuperFriends) {//Ideally, all screams are not friends of this person, but we do so for now for testing
                                    final String humanId = friendRow.getString("humanId");
                                    final String friend = friendRow.getString("humanSuperFriend");

                                    if (MOOD.DESTINY(screamRow.getString("mood")).life == MOOD.LIFE.ALIVE) {

                                        final String urlHash = screamRow.getString("urlHash");
                                        final String value = screamRow.getString("value");

                                        final Item yawnRowsNotRead = tableYawn.getItem("humanId", friend, "ranger", MOOD.LIFE.DEAD.state + urlHash);
                                        final Item yawnRowsRead = tableYawn.getItem("humanId", friend, "ranger", MOOD.LIFE.DEAD.state + urlHash);

                                        if (yawnRowsNotRead == null && yawnRowsRead == null) {
                                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, urlHash, value, DBScripts.YAWN_COUNSELLED_TTL));
                                        } else if (yawnRowsNotRead != null) {
                                            final YawnItem yawnFeedItem = new Gson().fromJson(yawnRowsNotRead.getString("value"), YawnItem.class);
                                            LOG.info("Fetched:" + yawnFeedItem.toString());
                                            yawnFeedItem.shock();
                                            LOG.info("Inserting:" + yawnFeedItem.toString());
                                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, yawnRowsNotRead.getString("urlHash"), new Gson().toJson(yawnFeedItem), DBScripts.YAWN_COUNSELLED_TTL));
                                        }

                                        //Removing scream record as alive
                                        tableScream.deleteItem("humanId", humanId,"ranger", MOOD.LIFE.ALIVE.state + urlHash);//Yet to hash the urlHash value

                                        //Inserting scream record as dead
                                        tableScream.putItem(new Item().withPrimaryKey("humanId", humanId, "ranger",  MOOD.LIFE.DEAD.state + urlHash).withString("value", value));

                                        totalInsertions++;
                                    } else {
                                        //LOG.info("Ignoring already counselled item");
                                    }
                                }
                            }
                            break;
                        }
                        case Cassandra:{
                            for (final Row screamRow : threadSafeSession.execute("select * from Scream;")) {
                                //@FIXME: Duplicate fetches. Can we fetch by partition? For, humanId on one partition will be the same
                                final List<Row> allSuperFriends = threadSafeSession.execute(String.format("select * from SuperFriend where humanId='%s'", screamRow.getString(0))).all();

                                for (final Row friendRow : allSuperFriends) {//Ideally, all screams are not friends of this person, but we do so for now for testing
                                    final String humanId = friendRow.getString("humanId");
                                    final String friend = friendRow.getString("humanSuperFriend");

                                    if (MOOD.DESTINY(screamRow.getString("mood")).life == MOOD.LIFE.ALIVE) {

                                        final String urlHash = screamRow.getString("urlHash");
                                        final String value = screamRow.getString("value");

                                        final List<Row> yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", friend, MOOD.LIFE.ALIVE.state, urlHash)).all();
                                        final List<Row> yawnRowsRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", friend, MOOD.LIFE.DEAD.state, urlHash)).all();

                                        if (yawnRowsNotRead.size() == 0 && yawnRowsRead.size() == 0) {
                                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, urlHash, value, DBScripts.YAWN_COUNSELLED_TTL));
                                        } else if (yawnRowsNotRead.size() != 0) {
                                            final Row yawnRow = yawnRowsNotRead.get(0);
                                            final YawnItem yawnFeedItem = new Gson().fromJson(yawnRow.getString("value"), YawnItem.class);
                                            LOG.info("Fetched:" + yawnFeedItem.toString());
                                            yawnFeedItem.shock();
                                            LOG.info("Inserting:" + yawnFeedItem.toString());
                                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;", friend, MOOD.LIFE.ALIVE.state, yawnRow.getString("urlHash"), new Gson().toJson(yawnFeedItem), DBScripts.YAWN_COUNSELLED_TTL));
                                        }

                                        //Removing scream record as alive
                                        threadSafeSession.execute(String.format("delete from Scream where humanId='%s' and mood='%c' and urlHash='%s';",
                                                humanId, MOOD.LIFE.ALIVE.state, urlHash));//Yet to hash the urlHash value

                                        //Inserting scream record as dead
                                        threadSafeSession.execute(String.format("insert into Scream(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %d;",
                                                humanId, MOOD.LIFE.DEAD.state, urlHash, value, DBScripts.YAWN_TTL));


                                        totalInsertions++;
                                    } else {
                                        //LOG.info("Ignoring already counselled item");
                                    }
                                }
                            }
                            break;
                        }
                        default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                    }


                    final Date endTime = Calendar.getInstance().getTime();
                    LOG.info("Counselling finished at {} counselling {} sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), totalInsertions);
                    LOG.info("Counselling took %d" + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.YAWN_COUNSELLOR_REINCARNATION);
    }

    void open(String node) {
        cluster = Cluster.builder()
                .addContactPoint(node)
                .build();
        cluster.connect();
        threadSafeSession = cluster.connect("NewsMute");
        Printer.printClusterMetadata(cluster);
    }

    public void close() {
        cluster.shutdown();
    }
}
