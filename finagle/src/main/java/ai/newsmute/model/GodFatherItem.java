package ai.newsmute.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class GodFatherItem {

    private final String humanId;

    public GodFatherItem(final String humanId) {
        this.humanId = humanId;
    }

    @Override
    public String toString() {
        return "GodFatherItem{" +
                "humanId='" + humanId + '\'' +
                '}';
    }
}