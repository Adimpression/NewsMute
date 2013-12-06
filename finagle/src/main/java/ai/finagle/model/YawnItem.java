package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class YawnItem {
    final String link;
    final String title;
    final String description;
    String shocks;
    final String source;

    public YawnItem(final String link, final String title, final String description, final String source, final String shocks) {
        this.link = link;
        this.title = title;
        this.description = description;
        this.source = source;
        this.shocks = shocks;
    }

    public void shock(){
        shocks = String.valueOf(Integer.parseInt(this.shocks != null ? this.shocks : "0") + 1);
    }

    public String shocks(){
        return shocks;
    }

    @Override
    public String toString() {
        return "YawnItem{" +
                "link='" + link + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", shocks='" + shocks + '\'' +
                ", source='" + source + '\'' +
                '}';
    }
}
