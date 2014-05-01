package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.StalkItem;
import ai.finagle.model.YawnItem;
import ai.finagle.util.Printer;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Harvester implements Runnable {

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
                    System.out.println(String.format("Harvesting started at %s...", new SimpleDateFormat("MM-dd HH:mm:ss").format(startTime)));

                    final ResultSet executeStalkFetch = threadSafeSession.execute("select * from Stalk;");

                    final List<Row> allStalks = executeStalkFetch.all();

                    int totalInsertions = 0;

                    System.out.println("Number of feeds:" + allStalks.size());

                    for (final Row stalk : allStalks) {

                        final StalkItem stalkItem = new Gson().fromJson(stalk.getString("value"), StalkItem.class);

                        try {//Please match this with Stalker first time feed setup
                            final String feedLink = stalkItem.link;
                            System.out.println("Processing feed:" + feedLink);
                            final Document feedDocument = Jsoup.parse(new URL(feedLink).openStream(), "UTF-8", feedLink, Parser.xmlParser());

                            final Elements itemElements = feedDocument.getElementsByTag("item");
                            Element[]  feedItems = new Element[itemElements.size()];
                            feedItems =  itemElements.toArray(feedItems);

                            for (final Element feedItem : feedItems) {

                                final String feedItemTitle = feedItem.getElementsByTag("title").first().text();
                                //System.out.println("title:" + feedItemTitle);

                                final String feedItemLink = feedItem.getElementsByTag("link").first().text();
                                //System.out.println("link:" + feedItemLink);

                                final String feedItemDescription = feedItem.getElementsByTag("description").first().text();
                                //System.out.println("description:" + feedItemDescription);

                                final ResultSet yawnRowsNotRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", stalk.getString(0), MOOD.LIFE.ALIVE.state, feedItemLink));
                                final ResultSet yawnRowsDidRead = threadSafeSession.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", stalk.getString(0), MOOD.LIFE.DEAD.state, feedItemLink));

                                final boolean feedItemLinkMissing = yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty();

                                if(feedItemLinkMissing){
                                    threadSafeSession.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", stalk.getString(0), MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, feedLink, "0")), DBScripts.HARVESTED_YAWN_TTL));//Yet to hash the urlHash value
                                    totalInsertions++;
                                } else {
                                    //Ignoring insert
                                }
                            }

                            totalInsertions++;

                        } catch (final Throwable throwable) {
                            System.err.println(throwable.getMessage());//Don't print full stack trace, will be hard to see what is failing and what is not
                        }

                    }

                    final Date endTime = Calendar.getInstance().getTime();
                    System.out.printf("Harvested finished at %s harvesting %d sessions",  new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), totalInsertions);
                    System.out.println("Harvesting took %d" + new Long(endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
    }

    public void open(String node) {
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
