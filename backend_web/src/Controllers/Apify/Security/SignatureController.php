<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\SignatureController 
 * @file SignatureController.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify\Security;

use TheFramework\Helpers\HelperJson;
use App\Controllers\AppController;
use App\Services\Apify\Security\SignatureService;

class SignatureController extends AppController
{

    /**
     * ruta:
     *  <dominio>/apifiy/security/get-signature
     */
    public function index()
    {
        $oJson = new HelperJson();
        try{
            $domain = $this->get_domain(); //excepcion
            $oServ = new SignatureService($domain,$this->get_post());
            $token = $oServ->get_token();
            $oJson->set_payload(["result"=>$token])->show();
        }
        catch (\Exception $e)
        {
            $this->logerr($e->getMessage(),"SignatureController.index");
            $oJson->set_code(HelperJson::CODE_UNAUTHORIZED)->
            set_error([$e->getMessage()])->
            show(1);
        }

    }//index

    /**
     * ruta:
     *  <dominio>/apifiy/security/is-valid-signature
     */
    public function is_valid_signature()
    {
        $this->check_signature();
        (new HelperJson())->set_payload(["result"=>true])->show();
    }//index
    
}//SignatureController
