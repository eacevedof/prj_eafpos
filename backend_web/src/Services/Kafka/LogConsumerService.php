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
use PDO;
use TheFramework\Components\Db\Context\ComponentContext;
use RdKafka\Message;

final class LogConsumerService
{
    use LogTrait;

    private function _get_pdo(): ?PDO
    {
        $context = new ComponentContext($_ENV["APP_CONTEXTS"], "c1");
        return DbFactory::get_pdo_by_ctx($context, "db_eafpos_log");
    }

    private function _get_query(): ComponentCrud
    {
        $crud = new ComponentCrud();
        $crud->set_table("app_log");
        return $crud;
    }

    private function _save(?array $data): void
    {
        if(!$data) return;
        if(!$pdo = $this->_get_pdo())
        {
            $this->logerr("No pdo created");
            return;
        }
        $sql = $this->_get_query()
            ->add_insert_fv("group_type", $data["type"])
            ->add_insert_fv("title", $data["title"])
            ->add_insert_fv("message",$data["message"])
            ->add_insert_fv("timest", $data["timestamp"])
            ->add_insert_fv("code_cache",uniqid())
            ->autoinsert()
        ;
        $sql = $sql->get_sql();
        $pdo->exec($sql);
    }

    public function __invoke(Message $kafkamsg): void
    {
        $data["timestamp"] = $kafkamsg->timestamp;
        $arjson = json_decode($kafkamsg->payload,1);
        $data = array_merge($data,$arjson);
        $this->_save($data);
    }

    public function run(): void
    {
        KafkaFactory::get_consumer()->run($this);
    }
}