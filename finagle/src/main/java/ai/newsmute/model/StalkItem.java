package ai.newsmute.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class StalkItem {
    public final String link;
    public final String title;
    public final String description;

    public StalkItem(final String link, final String title, final String description) {
        this.link = link;
        this.title = title;
        this.description = description;
    }
}
