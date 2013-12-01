package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class YawnItem {
    final String link;
    final String title;
    final String description;
    String shocks;

    public YawnItem(final String link, final String title, final String description, final String shocks) {
        this.link = link;
        this.title = title;
        this.description = description;
        this.shocks = shocks;
    }

    public void shock(){
        shocks = String.valueOf(Integer.parseInt(this.shocks != null ? this.shocks : "0") + 1);
    }

    public String shocks(){
        return shocks;
    }
}
