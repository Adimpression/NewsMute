package ai.newsmute.model;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http:/NewsMute.com
 * Date: 26/1/14
 * Time: 5:12 PM
 */
public class HostsWithPorts {

    private final String[] hostsWithPorts;

    /**
     * @param hostAndPort e.g. 192.168.11.12:8090,192.168.11.12:8090,
     */
    public HostsWithPorts(final String... hostsWithPorts) {

        this.hostsWithPorts = hostsWithPorts;
    }

    public String[] getHostsWithPorts() {
        return hostsWithPorts;
    }
}
