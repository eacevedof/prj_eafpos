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

use App\Factories\DbFactory;
use App\Factories\KafkaFactory;
use App\Traits\LogTrait;
use TheFramework\Components\Db\ComponentCrud;
use TheFramework\Components\Db\ComponentMysql;
use TheFramework\Components\Db\Context\ComponentContext;
use RdKafka\Message;

final class LogConsumerService
{
    use LogTrait;

    private function get_db(): ComponentMysql
    {
        $context = new ComponentContext($_ENV["APP_CONTEXTS"], "c1");
        return DbFactory::get_dbobject_by_ctx($context, "db_eafpos_log");
    }

    private function get_query(): ComponentCrud
    {
        $crud = new ComponentCrud();
        $crud->set_table("app_log");
    }

    private function save(array $data): void
    {
        $sql = $this->get_query()
            ->add_insert_fv("group_type", $data["debug"])
            ->add_insert_fv("title", $data["title"])
            ->add_insert_fv("message",$data["message"])
            ->add_insert_fv("timest", $data["timestamp"])
        ;
        $this->get_db()->query($sql->get_sql());
    }

    public function __invoke(Message $kafkamsg): void
    {
        $data["timestamp"] = $kafkamsg->timestamp;
        $arjson = json_decode($kafkamsg->payload,1);
        $data = array_merge($data,$arjson);
        print_r($data);
        $this->save($data);
    }

    public function run(): void
    {
        KafkaFactory::get_consumer()->run($this);
    }
}