<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\EncryptsController
 * @file Encrypt.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify;

use App\Controllers\AppController;
use App\Services\Apify\EncryptsService;

final class EncryptsController extends AppController
{

    public function __construct()
    {
        //captura trazas de la petición en los logs
        parent::__construct();
    }
    
    /**
     * ruta: <dominio>/apify/encrypts
     */
    public function index(): void
    {
        $service = new EncryptsService();
        $service->test();
        die;
        $oJson = new HelperJson();




        $idContext = $this->get_get("id_context");

        $oServ = new ContextService();
        if(!$oServ->is_context($idContext))
            $oJson->set_code(HelperJson::CODE_NOT_FOUND)
                ->set_error("context does not exist")
                ->show(1);

        $oServ = new DbsService($idContext);
        $arJson = $oServ->get_all();

        if($oServ->is_error())
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)
                ->set_error($oServ->get_errors())
                ->set_message("database error")
                ->show(1);

        $oJson->set_payload($arJson)->show();
    }//index

}//Encrypt
