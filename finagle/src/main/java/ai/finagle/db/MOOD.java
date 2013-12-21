package ai.finagle.db;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 21/12/13
 * Time: 3:30 PM
 */
public class MOOD {

    /**
     * This signifies the state of an entry on the row, deleted or live.
     * There is a TTL correspondence since, a deleted entry can spam the system.
     * So we keep it with state {@link ai.finagle.db.MOOD.LIFE#DEAD} for some time.
     * <ul>
     *     <li>Deals with TTL of cassandra.</li>
     *     <li>Deals with removal and adding of entries</li>
     * </ul>
     */
    public enum LIFE{
        DEAD('1'),
        ALIVE('0');

        public final char state;

        LIFE(final char state) {
            this.state = state;
        }

    }

    public enum FAME{

    }
}
