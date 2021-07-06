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
use App\Factories\EncryptFactory;

final class WriterController extends AppController
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
        $idcontext = $this->get_get("context");
        $dbalias = $this->get_get("schemainfo");
        //$arParts = $this->get_post("queryparts");
        $post = $this->get_post();
        $arParts = EncryptFactory::get()->get_decrypted($post);

        $action = $this->get_post("action");
        $arParts["useruuid"] = $this->get_post("useruuid");
        $table = $arParts["table"];

        $oJson = new HelperJson();
        try 
        {
            $oServ = new WriterService($idcontext, $dbalias, $table);
            $arJson = $oServ->set_action($action)->write($arParts);

            if ($oServ->is_error())
                $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)
                    ->set_error($oServ->get_errors())
                    ->set_message("database error")
                    ->show(1);

            if ($action == "insert")
                $oJson->set_code(HelperJson::CODE_CREATED)->set_message("resource created");
            elseif ($action == "update")
                $oJson->set_message("resource updated");
            elseif ($action == "delete")
                $oJson->set_message("resource deleted");
            elseif ($action == "deletelogic")
                $oJson->set_message("resource deleted *");

            $oJson->set_payload(["result" => $arJson, "lastid" => $oServ->get_lastinsert_id()])->show();
        }
        catch (\Exception $ex)
        {
            $this->logerr($ex->getMessage(),"writecontroller-exception");
            $oJson->set_code(HelperJson::CODE_BAD_REQUEST)
                ->set_error(["exception"])
                ->set_message($ex->getMessage())
                ->show();
        }
    }//index

    /**
     * /apify/write/raw?context=c&dbname=d
     */
    public function raw()
    {
        $idcontext = $this->get_get("context");
        $sDb = $this->get_get("dbname");
        $action = $this->get_post("action");
        $sSQL = $this->get_post("query");
        
        $oServ = new WriterService($idcontext,$sDb);
        $arJson = $oServ->write_raw($sSQL);

        $oJson = new HelperJson();
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        if($action=="insert") 
            $oJson->set_code(HelperJson::CODE_CREATED)->set_message("resource created");
        elseif($action=="update")
            $oJson->set_message("resource updated");
        elseif($action=="delete")
            $oJson->set_message("resource deleted");
        elseif($action=="deletelogic")
            $oJson->set_message("resource deleted *");

        $oJson->set_payload($arJson)->show();
    }//raw    
    
}//WriterController
