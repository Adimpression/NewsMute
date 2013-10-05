package ai.finagle.producer;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;

import java.util.Properties;

/**
 * Created with IntelliJ IDEA Ultimate.
 * User: http://www.ilikeplaces.com
 * Date: 29/9/13
 * Time: 2:24 PM
 */
public class WallProducer {

    public static void main(String args[]) throws InterruptedException {
        Properties props = new Properties();

        props.put("metadata.broker.list", "localhost:9092");
        props.put("serializer.class", "kafka.serializer.StringEncoder");
        props.put("partitioner.class", "ai.finagle.producer.SimplePartitioner");
        props.put("producer.type", "sync");
//        props.put("partitioner.class", "kafka.producer.DefaultPartitioner");
        props.put("request.required.acks", "1");

        ProducerConfig config = new ProducerConfig(props);
        Producer<String, String> producer = new Producer<String, String>(config);

        while (true) {
            KeyedMessage<String, String> data = new KeyedMessage<String, String>("wall", "user17", Long.toString(System.currentTimeMillis()));
            producer.send(data);
            System.out.println("sent:" + data.message());
            Thread.sleep(3000);
        }

    }
}
