<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\NotFoundController 
 * @file NotFoundController.php v1.0.0
 * @date 29-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Controllers;

use App\Controllers\AppController;

class NotFoundController extends AppController
{
    public function index()
    {
        $sPath = realpath(__DIR__."/../routes/routes.php");
        $arRutas = include $sPath;
        s("<pre>");
        foreach($arRutas as $arRuta)
            s("<a href=\"{$arRuta["url"]}\" target=\"_blank\">{$arRuta["url"]}</a><br/>");
    }

    public function error_404()
    {
        $this->logerr($_SERVER["REQUEST_URI"],"error-404");
        $this->show_json_nok("Resource not found",404);
    }    

}//NotFoundController
