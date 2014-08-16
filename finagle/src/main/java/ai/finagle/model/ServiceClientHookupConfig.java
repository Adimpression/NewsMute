package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http:/NewsMute.com
 * Date: 26/1/14
 * Time: 1:41 PM
 */
public class ServiceClientHookupConfig {

    final public int exposeOnPort;

    final public String exposeOnIp;

    final private String[] bindToHosts;


    ServiceClientHookupConfig(final String exposeOnIp, final int exposeOnPort, final HostsWithPorts bindToHosts) {
        this.bindToHosts = bindToHosts.getHostsWithPorts();
        this.exposeOnPort = exposeOnPort;
        this.exposeOnIp = exposeOnIp;
    }

    public String getBindToHosts() {
        final StringBuilder stringBuilder = new StringBuilder();
        for (String bindToHost : bindToHosts) {
            if (stringBuilder.length() > 0) {
                stringBuilder.append(',');
            }
            stringBuilder.append(bindToHost);
        }
        return stringBuilder.toString();
    }
}
