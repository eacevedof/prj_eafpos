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
    private const KAFKA_SOCKET = "php-eafpos-kafka:9092";

    public const TYPE_SQL = "sql";
    public const TYPE_DEBUG = "debug";
    public const TYPE_ERROR = "error";
    public const TYPE_KAFKA = "kafka";

    private static $producer;

    private function get_producer(): Producer
    {
        if(!self::$producer)
        {
            $pathkafka = PATH_LOGS.DS."kafka";
            //https://github.com/eacevedof/prj_docker_imgs/blob/master/kafka/php/kafka/producer-2.php
            $CONFIG["callbacks"]["on_success"] = function ($kafka, $message) use ($pathkafka) {
                @file_put_contents(
                    "$pathkafka/producer_success.log",
                    var_export($message, true), FILE_APPEND
                );
            };

            $CONFIG["callbacks"]["on_error"] = function ($kafka, $err, $reason) use($pathkafka) {
                @file_put_contents(
                    "$pathkafka/producer_error.log",
                    sprintf("Kafka error: %s (reason: %s)", rd_kafka_err2str($err), $reason) . PHP_EOL,
                    FILE_APPEND
                );
            };

            $conf = new Conf();
            $conf->set("metadata.broker.list", self::KAFKA_SOCKET);
            $conf->setDrMsgCb($CONFIG["callbacks"]["on_success"]);
            $conf->setErrorCb($CONFIG["callbacks"]["on_error"]);

            self::$producer = new Producer($conf);
        }
        return self::$producer;
    }

    private function get_json(array $data): string
    {
        return json_encode($data);
    }

    private function get_message($mxvar, string $title="", string $type=""): array
    {
        $message = [
            "type"  => $type,
            "title" => $title,
            "useruuid" => $_POST["useruuid"] ?? "-"
        ];

        if(is_string($mxvar) || is_numeric($mxvar)) {
            $message["message"] = $mxvar;
        }
        else {
            $message["message"] = var_export($mxvar,1);
        }

        return $message;
    }

    public function send($mxvar, string $title="", string $type=ProducerComponent::TYPE_DEBUG): void
    {
        $message = $this->get_message($mxvar, $title, $type);
        $json = $this->get_json($message);

        $producer = $this->get_producer();
        $topic = $producer->newTopic(self::KAFKA_TOPIC);
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