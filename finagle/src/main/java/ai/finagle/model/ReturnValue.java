package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:40 PM
 */
public class ReturnValue<T> {
    final T[] data;

    public ReturnValue(final T[] data) {
        this.data = data;
    }
}
