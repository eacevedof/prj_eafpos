<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link eduardoaf.com
 * @name App\Components\Kafka\ProducerComponent
 * @file KafkaProducerComponent.php 1.0.0
 * @date 21-06-2020 21:04 SPAIN
 * @observations
 */
namespace App\Components\Kafka;

use RdKafka\Conf;
use RdKafka\Producer;

final class ProducerComponent
{
    private const KAFKA_TOPIC = "queue-logs";
    private const REQUEST_SLEEP_TIME = 10;
    private const KAFKA_SOCKET = "kafka_kafka_1:9092";

    private function get_producer(): Producer
    {
        //https://github.com/eacevedof/prj_docker_imgs/blob/master/kafka/php/kafka/producer-2.php
        $CONFIG["callbacks"]["on_success"] = function ($kafka, $message) {
            file_put_contents(
                "./on_success.log",
                var_export($message, true), FILE_APPEND
            );
        };

        $CONFIG["callbacks"]["on_error"] = function ($kafka, $err, $reason) {
            file_put_contents(
                "./on_error.log",
                sprintf("Kafka error: %s (reason: %s)", rd_kafka_err2str($err), $reason) . PHP_EOL,
                FILE_APPEND
            );
        };

        $conf = new Conf();
        $conf->set("metadata.broker.list", self::KAFKA_SOCKET);
        $conf->setDrMsgCb($CONFIG["callbacks"]["on_success"]);
        $conf->setErrorCb($CONFIG["callbacks"]["on_error"]);

        $producer = new Producer($conf);
        return $producer;
    }

    private function get_json(array $data): string
    {
        return json_encode($data);
    }

    private function get_message($mxvar, string $title): array
    {
        $message = [
            "title" => $title
        ];

        if(is_string($mxvar) || is_numeric($mxvar)) {
            $message["message"] = $mxvar;
        }
        else {
            $message["message"] = var_export($mxvar,1);
        }

        return $message;
    }

    public function send($mxvar, string $title=""): void
    {
        $producer = $this->get_producer();
        $topic = $producer->newTopic(self::KAFKA_TOPIC);
        $message = $this->get_message($mxvar, $title);

        $json = $this->get_json($message);
        $topic->produce(RD_KAFKA_PARTITION_UA, 0, $json);

        for ($flushRetries = 0; $flushRetries < 3; $flushRetries++)
        {
            $result = $producer->flush(self::REQUEST_SLEEP_TIME);
            if (RD_KAFKA_RESP_ERR_NO_ERROR === $result) {
                break;
            }
        }

        if (RD_KAFKA_RESP_ERR_NO_ERROR !== $result)
        {
            return;
            //throw new \RuntimeException("Producer was unable to flush. Messages might be lost!\n");
        }
    }
}