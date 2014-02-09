package ai.finagle.db;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 30/11/13
 * Time: 5:38 PM
 */
public class DBScripts {
    public static final String CREATE_SCREAM = "create table Scream(humanId varchar, mood varchar, urlHash varchar, value varchar, PRIMARY KEY (humanId, mood, urlHash));";

    public static final String CREATE_YAWN = "create table Yawn(humanId varchar, mood varchar, urlHash varchar, value varchar, PRIMARY KEY (humanId, mood, urlHash));";

    public static final String CREATE_STALK = "create table Stalk(humanId varchar, mood varchar, urlHash varchar, value varchar, PRIMARY KEY (humanId, mood, urlHash));";

    public static final String CREATE_SUPERFRIEND = "create table SuperFriend(humanId varchar, humanSuperFriend value varchar,  PRIMARY KEY (humanId, humanSuperFriend));";

    public static final String CREATE_GUARDIAN = "create table Guardian(humanId varchar, value varchar,  PRIMARY KEY (humanId));";

    public static final String CREATE_SESSION = "create table Session(sessionId varchar, value varchar,  PRIMARY KEY (sessionId));";

    public static final int YAWN_TTL = 600;
    public static final int YAWN_COUNSELLED_TTL = 600;
    public static final int YAWN_COUNSELLOR_REINCARNATION = 60000;//millis
    public static final int YAWN_READED_TTL = 86400 * 14;//Fourteen days
    public static final int SESSION_TTL = 86400 * 14;//Fourteen days//Don't go higher, in case a software update makes sessions inconsistent we can atleast recover in two weeks

    public static final int STALK_HARVESTER_REINCARNATION = 600000;

    public static final Object HARVESTED_YAWN_TTL = 1200;
}
