<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\EncryptsService
 * @file EncryptsService.php 1.1.0
 * @date 02-07-2019 17:55 SPAIN
 * @observations
 */
namespace App\Services\Apify;

use App\Factories\RedisFactory;
use App\Components\Encrypt\EncryptComponent;

final class EncryptsService 
{
      public function get_rules(): array
    {
        //get alphabet
        //get steps
    }

    public function get_decrypted(array $post): array
    {

    }

    public function test()
    {
        $STEPS = 10;
        $MENSAJE_ORIG = "Hola MunDO cruel";
        $MENSAJE_ORIG = "Hola ";
        $MENSAJE_ORIG = "A x";

        echo $MENSAJE_ORIG;
        echo "\n<br/>";
        $o = new EncryptComponent();
        $msg = $o->get_encrypted($MENSAJE_ORIG, $STEPS);
        print_r($msg);
        echo "\n<br/>";
        $msg = $o->get_decrypted($msg, $STEPS);
        print_r($msg);
    }

}//EncryptsService
