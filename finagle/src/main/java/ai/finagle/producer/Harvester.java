package ai.finagle.producer;

import ai.finagle.db.DBScripts;
import ai.finagle.db.MOOD;
import ai.finagle.model.StalkItem;
import ai.finagle.model.YawnItem;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

import java.net.URL;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Harvester implements Runnable {

    private final String databaseIp;

    private Cluster cluster;

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
                    System.out.println("Harvesting...");

                    final Session connect = cluster.connect("NewsMute");

                    final ResultSet executeStalkFetch = connect.execute("select * from Stalk;");

                    final List<Row> allStalks = executeStalkFetch.all();

                    int totalInsertions = 0;

                    for (final Row stalk : allStalks) {

                        final StalkItem stalkItem = new Gson().fromJson(stalk.getString("value"), StalkItem.class);

                        try {
                            final Document feedDocument = Jsoup.parse(new URL(stalkItem.link).openStream(), "UTF-8", stalkItem.link, Parser.xmlParser());

                            final Elements itemElements = feedDocument.getElementsByTag("item");
                            Element[]  feedItems = new Element[itemElements.size()];
                            feedItems =  itemElements.toArray(feedItems);

                            for (final Element feedItem : feedItems) {

                                final String feedItemTitle = feedItem.getElementsByTag("title").first().text();
                                System.out.println("title:" + feedItemTitle);

                                final String feedItemLink = feedItem.getElementsByTag("link").first().text();
                                System.out.println("link:" + feedItemLink);

                                final String feedItemDescription = feedItem.getElementsByTag("description").first().text();
                                System.out.println("description:" + feedItemDescription);

                                final ResultSet yawnRowsNotRead = connect.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", stalk.getString(0), MOOD.LIFE.ALIVE.state, feedItemLink));
                                final ResultSet yawnRowsDidRead = connect.execute(String.format("select * from Yawn where humanId='%s' AND mood='%c' AND urlHash='%s'", stalk.getString(0), MOOD.LIFE.DEAD.state, feedItemLink));

                                final boolean feedItemLinkMissing = yawnRowsNotRead.all().isEmpty() && yawnRowsDidRead.all().isEmpty();

                                if(feedItemLinkMissing){
                                    connect.execute(String.format("insert into Yawn(humanId, mood, urlHash, value) values('%s','%c','%s','%s') USING TTL %s;", stalk.getString(0), MOOD.LIFE.ALIVE.state, feedItemLink, new Gson().toJson(new YawnItem(feedItemLink, feedItemTitle, feedItemDescription, stalkItem.link, "0")), DBScripts.HARVESTED_YAWN_TTL));//Yet to hash the urlHash value
                                    totalInsertions++;
                                } else {
                                    //Ignoring insert
                                }


                            }
                        } catch (final Throwable throwable) {
                            throwable.printStackTrace(System.err);
                        }

                        totalInsertions++;
                    }

                    System.out.println("Harvested successfully " + totalInsertions + " sessions");


                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }

            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
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
