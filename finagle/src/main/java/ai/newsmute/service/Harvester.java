package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import ai.newsmute.db.MOOD;
import ai.newsmute.model.StalkItem;
import ai.newsmute.model.YawnItem;
import ai.newsmute.util.Feed;
import ai.newsmute.util.Printer;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.ScanSpec;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
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
public class Harvester implements Runnable {

    private static final Logger LOG = LoggerFactory.getLogger(Harvester.class);

    private final String databaseIp;

    @Autowired
    public DBScripts.DB db;

    private Cluster cluster;

    private Session threadSafeSession;

    private DynamoDB dynamoDB;

    private Table tableStalk;
    private Table tableYawn;

    public Harvester(final String databaseIp) {
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

                    LOG.info("Harvesting started at {}...", new SimpleDateFormat("MM-dd HH:mm:ss").format(startTime));

                    int totalInsertions = 0;

                    switch (db) {
                        case DynamoDB:
                            final ItemCollection<ScanOutcome> items = tableStalk.scan(new ScanSpec());
                            for (final Item stalk : items) {
                                final StalkItem stalkItem = new Gson().fromJson(stalk.getString("value"), StalkItem.class);
                                final String humanId = stalk.getString("humanId");

                                totalInsertions = doHarvestItem(stalkItem.link, humanId);
                            }

                            break;
                        case Cassandra:
                            final ResultSet executeStalkFetch = threadSafeSession.execute("select * from Stalk;");
                            final List<Row> allStalks = executeStalkFetch.all();
                            LOG.info("Number of feeds:" + allStalks.size());
                            for (final Row stalk : allStalks) {

                                final StalkItem stalkItem = new Gson().fromJson(stalk.getString("value"), StalkItem.class);
                                final String humanId = stalk.getString(0);

                                totalInsertions = doHarvestItem(stalkItem.link, humanId);
                            }
                            break;
                        default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                    }

                    final Date endTime = Calendar.getInstance().getTime();
                    LOG.info("Harvested finished at {} harvesting {} sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), totalInsertions);
                    LOG.info("Harvesting took " + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }

        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
    }

    private int doHarvestItem(final String feedLink, final String humanId) {
        int totalInsertions = 0;

        try {//Please match this with Stalker first time feed setup
            LOG.info("Processing feed:" + feedLink);

            for (final StalkItem stalkFeedItem : Feed.getFeedEntries(feedLink)) {
                final String feedItemTitle = stalkFeedItem.title;
                final String feedItemLink = stalkFeedItem.link;
                final String feedItemDescription = stalkFeedItem.description;


                switch (db) {
                    case DynamoDB:
                        final Item yawnRowNotRead = tableYawn.getItem("humanId", humanId, "ranger", MOOD.LIFE.ALIVE.state + feedItemLink);
                        final Item yawnRowDidRead = tableYawn.getItem("humanId", humanId, "ranger", MOOD.LIFE.DEAD.state + feedItemLink);
                        if (yawnRowNotRead == null && yawnRowDidRead == null) {
                            tableYawn.putItem(new Item().withPrimaryKey("humanId", humanId, "ranger", MOOD.LIFE.ALIVE.state + feedItemLink).with("value", new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0"))));
                            totalInsertions++;
                        }
                        break;
                    case Cassandra:
                        final ResultSet yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.ALIVE.state, feedItemLink));
                        final ResultSet yawnRowsDidRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.DEAD.state, feedItemLink));
                        if (yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty()) {
                            threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", humanId, MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0")), DBScripts.HARVESTED_YAWN_TTL));//Yet to hash the urlHash value
                            totalInsertions++;
                        }
                        break;
                    default: throw new UnsupportedOperationException("Unknown DB Type:" + db);
                }
            }
        } catch (final Throwable throwable) {
            System.err.println(throwable.getMessage());//Don't print full stack trace, will be hard to see what is failing and what is not
        }
        return totalInsertions;
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
