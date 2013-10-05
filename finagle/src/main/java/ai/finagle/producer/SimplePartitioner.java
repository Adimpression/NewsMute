package ai.finagle.producer;

import kafka.producer.Partitioner;
import kafka.utils.VerifiableProperties;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 29/9/13
 * Time: 3:02 PM                                                                `
 */
public class SimplePartitioner implements Partitioner<String> {
    public SimplePartitioner(VerifiableProperties props) {

    }

    public int partition(String key, int a_numPartitions) {
        final int returnVal = Integer.parseInt(key.substring(4));
        System.out.println("Number of partitions:" + a_numPartitions);
        System.out.println("Selected partition: "+ returnVal + " for key:" + key);
        return returnVal;
    }

}
