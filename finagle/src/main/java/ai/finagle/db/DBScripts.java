package ai.finagle.db;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 30/11/13
 * Time: 5:38 PM
 */
public class DBScripts {
    public static final String CREATE_SCREAM = "create table Scream(\n" +
            "      humanId varchar,\n" +
            "      urlHash varchar,\n" +
            "      value varchar,\n" +
            "      PRIMARY KEY (humanId, urlHash));";

    public static final String CREATE_STALK = "create table Stalk(\n" +
            "      humanId varchar,\n" +
            "      urlHash varchar,\n" +
            "      value varchar,\n" +
            "      PRIMARY KEY (humanId, urlHash));";

    public static final String CREATE_SUPERFRIEND = "create table SuperFriend(\n" +
            "      humanId varchar,\n" +
            "      value varchar,\n" +
            "      PRIMARY KEY (humanId));";

    public static final String CREATE_YAWN = "create table Yawn(\n" +
            "      humanId varchar,\n" +
            "      urlHash varchar,\n" +
            "      value varchar,\n" +
            "      PRIMARY KEY (humanId, urlHash));";
}
