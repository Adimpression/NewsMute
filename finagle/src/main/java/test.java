import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 3/11/13
 * Time: 7:51 PM
 */
public class test {
    public static void main(final String[] args) throws IOException {
        getLinkInfo("http://mobile.bbc.co.uk/arabic/middleeast/2013/11/131103_kerry_egypt");
        getLinkInfo("http://www.worldjournal.com/view/full_Anews/23970448/article-%E7%8E%8B%E6%AF%85-%E6%8E%A8%E5%8B%95%E5%85%8D%E7%B0%BD-%E6%8F%90%E9%AB%98%E8%AD%B7%E7%85%A7%E5%90%AB%E9%87%91%E9%87%8F?instance=noon1");
        getLinkInfo("http://www.bbc.co.uk/sinhala/sri_lanka/2013/11/131102_wilpattu.shtml");
        getLinkInfo("http://mobile.bbc.co.uk/hindi/international/2013/11/131103_us_pakistan_taliban_aa");
        //Try not to use BBC, they most probably will do everything right and most sources might not
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
