package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import ai.newsmute.db.MOOD;
import ai.newsmute.model.StalkItem;
import ai.newsmute.model.YawnItem;
import ai.newsmute.util.Feed;
import ai.newsmute.util.Printer;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.ResultSet;
import com.datastax.driver.core.Row;
import com.datastax.driver.core.Session;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private Cluster cluster;

    private Session threadSafeSession;

    public Harvester(final String databaseIp) {
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
                    final Date startTime = Calendar.getInstance().getTime();
                    LOG.info(String.format("Harvesting started at %s...", new SimpleDateFormat("MM-dd HH:mm:ss").format(startTime)));

                    final ResultSet executeStalkFetch = threadSafeSession.execute("select * from Stalk;");

                    final List<Row> allStalks = executeStalkFetch.all();

                    int totalInsertions = 0;

                    LOG.info("Number of feeds:" + allStalks.size());

                    for (final Row stalk : allStalks) {

                        final StalkItem stalkItem = new Gson().fromJson(stalk.getString("value"), StalkItem.class);
                        final String humanId = stalk.getString(0);

                        try {//Please match this with Stalker first time feed setup
                            final String feedLink = stalkItem.link;
                            LOG.info("Processing feed:" + feedLink);

                            for (final StalkItem stalkFeedItem : Feed.getFeedEntries(feedLink)) {
                                final String feedItemTitle = stalkFeedItem.title;
                                final String feedItemLink = stalkFeedItem.link;
                                final String feedItemDescription = stalkFeedItem.description;

                                final ResultSet yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.ALIVE.state, feedItemLink));
                                final ResultSet yawnRowsDidRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", humanId, MOOD.LIFE.DEAD.state, feedItemLink));

                                final boolean feedItemLinkMissing = yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty();

                                if (feedItemLinkMissing) {
                                    threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", humanId, MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0")), DBScripts.HARVESTED_YAWN_TTL));//Yet to hash the urlHash value
                                    totalInsertions++;
                                }
                            }

                        } catch (final Throwable throwable) {
                            System.err.println(throwable.getMessage());//Don't print full stack trace, will be hard to see what is failing and what is not
                        }

                    }

                    final Date endTime = Calendar.getInstance().getTime();
                    System.out.printf("Harvested finished at %s harvesting %d sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), totalInsertions);
                    LOG.info("Harvesting took " + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }

        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
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
