<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\Rw\WriterController 
 * @file WriterController.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify\Rw;

use TheFramework\Helpers\HelperJson;
use App\Controllers\AppController;
use App\Services\Apify\Rw\WriterService;

class WriterController extends AppController
{
    
    public function __construct()
    {
        //captura trazas de la petición en los logs
        parent::__construct();
        $this->check_usertoken();
    }
    
    /**
     * /apify/write/
     */
    public function index()
    {
        $idContext = $this->get_get("context");
        $sDbalias = $this->get_get("schemainfo");
        $arParts = $this->get_post("queryparts");
        $sAction = $this->get_post("action");
        
        $oServ = new WriterService($idContext,$sDbalias);
        $arJson = $oServ->set_action($sAction)->write($arParts);

        $oJson = new HelperJson();
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        if($sAction=="insert") 
            $oJson->set_code(HelperJson::CODE_CREATED)->set_message("resource created");
        elseif($sAction=="update")
            $oJson->set_message("resource updated");
        elseif($sAction=="delete")
            $oJson->set_message("resource deleted");
        elseif($sAction=="deletelogic")
            $oJson->set_message("resource deleted *");

        $oJson->set_payload(["result"=>$arJson,"lastid"=>$oServ->get_lastinsert_id()])->show();
    }//index

    /**
     * /apify/write/raw?context=c&dbname=d
     */
    public function raw()
    {
        $idContext = $this->get_get("context");
        $sDb = $this->get_get("dbname");
        $sAction = $this->get_post("action");
        $sSQL = $this->get_post("query");
        
        $oServ = new WriterService($idContext,$sDb);
        $arJson = $oServ->write_raw($sSQL);

        $oJson = new HelperJson();
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        if($sAction=="insert") 
            $oJson->set_code(HelperJson::CODE_CREATED)->set_message("resource created");
        elseif($sAction=="update")
            $oJson->set_message("resource updated");
        elseif($sAction=="delete")
            $oJson->set_message("resource deleted");
        elseif($sAction=="deletelogic")
            $oJson->set_message("resource deleted *");

        $oJson->set_payload($arJson)->show();
    }//raw    
    
}//WriterController
