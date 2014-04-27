package ai.finagle.util;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;

import javax.ws.rs.core.MediaType;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://NewsMute.com
 * Date: 27/4/14
 * Time: 5:34 PM
 */
public class Email {

    public static ClientResponse SendSimpleMessage() {
        Client client = Client.create();
        client.addFilter(new HTTPBasicAuthFilter("api",
                "key-3ax6xnjp29jd6fds4gc373sgvjxteol0"));
        WebResource webResource =
                client.resource("https://api.mailgun.net/v2/samples.mailgun.org" +
                        "/messages");
        MultivaluedMapImpl formData = new MultivaluedMapImpl();
        formData.add("from", "Verify Email <emailcheck@mutenews.com>");
        formData.add("to", "ravindranathakila@gmail.com");
        formData.add("subject", "Confirm Your Email");
        formData.add("text", "Please help News Mute confirm your email by clicking on the link below. " +
                "http://NewsMute.com . THank you!");
        return webResource.type(MediaType.APPLICATION_FORM_URLENCODED).
                post(ClientResponse.class, formData);
    }


    public static void main(final String args[]){
        final ClientResponse clientResponse = SendSimpleMessage();
        System.out.println(clientResponse.toString());
    }
}
