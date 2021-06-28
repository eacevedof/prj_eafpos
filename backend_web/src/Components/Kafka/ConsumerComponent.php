<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link eduardoaf.com
 * @name App\Components\Kafka\ConsumerComponent
 * @file KafkaConsumerComponent.php 1.0.0
 * @date 21-06-2020 21:04 SPAIN
 * @observations
 */
namespace App\Components\Kafka;

use App\Traits\LogTrait;
use \RdKafka\Conf;
use \RdKafka\Consumer;
use \RdKafka\TopicConf;
use \RdKafka\ConsumerTopic;


final class ConsumerComponent
{
    use LogTrait;

    private const KAFKA_TOPIC = "queue-logs";
    private const REQUEST_SLEEP_TIME = 30 * 1000;
    private const KAFKA_SOCKET = "php-eafpos-kafka:9092";

    private static $consumer;

    private function get_config(): Conf
    {
        $conf = new Conf();
        $conf->set("bootstrap.servers", self::KAFKA_SOCKET);
        $conf->set("group.id", "test-consumer-group");
        return $conf;        
    }
    
    private function get_topic(): TopicConf
    {
        $topicconf = new TopicConf();
        $topicconf->set("request.required.acks", 1);
        $topicconf->set("auto.commit.enable", 0);
        $topicconf->set("auto.commit.interval.ms", 100);
        $topicconf->set("offset.store.method", "broker");
        return $topicconf;
    }
    
    private function get_consumer(): Consumer
    {
        if(!self::$consumer) {
            $config = $this->get_config();
            $consumer = new Consumer($config);
            self::$consumer = $consumer;
        }
        return self::$consumer;
    }
    
    private function get_consumer_topic(): ConsumerTopic
    {
        $consumer = $this->get_consumer();
        $topicconf = $this->get_topic();
        $topic = $consumer->newTopic(self::KAFKA_TOPIC, $topicconf);
        $topic->consumeStart(0, RD_KAFKA_OFFSET_END);
        return $topic;
    }

    public function run($fn_onresponse): void
    {
        $topic = $this->get_consumer_topic();

        $i = 0;
        while (true) {
            $message = $topic->consume(0, self::REQUEST_SLEEP_TIME);
            $now = date("Y-m-d H:i:s");

            if (is_null($message)) {
                $message = "No more messages: $now";
                $this->logkafka($message,"kafkalogs 1");
                continue;
            }

            switch ($message->err) {
                case RD_KAFKA_RESP_ERR_NO_ERROR:
                    echo "RD_KAFKA_RESP_ERR_NO_ERROR ($now)\n";
                    if(is_callable($fn_onresponse)) call_user_func_array($fn_onresponse, [$message]);
                    $this->logkafka($message->payload,"RD_KAFKA_RESP_ERR_NO_ERROR saving in db ($i) $now");
                    break;
                case RD_KAFKA_RESP_ERR__PARTITION_EOF:
                    $this->logkafka("No more messages; will wait for more","kafkalogs 2 saving in db ($i) $now");
                    break;
                case RD_KAFKA_RESP_ERR__TIMED_OUT:
                    $this->logkafka("timeout","RD_KAFKA_RESP_ERR__TIMED_OUT: ($i) $now");
                    break;
                default:
                    $this->logkafka($message->errstr(),"Exception: ($i) $now");
                    throw new \Exception($message->errstr(), $message->err);
                    break;
            }
            $i++;
        }
    }//run    
}