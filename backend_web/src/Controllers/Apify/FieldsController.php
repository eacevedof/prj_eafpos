<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\FieldsController 
 * @file FieldsController.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify;

use App\Services\Apify\ContextService;
use TheFramework\Helpers\HelperJson;
use App\Controllers\AppController;
use App\Services\Apify\FieldsService;

class FieldsController extends AppController
{
    
    public function __construct()
    {
        //captura trazas de la petición en los logs
        parent::__construct();
        $this->check_usertoken();
    }

    private function _get_database()
    {
        $oServ = new ContextService();
        $oJson = new HelperJson();

        $idContext = $this->get_get("id_context");
        if(!$oServ->is_context($idContext))
            $oJson->set_code(HelperJson::CODE_NOT_FOUND)->
            set_error("context does not exist")->
            show(1);

        //schemainfo puede ser un alias o un dbname
        $sDb = $this->get_get("schemainfo");

        //compruebo que sea una dbname
        $sDb2 = $oServ->is_db($idContext,$sDb);
        if($sDb2) return $sDb2;

        //aqui $sdb se trata como dbalias
        $sDb2 = $oServ->get_db($idContext,$sDb);
        if($sDb2) return $sDb2;

        $oJson->set_code(HelperJson::CODE_NOT_FOUND)->
        set_error("no database found in context 1")->
        show(1);
    }

    /**
     * /apify/fields/{id_context}/{schemainfo}/{tablename}/{fieldname}
     * /apify/fields/{id_context}/{schemainfo}/{tablename}
     * Muestra los schemas
     */
    public function index()
    {
        //si no hay db lanza un exit
        $sDb = $this->_get_database();

        $idContext = $this->get_get("id_context");
        $sTableName = $this->get_get("tablename");
        $sFieldName = $this->get_get("fieldname");

        $oServ = new FieldsService($idContext,$sDb,$sTableName,$sFieldName);
        if($sFieldName)
            $arJson = $oServ->get_field($sTableName,$sFieldName);
        else
            $arJson = $oServ->get_all($sTableName);

        $oJson = new HelperJson();
        if($oServ->is_error()) 
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)->
                    set_error($oServ->get_errors())->
                    set_message("database error")->
                    show(1);

        $oJson->set_payload($arJson)->show();
    }//index

}//FieldsController
