<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Traits\LogTrait
 * @file LogTrait.php 1.0.0
 * @date 01-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Traits;

use TheFramework\Components\ComponentLog;

trait LogTrait
{
    protected function log($mxVar,$sTitle=NULL): void
    {
        $oLog = new ComponentLog("sql",PATH_LOGS);
        $oLog->save($mxVar,$sTitle);
    }

    protected function logreq($mxVar, $sTitle=NULL): void
    {
        $oLog = new ComponentLog("request",PATH_LOGS);
        $oLog->save($mxVar, $sTitle);
    }

    protected function logd($mxVar,$sTitle=NULL): void
    {
        $oLog = new ComponentLog("debug",PATH_LOGS);
        $oLog->save($mxVar,$sTitle);
    }

    protected function logerr($mxVar,$sTitle=NULL): void
    {
        $oLog = new ComponentLog("error",PATH_LOGS);
        $oLog->save($mxVar,$sTitle);
    }

    protected function logkafka($mxVar,$sTitle=NULL): void
    {
        $oLog = new ComponentLog("kafka",PATH_LOGS);
        $oLog->save($mxVar,$sTitle);
    }
    
}//LogTrait
