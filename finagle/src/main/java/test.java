import ai.finagle.producer.StalkerAction;
import ai.finagle.producer.YawnerAction;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.mindrot.jbcrypt.BCrypt;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.URL;

/**
 *
 * "java -cp . Finagle.jar test" //See test class
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 3/11/13
 * Time: 7:51 PM
 */
public class test {
    public static void main(final String[] args) throws IOException {
        //getLinkInfo("http://mobile.bbc.co.uk/arabic/middleeast/2013/11/131103_kerry_egypt");
        //getLinkInfo("http://www.worldjournal.com/view/full_Anews/23970448/article-%E7%8E%8B%E6%AF%85-%E6%8E%A8%E5%8B%95%E5%85%8D%E7%B0%BD-%E6%8F%90%E9%AB%98%E8%AD%B7%E7%85%A7%E5%90%AB%E9%87%91%E9%87%8F?instance=noon1");
        //getLinkInfo("http://www.bbc.co.uk/sinhala/sri_lanka/2013/11/131102_wilpattu.shtml");
        //getLinkInfo("http://mobile.bbc.co.uk/hindi/international/2013/11/131103_us_pakistan_taliban_aa");
        //Try not to use BBC, they most probably will do everything right and most sources might not
        //testFeed("http://feeds.rssboard.org/rssboard");
//        String action = "s";
//        StalkerAction temp;
//        final StalkerAction to = (temp = StalkerAction.FORMATER.to(StalkerAction.class, action)) != null ?  temp : StalkerAction.ERROR;
//        switch (to) {
//            case CREATE:
//                break;
//            case DELETE:
//                break;
//            default:
//                ;
//        }
//        System.out.println(BCrypt.gensalt(2));
//        try {
//            YawnerAction yawnerAction = (yawnerAction = YawnerAction.FORMATER.to(YawnerAction.class, "READ")) != null ? yawnerAction : YawnerAction.ERROR;
//            System.out.println(yawnerAction);
//        } catch (Exception e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
    }

    private static void testFeed(final String feedUrl) throws IOException {
        Document document = Jsoup.parse(new URL(feedUrl).openStream(), "UTF-8", feedUrl, Parser.xmlParser());

        System.out.println("Document:" + document.toString());

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

        }

    }

    private static void getLinkInfo(final String url) throws IOException {
        final Document document = Jsoup.parse(new URL(url).openStream(), "UTF-8", url);
        final String title = document.getElementsByTag("title").first().text();
        System.out.println("title:" + title);
        String description = title;
        for (final Element meta : document.getElementsByTag("meta")) {
            if (meta.attr("name").equals("description")) {
                description = meta.attr("content");
                break;
            }
        }
        System.out.println("description:" + description);
        final File file = new File("/tmp/" + System.currentTimeMillis() + ".enc");
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
        outputStreamWriter.write(title + " - " + description);
        outputStreamWriter.close();
        fileOutputStream.close();
    }

}
