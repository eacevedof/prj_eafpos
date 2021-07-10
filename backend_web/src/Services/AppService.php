<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\AppService 
 * @file AppService.php 1.0.0
 * @date 29-11-2018 19:00 SPAIN
 * @observations
 * @tags: #apify
 */
namespace App\Services;

use App\Traits\ErrorTrait;
use App\Traits\LogTrait;
use App\Traits\EnvTrait;
use \Exception;

abstract class AppService
{
    use ErrorTrait;
    use LogTrait;
    use EnvTrait;

    public function __construct(){;}
 
    public function trim(&$arPost)
    {
        foreach($arPost as $sKey=>$sValue)
            $arPost[$sKey] = trim($sValue);
    }

    protected function _exeption(string $message, int $code=500): void
    {
        $this->logerr($message,"app-service.exception");
        throw new Exception($message, $code);
    }
}//AppService
