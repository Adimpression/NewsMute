package ai.finagle.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 26/1/14
 * Time: 1:43 PM
 */
public class ServiceClientHookupConfigSuperFriender extends ServiceClientHookupConfig {
    public ServiceClientHookupConfigSuperFriender(final String exposeOnIp, final int exposeOnPort, final HostsWithPorts bindToHosts) {
        super(exposeOnIp, exposeOnPort, bindToHosts);
    }
}
