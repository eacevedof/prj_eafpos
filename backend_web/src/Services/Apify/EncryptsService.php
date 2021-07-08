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
use \Exception;

final class EncryptsService 
{
    private const APIFY_ENCKEY = "apify-enckey";

    public function get_random_rule(): array
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

        RedisFactory::get()->set("encrypt-$key",json_encode($encrypt),60);
        return $encrypt;
    }

    public function get_decrypted(array $post): array
    {
        if(!$enckey = $post[self::APIFY_ENCKEY]) throw new Exception("missing apify_enckey");
        $json = RedisFactory::get()->get_("encrypt-$enckey");
        $encrypt = json_decode($json, 1);
        extract($encrypt);

        $encrypt = new EncryptComponent($alphabet);
        if(!$queryparts = $post["queryparts"]) throw new Exception("missing queryparts");

        $decrypted = [];
        $isfieldkv = in_array($post["action"],["insert","update","deletelogic"]);
        foreach ($queryparts as $key => $value)
        {
            $key = $encrypt->get_decrypted($key, $steps);
            if(is_string($value)){
                $value = $encrypt->get_decrypted($value, $steps);
                $decrypted[$key] = $value;
            }
            elseif (is_array($value)) {
                $isfields = $key === "fields";
                foreach ($value as $k => $v)
                {
                    if($isfieldkv && $isfields) $k = $encrypt->get_decrypted($k, $steps);
                    $v = $encrypt->get_decrypted($v, $steps);
                    $decrypted[$key][$k] = $v;
                }
            }
        }

        return $decrypted;
    }

}//EncryptsService
