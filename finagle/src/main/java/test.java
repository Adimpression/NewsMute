import ai.finagle.model.StalkItem;
import ai.finagle.util.Feed;
import com.sun.syndication.io.FeedException;

import java.io.IOException;

/**
 * "java -cp . Finagle.jar test" //See test class
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 3/11/13
 * Time: 7:51 PM
 */
class test {
    public static void main(final String[] args) throws IOException {
        //getLinkInfo("http://mobile.bbc.co.uk/arabic/middleeast/2013/11/131103_kerry_egypt");
        //getLinkInfo("http://www.worldjournal.com/view/full_Anews/23970448/article-%E7%8E%8B%E6%AF%85-%E6%8E%A8%E5%8B%95%E5%85%8D%E7%B0%BD-%E6%8F%90%E9%AB%98%E8%AD%B7%E7%85%A7%E5%90%AB%E9%87%91%E9%87%8F?instance=noon1");
        //getLinkInfo("http://www.bbc.co.uk/sinhala/sri_lanka/2013/11/131102_wilpattu.shtml");
        //getLinkInfo("http://mobile.bbc.co.uk/hindi/international/2013/11/131103_us_pakistan_taliban_aa");
        //Try not to use BBC, they most probably will do everything right and most sources might not
        //testFeed("http://feeds.rssboard.org/rssboard");
//        String action = "s";
//        StalkerAction temp;
//        final StalkerAction to = (temp = StalkerAction.FORMATER.to(StalkerAction.class, action)) != null ?  temp : StalkerAction.ERROR;
//        switch (to) {
//            case CREATE:
//                break;
//            case DELETE:
//                break;
//            default:
//                ;
//        }
//        System.out.println(BCrypt.gensalt(2));
//        try {
//            YawnerAction yawnerAction = (yawnerAction = YawnerAction.FORMATER.to(YawnerAction.class, "READ")) != null ? yawnerAction : YawnerAction.ERROR;
//            System.out.println(yawnerAction);
//        } catch (Exception e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
    }

    private static void testFeed(final String feedUrl) throws IOException, FeedException, Feed.GetFeedEntriesException {


        for (final StalkItem item : Feed.getFeedEntries(feedUrl)) {

            System.out.println("title:" + item.title);

            System.out.println("link:" + item.link);

            System.out.println("description:" + item.description);

        }

    }

}
