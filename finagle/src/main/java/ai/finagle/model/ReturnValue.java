package ai.finagle.model;

import java.util.Arrays;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/10/13
 * Time: 12:40 PM
 */
public class ReturnValue<T> {
    public final T[] data;

    public ReturnValue(final T[] data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ReturnValue{" +
                "data=" + Arrays.toString(data) +
                '}';
    }
}
