package ai.finagle.util;

/**
 * "Cell":[{"timestamp":1361062901209,"column":"dmFsdWU6dmFsdWU=","$":"Mnl1cmVrYTU1MUBpbGlrZXBsYWNlcy5jb23YQHv5gED1PxCbj2tD/FlA"}]}
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 21/2/13
 * Time: 8:29 PM
 */
public class Cell {
    public String timestamp;

    public String column;

    public String $;//Bad bad bad B-(

    @Override
    public String toString() {
        return "Cell{" +
                "timestamp='" + timestamp + '\'' +
                ", column='" + column + '\'' +
                ", $='" + $ + '\'' +
                '}';
    }
}
