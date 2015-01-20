package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.json.JSONArray;
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
 * <p/>
 * Phase 2:
 * Dynamic subscribe for trends during read
 * <p/>
 * <p/>
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.NewsMute.com
 * Date: 30/12/14
 * Time: 12:18 AM
 */
public class Influencer implements Runnable {


    final static String endpointYawn = "http://yawn.newsmute.com:40200";

    final static String endpointScream = "http://scream.newsmute.com:30200";

    final static String endpointStalk = "http://stalk.newsmute.com:16285";

    final static String endpointSuperFriend = "http://superfriend.newsmute.com:20200";

    final static String endpointGuardian = "http://guardian.newsmute.com:50200";

    final static String endpointGodFather = "http://guardian.newsmute.com:40700";

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

                    //Get complete hashed password in hex format

                    final String email = "@adimpression.mobi";
                    final String passwordHash = get_hash("");

                    final String tokenHash;
                    {
                        final String login = endpointGuardian + "/?user=" + get_hash(email) + "&token=" + passwordHash + "&nmact=" + "READ";
                        final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(login).asJson();
                        final JSONObject body = jsonNodeHttpResponse.getBody().getObject();
                        final JSONObject status = body.getJSONObject("returnValue");
                        tokenHash = status.getJSONArray("data").getJSONObject(0).getString("tokenHash");
                    }

                    final JSONArray data;
                    {
                        final String login = endpointYawn + "/?user=" + get_hash(email) + "&nmact=" + "READ";
                        final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(login)
                                .header("x-session-header", tokenHash)
                                .asJson();
                        final JSONObject body = jsonNodeHttpResponse.getBody().getObject();
                        System.out.println(body.toString());
                        final JSONObject status = body.getJSONObject("returnValue");
                        data = status.getJSONArray("data");
                    }

                    {
                        for (int i = 0; i < data.length(); i++) {
                            final String link = data.getJSONObject(i).getString("link");
                            {
                                {
                                    final String login = endpointScream;
                                    final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(login)
                                            .queryString("user", get_hash(email))
                                            .queryString("url", link)
                                            .header("x-session-header", tokenHash)
                                            .asJson();
                                    final JSONObject body = jsonNodeHttpResponse.getBody().getObject();
                                    System.out.println(body.toString());
                                }
                                {
                                    final String login = endpointYawn;
                                    final HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(login)
                                            .queryString("user", get_hash(email))
                                            .queryString("url", link)
                                            .queryString("nmact", "DELETE")
                                            .header("x-session-header", tokenHash)
                                            .asJson();
                                    final JSONObject body = jsonNodeHttpResponse.getBody().getObject();
                                    System.out.println(body.toString());
                                }
                            }
                        }
                    }


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
