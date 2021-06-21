<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link eduardoaf.com
 * @name App\Services\Kafka\KafkaReducerService
 * @file KafkaReducerService.php 1.0.0
 * @date 21-06-2020 20:52 SPAIN
 * @observations
 */
namespace App\Services\Kafka;

use App\Traits\LogTrait;
use \RdKafka\Conf;
use \RdKafka\Consumer;
use \RdKafka\TopicConf;
use \RdKafka\ConsumerTopic;

final class KafkaLogsService extends KafkaService
{
    use LogTrait;

    private const KAFKA_TOPIC = "";
    private const REQUEST_SLEEP_TIME = 12 * 1000;
    private const KAFKA_SOCKET = "192.168.1.1:800";

    private function get_consumer_topic(): ConsumerTopic
    {
        $conf = new Conf();
        $conf->set("bootstrap.servers", self::KAFKA_SOCKET);
        $conf->set("group.id", "test-consumer-group");

        $consumer = new Consumer($conf);

        $topicConf = new TopicConf();
        $topicConf->set("request.required.acks", 1);
        $topicConf->set("auto.commit.enable", 0);
        $topicConf->set("auto.commit.interval.ms", 100);
        $topicConf->set("offset.store.method", "broker");

        $topic = $consumer->newTopic(self::KAFKA_TOPIC, $topicConf);
        $topic->consumeStart(0, RD_KAFKA_OFFSET_END);
        return $topic;
    }

    private function save_into_db()
    {

    }

    public function run(): void
    {
        $topic = $this->get_consumer_topic();

        $i = 0;
        while (true) {
            $message = $topic->consume(0, self::REQUEST_SLEEP_TIME);
            $now = date("Y-m-d H:i:s");

            if (is_null($message)) {
                $message = "No more messages: $now";
                $this->logd($message,"kafkalogs 1");
                continue;
            }

            switch ($message->err) {
                case RD_KAFKA_RESP_ERR_NO_ERROR:
                    echo "RD_KAFKA_RESP_ERR_NO_ERROR\n";
                    $this->logd($message->payload,"kafkalogs 2 saving in db ($i) $now");
                break;
                case RD_KAFKA_RESP_ERR__PARTITION_EOF:
                    $this->logd("No more messages; will wait for more","kafkalogs 2 saving in db ($i) $now");
                break;
                case RD_KAFKA_RESP_ERR__TIMED_OUT:
                    $this->logerr("timeout","kafkalogs 3 ($i) $now");
                break;
                default:
                    $this->logerr($message->errstr(),"kafkalogs 4 ($i) $now");
                    throw new \Exception($message->errstr(), $message->err);
                break;
            }
            $i++;
        }
    }//run

}