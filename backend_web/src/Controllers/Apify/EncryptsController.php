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
use App\Factories\EncryptFactory;
use App\Services\Apify\Security\LoginService;
use TheFramework\Helpers\HelperJson;

final class EncryptsController extends AppController
{
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * ruta: <dominio>/apify/encrypts
     */
    public function index(): void
    {
        $isvalid = (new LoginService($this->get_domain()))->is_valid($this->get_post(self::KEY_APIFYUSERTOKEN));
        $oJson = new HelperJson();

        if(!$isvalid)
            $oJson->set_code(HelperJson::CODE_INTERNAL_SERVER_ERROR)
                ->set_error(["wrong token"])
                ->set_message("wrong token")
                ->show(1);

        $rule = EncryptFactory::get()->get_random_rule();
        $oJson->set_payload($rule)->show();
    }

}//Encrypt
