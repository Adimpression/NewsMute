package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 30/12/14
 * Time: 12:18 AM
 */
public class Influencer implements Runnable {

    public Influencer() {
    }

    @Override
    public void run() {
        final Timer timer = new Timer();
        final TimerTask task = new TimerTask() {
            @Override
            public void run() {
                try {
                    final Date startTime = Calendar.getInstance().getTime();
                    System.out.println(String.format("Influencing started at %s...", new SimpleDateFormat("MM-dd HH:mm:ss").format(startTime)));

                    final String endpointGuardian = "http://guardian.newsmute.com:50200";

                    //Get complete hashed password in hex format

                    final String email = "@gmail.com";
                    final String passwordHash = get_hash("");
                    final String url = endpointGuardian + "/?user=" + get_hash(email) + "&token=" + passwordHash + "&nmact=" + "READ";

                    final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(url)
                            .queryString("name", "Mark")
                            .field("last", "Polo")
                            .asJson();

                    System.out.println(jsonNodeHttpResponse.getStatusText());

                    System.out.println(jsonNodeHttpResponse.getBody());

                    final JSONObject body = jsonNodeHttpResponse.getBody().getObject();

                    final JSONObject status = body.getJSONObject("returnValue");

                    System.out.println(status);


                    final Date endTime = Calendar.getInstance().getTime();
                    System.out.printf("Influencing finished at %s influencing %d sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), 0);
                    System.out.println("Harvesting took " + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }
            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
    }

    private String get_hash(final String email) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("MD5");
        //Add password bytes to digest
        md.update(email.getBytes());
        //Get the hash's bytes
        byte[] bytes = md.digest();
        //This bytes[] has bytes in decimal format;
        //Convert it to hexadecimal format
        StringBuilder sb = new StringBuilder();
        for (final byte aByte : bytes) {
            sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        new Influencer().run();
    }
}
