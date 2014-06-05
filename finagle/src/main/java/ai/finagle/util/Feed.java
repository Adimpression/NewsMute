package ai.finagle.util;

import ai.finagle.model.StalkItem;
import com.sun.syndication.feed.synd.SyndEntry;
import com.sun.syndication.io.FeedException;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;

import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 5/6/14
 * Time: 12:55 PM
 */
public class Feed {

    public static List<StalkItem> getFeedEntries(final String feedLink) throws IOException, FeedException, GetFeedEntriesException {

        try {
            final URLConnection urlConnection = new URL(feedLink).openConnection();
            urlConnection.setConnectTimeout(1000);
            urlConnection.setReadTimeout(1000);

            final List<StalkItem> returnVal = new ArrayList<StalkItem>();

            for (final Object o : new SyndFeedInput().build(new XmlReader(urlConnection)).getEntries()) {
                final SyndEntry feedItem = (SyndEntry) o;

                returnVal.add(new StalkItem(feedItem.getLink(), feedItem.getTitle(), feedItem.getDescription().getValue()));
            }

            return returnVal;

        } catch (IOException e) {
            throw new GetFeedEntriesException(e);
        } catch (IllegalArgumentException e) {
            throw new GetFeedEntriesException(e);
        } catch (FeedException e) {
            throw new GetFeedEntriesException(e);
        }
    }

    private static class GetFeedEntriesException extends Exception {
        public GetFeedEntriesException(final Throwable t) {
            super(t);
        }
    }
}
