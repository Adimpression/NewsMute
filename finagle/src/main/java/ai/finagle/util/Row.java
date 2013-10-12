package ai.finagle.util;

import java.util.Arrays;

/**
 * {
 * "key":"dzIxenQxemN4NW1lLXl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb20=",
 * "Cell":[
 * {"timestamp":1361062901209,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb23YQHv5gED1PxCbj2tD/FlA"}
 * ]
 * }
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 21/2/13
 * Time: 8:42 PM
 */
public class Row {
    public String key;

    public Cell[] Cell;//Caps, as per returned HBase JSON

    @Override
    public String toString() {
        return "Row{" +
                "key='" + key + '\'' +
                ", Cell=" + (Cell == null ? null : Arrays.asList(Cell)) +
                '}';
    }
}
