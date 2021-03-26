<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\LogsController 
 * @file LogsController.php v1.0.0
 * @date 29-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Controllers;

use App\Controllers\AppController;

class LogsController extends AppController
{
    public function index()
    {
        $sType = "debug";
        if($this->is_get("type")) $sType = $this->get_get("type");
            
        //bug($sType);
        
        $sPathLogsDS = PATH_LOGS.DS.$sType.DS;
        if(!is_dir($sPathLogsDS))
            return pr("No folder $sPathLogsDS");
        
        $arLogs = scandir($sPathLogsDS);
        //bug($arLogs);
        unset($arLogs[0]);unset($arLogs[1]);
        
        if(!$arLogs)
            return pr("No log files in $sPathLogsDS");
        
        foreach($arLogs as $sLogfile)
        {
            $sPathFile = $sPathLogsDS.$sLogfile;
            $sContent = file_get_contents($sPathFile);
            pr($sContent,$sLogfile);
            
            if($this->get_get("delete")) unlink($sPathFile);
        }
    }
}//LogsController
