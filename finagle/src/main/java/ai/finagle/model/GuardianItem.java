package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:46 PM
 */
public class GuardianItem {
    public static final String OK = "OK";
    public static final String ERROR = "ERROR";
    public static final String NO_ACCOUNT = "NO_ACCOUNT";

    public final String humanIdHash;
    public final String tokenHash;
    public final String status;

    public GuardianItem(final String humanIdHash, final String tokenHash, final String status) {
        this.humanIdHash = humanIdHash;
        this.tokenHash = tokenHash;
        this.status = status;
    }

    @Override
    public String toString() {
        return "GuardianItem{" +
                "humanIdHash='" + humanIdHash + '\'' +
                ", tokenHash='" + tokenHash + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
