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
    private array $alphabet = [
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","x","y","z",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Y","Z",
        "0","1","2","3","4","5","6","7","8","9"
    ];

    private array $numbers = [

    ];

    private function get_rnd_alphabet(): string
    {

    }

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
        $STEPS = 18;
        $MENSAJE_ORIG = "Hola MunDO cruel";
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
