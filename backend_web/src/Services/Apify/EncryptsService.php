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
use App\Traits\LogTrait;
use \Exception;

final class EncryptsService 
{
    use LogTrait;
    private const APIFY_ENCKEY = "apify-enckey";
    private const APIFY_ENCKEY_TTL = 35; //segundos

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

        RedisFactory::get()->set("encrypt-$key", json_encode($encrypt),self::APIFY_ENCKEY_TTL);
        return $encrypt;
    }

    public function get_decrypted(array $post): array
    {
        if(!$enckey = $post[self::APIFY_ENCKEY]) return $post["queryparts"] ?? [];

        $json = RedisFactory::get()->get("encrypt-$enckey");
        if (!$json) throw new \Exception("enckey not found", 404);
        $encrypt = json_decode($json, 1);
        extract($encrypt);

        $encrypt = new EncryptComponent($alphabet);
        if(!$queryparts = $post["queryparts"]) throw new Exception("missing queryparts");

        $decrypted = [];
        $isfieldkv = in_array($action = $post["action"], ["insert", "update", "deletelogic"]);
        foreach ($queryparts as $key => $value)
        {
            $key = $encrypt->get_decrypted($key, $steps);
            if(is_string($value))
            {
                $value = $encrypt->get_decrypted($value, $steps);
                $decrypted[$key] = $value;
            }
            elseif (is_array($value))
            {
                $isfields = $key === "fields";
                foreach ($value as $k => $v)
                {
                    //limit no va por accion
                    if(($isfieldkv && $isfields) || ($key==="limit" && $action==="select"))
                        $k = $encrypt->get_decrypted($k, $steps);
                    $v = $encrypt->get_decrypted($v, $steps);
                    $decrypted[$key][$k] = $v;
                }
            }
        }//foreach queryparts

        $this->logreq($decrypted, "encrypts-service.get_decrypted");
        return $decrypted;
    }

}//EncryptsService
