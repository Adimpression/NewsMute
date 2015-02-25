package ai.newsmute.service;

import ai.newsmute.db.DBScripts;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

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


    final static String endpointYawn = "http://23.253.36.42:40200";

    final static String endpointScream = "http://23.253.36.42:30200";

    final static String endpointGuardian = "http://23.253.36.42:50200";

    final String[] countries = new String[]{"Afghanistan",
            "Albania",
            "Algeria",
            "Andorra",
            "Angola",
            "Argentina",
            "Armenia",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Barbados",
            "Belarus",
            "Belgium",
            "Belize",
            "Benin",
            "Bhutan",
            "Bolivia",
            "BosniaHerzegovina",
            "Botswana",
            "Brazil",
            "Brunei",
            "Bulgaria",
            "Burkina",
            "Burundi",
            "Cambodia",
            "Cameroon",
            "Canada",
            "CapeVerde",
            "CentralAfricanRep",
            "Chad",
            "Chile",
            "China",
            "Colombia",
            "Comoros",
            "Congo",
            "CongoDemocraticRep",
            "CostaRica",
            "Croatia",
            "Cuba",
            "Cyprus",
            "CzechRepublic",
            "Denmark",
            "Djibouti",
            "Dominica",
            "DominicanRepublic",
            "EastTimor",
            "Ecuador",
            "Egypt",
            "ElSalvador",
            "EquatorialGuinea",
            "Eritrea",
            "Estonia",
            "Ethiopia",
            "Fiji",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Honduras",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "IrelandRepublic",
            "Israel",
            "Italy",
            "IvoryCoast",
            "Jamaica",
            "Japan",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "KoreaNorth",
            "KoreaSouth",
            "Kosovo",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Macedonia",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "MarshallIslands",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "Myanmar,{Burma}",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "NewZealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "Norway",
            "Oman",
            "Pakistan",
            "Palau",
            "Panama",
            "PapuaNewGuinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Poland",
            "Portugal",
            "Qatar",
            "Romania",
            "RussianFederation",
            "Rwanda",
            "StKitts&Nevis",
            "StLucia",
            "SaintVincent&theGrenadines’",
            "Samoa",
            "SanMarino",
            "SaoTome&Principe",
            "SaudiArabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "SierraLeone",
            "Singapore",
            "Slovakia",
            "Slovenia",
            "SolomonIslands",
            "Somalia",
            "SouthAfrica",
            "Spain",
            "SriLanka",
            "Sudan",
            "Suriname",
            "Swaziland",
            "Sweden",
            "Switzerland",
            "Syria",
            "Taiwan",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Togo",
            "Tonga",
            "Trinidad&Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "UnitedArabEmirates",
            "UnitedKingdom",
            "UnitedStates",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "VaticanCity",
            "Venezuela",
            "Vietnam",
            "Yemen",
            "Zambia",
            "Zimbabwe",
    };


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

                    final List<String> failed = new ArrayList<String>();

                    for (final String country : countries) {
                        try {
                            System.out.println("Influencing: " + country);

                            final String email = country.toLowerCase() + "@adimpression.mobi";
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
                        } catch (final Throwable e) {
                            failed.add(country);
                            e.printStackTrace(System.out);
                        }
                    }

                    final Date endTime = Calendar.getInstance().getTime();

                    System.out.println("Failed:" + Arrays.toString(failed.toArray()));
                    System.out.printf("Influencing finished at %s influencing %d sessions", new SimpleDateFormat("MM-dd HH:mm:ss").format(endTime), 0);
                    System.out.println("Influencing took " + (endTime.getTime() - startTime.getTime()) + "  milliseconds");

                } catch (final Exception e) {
                    e.printStackTrace(System.err);
                }
            }
        };

        timer.scheduleAtFixedRate(task, 0, 60000 * 60);//Every ten minutes
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
