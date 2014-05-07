package ai.finagle.util;

import com.sun.jersey.api.client.*;
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

    public static ClientResponse sendText(final String from, final String to, final String subject, final String body) {
        try {
            Client client = Client.create();
            client.addFilter(new HTTPBasicAuthFilter("api",
                    "key-"));
            WebResource webResource =
                    client.resource("https://api.mailgun.net/v2/mutenews.com" +
                            "/messages");
            MultivaluedMapImpl formData = new MultivaluedMapImpl();
            formData.add("from", from);//"Verify Email <emailcheck@mutenews.com>"
            formData.add("to", to);
            formData.add("subject", subject);
            formData.add("text", body);
            final ClientResponse response = webResource.type(MediaType.APPLICATION_FORM_URLENCODED).
                    post(ClientResponse.class, formData);

            response.bufferEntity();
            System.out.println(response.getEntity(String.class));
            return response;
        } catch (final Throwable e) {
            throw new RuntimeException(e);
        }
    }
}

