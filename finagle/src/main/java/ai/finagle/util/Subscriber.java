package ai.finagle.util;

import org.apache.avro.Schema;

/**
 *
 * For initial testing only. We had to give up on Kafka, and the suspense to get News Mute started is killing us!
 *
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 6/10/13
 * Time: 5:50 PM
 */
public class Subscriber extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {

    public void setMockData(final String mockData) {
        this.mockData = mockData;
    }

    private String mockData;

    @Override
    public Schema getSchema() {
      throw new RuntimeException("Not implemented");
    }

    @Override
    public Object get(final int i) {
        throw new RuntimeException("Not implemented");
    }

    @Override
    public void put(final int i, final Object o) {
        throw new RuntimeException("Not implemented");
    }

    public String getMockData(){
        return mockData;
    }
}
