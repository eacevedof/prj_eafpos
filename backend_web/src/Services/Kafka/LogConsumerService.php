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

        $sqls = [];
        foreach ($data as $message)
        {
            $sql = $this->_get_query()
                ->add_insert_fv("group_type", $message["type"])
                ->add_insert_fv("user_uuid", $message["useruuid"])
                ->add_insert_fv("title", $message["title"])
                ->add_insert_fv("message", $message["message"])
                ->add_insert_fv("timest", $message["timestamp"])
                ->add_insert_fv("code_cache", uniqid())
                ->autoinsert();
            $sql = $sql->get_sql();
            $sqls[] = $sql;
        }
        $sql = implode(";",$sqls).";";
        //$this->logkafka($sql,"to save in db");
        $pdo->exec($sql);
    }

    public function __invoke(array $kafkamessages): void
    {
        $parsed = [];
        foreach($kafkamessages as $message)
        {
            if ($message->timestamp === -1) continue;

            $data=[];
            $data["timestamp"] = $message->timestamp;
            $arjson = json_decode($message->payload,1);
            $data = array_merge($data, $arjson);
            $parsed[] = $data;
        }
        $this->_save($parsed);
    }

    public function run(): void
    {
        KafkaFactory::get_consumer()->run($this);
    }
}