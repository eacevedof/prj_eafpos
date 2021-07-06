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
        $alphabet = EncryptComponent::ALPHABET;
        shuffle($alphabet);
        $ilen = count($alphabet)*(15/100);
        $imin = ceil($ilen);

        $ilen = count($alphabet)*(75/100);
        $imax = ceil($ilen);

        $steps = random_int($imin, $imax);

        $key = uniqid();
        $encrypt = [
            "alphabet" => $alphabet,
            "steps" => $steps,
            "key" => $key,
        ];

        RedisFactory::get()->set("encrypt-$key",json_encode($encrypt));
        return $encrypt;
    }

    public function get_decrypted(array $post): array
    {
        $enckey = $post["apify_enckey"];

        $json = RedisFactory::get()->get_($enckey);
        $encrypt = json_decode($json, 1);
        list($alphabet, $steps, $key) = $encrypt;
        $encrypt = new EncryptComponent($alphabet);
        $queryparts = $post["queryparts"];
        $decrypted = [];
        foreach ($queryparts as $key => $value)
        {
            $key = $encrypt->get_decrypted($key, $steps);
            $value = $encrypt->get_decrypted($value, $steps);
            $decrypted[$key] = $value;
        }

        return $decrypted;
    }

    public function test()
    {
        $STEPS = 10;
        $MENSAJE_ORIG = "Hola MunDO cruel";
        //$MENSAJE_ORIG = "Hola ";
        //$MENSAJE_ORIG = "A x";
        //$MENSAJE_ORIG = "Hola Mundo";
        //$MENSAJE_ORIG = " ";

        echo $MENSAJE_ORIG;
        echo "\n<br/>";
        $alphabet = EncryptComponent::ALPHABET;
        shuffle($alphabet);
        $o = new EncryptComponent($alphabet);
        $msg = $o->get_encrypted($MENSAJE_ORIG, $STEPS);
        print_r($msg);
        echo "\n<br/>";
        $msg = $o->get_decrypted($msg, $STEPS);
        print_r($msg);
    }

}//EncryptsService
