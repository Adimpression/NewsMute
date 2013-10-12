package ai.finagle.util;

import java.util.Arrays;

/**
 * {
 * "Row":  [
 * {
 * "key":"dzIxenQxemN4NW1lLXl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb20=",
 * "Cell":[
 * {"timestamp":1361062901209,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb23YQHv5gED1PxCbj2tD/FlA"}
 * ]
 * }
 * ]
 * }
 * <p/>
 * <p/>
 * {"Row":[
 * {
 * "key":"dzIxenQxdmd2NW1lLXl1cmVrYTU1MkBpbGlrZXBsYWNlcy5jb20=",
 * "Cell":[{"timestamp":1361062979739,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MkBpbGlrZXBsYWNlcy5jb21GYJ3dFUL1PxCbjwMV/FlA"}]},
 * {
 * "key":"dzIxenQxemN4NW1l",
 * "Cell":[{"timestamp":1361062610290,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MEBpbGlrZXBsYWNlcy5jb23YQHv5gED1PxCbj2tD/FlA"}]},
 * {
 * "key":"dzIxenQxemN4NW1lLXl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb20=",
 * "Cell":[{"timestamp":1361062901209,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb23YQHv5gED1PxCbj2tD/FlA"}]}
 * ]
 * }
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 21/2/13
 * Time: 8:19 PM
 */
public class RowResponse {
    public Row[] Row;

    @Override
    public String toString() {
        return "RowResponse{" +
                "Row=" + (Row == null ? null : Arrays.asList(Row)) +
                '}';
    }
}
