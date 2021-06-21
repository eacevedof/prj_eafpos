<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Kafka\KafkaController 
 * @file KafkaController.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Kafka;

use App\Controllers\AppController;

class KafkaController extends AppController
{
    
    public function __construct()
    {
        //captura trazas de la petición en los logs
        parent::__construct();
    }
    
    /**
     * ruta:
     *  <dominio>/kafka/logs
     */
    public function logs()
    {
        $oServ = new ContextService();


    }//index
    
}//KafkaController
