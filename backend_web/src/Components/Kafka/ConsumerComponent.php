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

    private const KAFKA_NUM_PARTITION = 0;
    private const KAFKA_TOPIC = "queue-logs";
    private const KAFKA_SOCKET = "php-eafpos-kafka:9092";
    private const REQUEST_WAIT_TIME = 15 * 1000;
    private const KAFKA_BATCH_SIZE = 10;

    private static $consumer;

    private function _get_consumer_config(): Conf
    {
        $conf = new Conf();
        $conf->set("bootstrap.servers", self::KAFKA_SOCKET);
        $conf->set("group.id", "test-consumer-group");
        return $conf;        
    }
    
    private function _get_topic(): TopicConf
    {
        $topicconf = new TopicConf();
        $topicconf->set("request.required.acks", 1);
        $topicconf->set("auto.commit.enable", 0);
        $topicconf->set("auto.commit.interval.ms", 1000);
        $topicconf->set("offset.store.method", "broker");
        return $topicconf;
    }
    
    private function _get_consumer(): Consumer
    {
        if(!self::$consumer) {
            $config = $this->_get_consumer_config();
            $consumer = new Consumer($config);
            self::$consumer = $consumer;
        }
        return self::$consumer;
    }
    
    private function _get_consumer_topic(): ConsumerTopic
    {
        $consumer = $this->_get_consumer();
        $topicconf = $this->_get_topic();
        $topic = $consumer->newTopic(self::KAFKA_TOPIC, $topicconf);
        $topic->consumeStart(self::KAFKA_NUM_PARTITION, RD_KAFKA_OFFSET_END);
        return $topic;
    }

    public function run($fn_onresponse): void
    {
        $now = date("Y-m-d H:i:s");
        echo "start consumer-component at - $now\n";
        $topic = $this->_get_consumer_topic();

        $i = 0;
        while (true)
        {
            //ConsumerTopic::consumeBatch ( integer $partition , integer $timeout_ms , integer $batch_size ) : array
            $messages = $topic->consumeBatch(self::KAFKA_NUM_PARTITION, self::REQUEST_WAIT_TIME, self::REQUEST_WAIT_TIME);
            $now = date("Y-m-d H:i:s");

            if (is_null($messages)) {
                $message = "No more messages: $now";
                $this->logkafka($message,"kafkalogs 1");
                continue;
            }

            switch ($messages->err) {
                case RD_KAFKA_RESP_ERR_NO_ERROR:
                    echo "RD_KAFKA_RESP_ERR_NO_ERROR ($now)\n";
                    if(is_callable($fn_onresponse) && $messages) call_user_func_array($fn_onresponse, [$messages]);
                    $this->logkafka($messages,"RD_KAFKA_RESP_ERR_NO_ERROR possible saving if not empty ($i) $now");
                    break;
                case RD_KAFKA_RESP_ERR__PARTITION_EOF:
                    $this->logkafka("No more messages; will wait for more","kafkalogs 2 saving in db ($i) $now");
                    break;
                case RD_KAFKA_RESP_ERR__TIMED_OUT:
                    $this->logkafka("timeout","RD_KAFKA_RESP_ERR__TIMED_OUT: ($i) $now");
                    break;
                default:
                    $this->logkafka($messages->errstr(),"Exception: ($i) $now");
                    throw new \Exception($messages->errstr(), $messages->err);
                    break;
            }
            $i++;
        }
    }//run

}