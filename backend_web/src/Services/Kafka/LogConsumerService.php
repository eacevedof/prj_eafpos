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

use App\Factories\KafkaFactory;
use App\Traits\LogTrait;

final class LogConsumerService
{
    use LogTrait;

    private function save_into_db()
    {

    }

    public function __invoke($payload): void
    {
        echo "====consumer service===";
        print_r($payload);
    }

    public function run(): void
    {
        KafkaFactory::get_consumer()->run($this);
    }
}