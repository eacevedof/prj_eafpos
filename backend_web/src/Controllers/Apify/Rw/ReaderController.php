<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\Rw\ReaderController 
 * @file ReaderController.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify\Rw;

use TheFramework\Helpers\HelperJson;
use App\Controllers\AppController;
use App\Services\Apify\Rw\ReaderService;
use App\Factories\EncryptFactory;

final class ReaderController extends AppController
{
    
    public function __construct()
    {
        //captura trazas de la petición en los logs
        parent::__construct();
        //excepcion en caso de error
        $this->check_usertoken();
    }

    /**
     * /apify/read?context=c&dbname=d
     */
    public function index(): void
    {
        $idContext = $this->get_get("context");
        $sDbalias = $this->get_get("schemainfo");
        //$arParts = $this->get_post("queryparts");
        $arParts = EncryptFactory::get()->get_decrypted($this->get_post());
        
        $oServ = new ReaderService($idContext, $sDbalias);
        $arJson = $oServ->get_read($arParts);
        $iNumrows = $oServ->get_foundrows($arParts);
        $this->logd($iNumrows,"NUM_ROWS");
        
        $oJson = new HelperJson();
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        $oJson->set_payload(["result"=>$arJson,"foundrows"=>$oServ->get_foundrows()])->show();

    }//index

    /**
     * /apify/read/raw?context=c&dbname=d
     */
    public function raw(): void
    {
        $idContext = $this->get_get("context");
        $sDb = $this->get_get("dbname");

        $sSQL = $this->get_post("query");
        $oServ = new ReaderService($idContext,$sDb);
        $oJson = new HelperJson();

        $arJson = $oServ->read_raw($sSQL);
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        $oJson->set_payload(["rows"=>$arJson,"numrows"=>$oServ->get_foundrows()])->show();
    }//raw
   

}//ReaderController
