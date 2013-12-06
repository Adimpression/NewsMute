package ai.finagle.model;

import java.util.List;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 3/11/13
 * Time: 1:40 PM
 */
public class SuperFriendValue {
    final public String humanId;
    final public String[] superFriends;

    public SuperFriendValue(final String humanId, final String[] superFriends) {
        this.humanId = humanId;
        this.superFriends = superFriends;
    }
}
