<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Controllers\Apify\EncryptsController
 * @file Encrypt.php 1.0.0
 * @date 27-06-2019 18:17 SPAIN
 * @observations
 */
namespace App\Controllers\Apify\Security;

use App\Controllers\AppController;
use App\Factories\EncryptFactory;
use TheFramework\Helpers\HelperJson;

final class EncryptsController extends AppController
{
    public function __construct()
    {
        parent::__construct();
        $this->check_usertoken();
    }
    
    /**
     * ruta: <dominio>/apify/encrypts
     */
    public function index(): void
    {
        //$isvalid = (new LoginService($this->get_domain()))->is_valid($this->get_post(self::KEY_APIFYUSERTOKEN));
        $rule = EncryptFactory::get()->get_random_rule();
        (new HelperJson())->set_payload($rule)->show();
    }

}//Encrypt
