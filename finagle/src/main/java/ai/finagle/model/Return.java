package ai.finagle.model;

/**
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 26/10/13
 * Time: 11:43 PM
 */
public class Return<T extends ReturnValue> {
    public final T returnValue;
    public final String returnMessage;
    public final String returnStatus;

    public Return(final T returnValue, final String returnMessage, final String returnStatus) {
        this.returnValue = returnValue;
        this.returnMessage = returnMessage;
        this.returnStatus = returnStatus;
    }
}
