package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class GuardianItem {
    public final String humanId;
    public final String tokenHash;
    public final String status;

    public GuardianItem(final String humanId, final String tokenHash, final String status) {
        this.humanId = humanId;
        this.tokenHash = tokenHash;
        this.status = status;
    }

    @Override
    public String toString() {
        return "GuardianItem{" +
                "humanId='" + humanId + '\'' +
                ", tokenHash='" + tokenHash + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
