<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Traits\KafkaLogTrait
 * @file KafkaLogTrait.php 1.0.0
 * @date 01-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Traits;

use App\Components\Kafka\ProducerComponent;

trait KafkaLogTrait
{
    protected function log($mxVar,$sTitle=NULL)
    {
        $oLog = new ProducerComponent();
        $oLog->save($mxVar, $sTitle, ProducerComponent::TYPE_SQL);
    }
    
    protected function logd($mxVar,$sTitle=NULL)
    {
        $oLog = new ProducerComponent();
        $oLog->save($mxVar, $sTitle, ProducerComponent::TYPE_DEBUG);
    }

    protected function logerr($mxVar,$sTitle=NULL)
    {
        $oLog = new ProducerComponent();
        $oLog->save($mxVar, $sTitle, ProducerComponent::TYPE_ERROR);
    }

    protected function logkafka($mxVar,$sTitle=NULL)
    {
        $oLog = new ProducerComponent();
        $oLog->save($mxVar, $sTitle, ProducerComponent::TYPE_KAFKA);
    }

}//KafkaLogTrait
