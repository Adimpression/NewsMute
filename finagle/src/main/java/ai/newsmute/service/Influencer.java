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
 * Phase 1:
 * Read data of an account.
 * Share all data.
 *
 * Phase 2:
 * Dynamic subscribe for trends during read
 *
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
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

                    final String email = "@adimpression.mobi";
                    final String passwordHash = get_hash("");
                    final String url = endpointGuardian + "/?user=" + get_hash(email) + "&token=" + passwordHash + "&nmact=" + "READ";

                    final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(url).asJson();

                    System.out.println(jsonNodeHttpResponse.getBody());

                    final JSONObject body = jsonNodeHttpResponse.getBody().getObject();

                    final JSONObject status = body.getJSONObject("returnValue");

                    final String tokenHash = status.getJSONArray("data").getJSONObject(0).getString("tokenHash");

                    System.out.println(tokenHash);


                    final Date endTime = Calendar.getInstance().getTime();
                    System.out.printf("Influencing finished at %s influencing %d sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), 0);
                    System.out.println("Influencing took " + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }
            }
        };

        timer.scheduleAtFixedRate(task, 0, DBScripts.STALK_HARVESTER_REINCARNATION);//Every ten minutes
    }

    private String get_hash(final String email) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-512");
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
