package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 24/11/13
 * Time: 4:47 PM
 */
public class YawnFeedItem extends YawnItem {
    final String source;
    public YawnFeedItem(final String link, final String title, final String description, final String source, final String count) {
        super(link, title, description, count);
        this.source = source;
    }
}
