package ai.finagle.producer;

import ai.finagle.model.StalkItem;
import ai.finagle.model.SuperFriendValue;
import ai.finagle.model.YawnItem;
import com.datastax.driver.core.*;
import com.google.gson.Gson;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.net.URL;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 27/10/13
 * Time: 12:51 PM
 */
public class Harvester implements Runnable {

    private Cluster cluster;

    @Override
    public void run() {
        this.open("10.208.27.21");

        final Timer timer = new Timer();
        final TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    System.out.println("Harvesting...");

                    final Session connect = cluster.connect("Test1");

                    final ResultSet executeStalkFetch = connect.execute("select * from Stalk;");

                    final List<Row> allStalks = executeStalkFetch.all();

                    int totalInsertions = 0;

                    for (final Row stalk : allStalks) {

                        final StalkItem value = new Gson().fromJson(stalk.getString("value"), StalkItem.class);

                        try {
                            final Document document = Jsoup.parse(new URL(value.link).openStream(), "UTF-8", value.link);


                            final Elements itemElements = document.getElementsByTag("item");
                            Element[]  items = new Element[itemElements.size()];
                            items =  itemElements.toArray(items);

                            for (final Element item : items) {

                                final String title = item.getElementsByTag("title").first().text();
                                System.out.println("title:" + title);

                                final String link = item.getElementsByTag("link").first().text();
                                System.out.println("link:" + link);

                                final String description = item.getElementsByTag("description").first().text();
                                System.out.println("description:" + description);

                                connect.execute("insert into Yawn(humanId, urlHash, value) values('" + stalk.getString(0) + "','" + link + "','" + new Gson().toJson(new YawnItem(link, title, description)) + "');");//Yet to hash the urlHash value
                                totalInsertions++;
                            }
                        } catch (final Throwable throwable) {
                            throwable.printStackTrace(System.err);
                        }


                        totalInsertions++;
                    }

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
