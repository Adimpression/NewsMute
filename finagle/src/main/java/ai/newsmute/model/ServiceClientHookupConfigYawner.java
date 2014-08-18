package ai.newsmute.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http:/NewsMute.com
 * Date: 26/1/14
 * Time: 1:42 PM
 */
public class ServiceClientHookupConfigYawner extends ServiceClientHookupConfig {
    public ServiceClientHookupConfigYawner(final String exposeOnIp, final int exposeOnPort, final HostsWithPorts bindToHosts) {
        super(exposeOnIp, exposeOnPort, bindToHosts);
    }
}
