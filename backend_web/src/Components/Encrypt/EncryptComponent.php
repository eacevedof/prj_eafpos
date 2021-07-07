<?php
namespace App\Components\Encrypt;
use \Exception;

final class EncryptComponent
{
    private const STEPS_MIN = 5;
    private const STEPS_MAX= 26;

    public const ALPHABET = [
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "0","1","2","3","4","5","6","7","8","9",
        ".","="," ",
        //" ",".", ",", ";", "%", "_", "-",">","<","=","(",")","'","\"","*","+","{","}",
        //"[","]",
        //"!","=","?","@","&","/","\\"
    ];

    private array $alphabet = [];

    public function __construct(array $alphabet = [])
    {
        $this->alphabet = $alphabet;
        if(!$alphabet) $this->alphabet = self::ALPHABET;
    }

    private function _get_pair(string $char, int $steps): string
    {
        if(!in_array($char, $alphabet = $this->alphabet)) return $char;

        $ilen = count($alphabet);
        $poschar = array_search($char, $alphabet);
        if(($total = $poschar+$steps) < $ilen) {
            return $alphabet[$total];
        }

        $mod = $total % $ilen;
        return $alphabet[$mod];
    }

    private function _limit_exception(int $steps): void
    {
        return;
        $ilen = count($this->alphabet);
        if($steps>self::STEPS_MAX || $steps<self::STEPS_MIN ||
            ($steps % $ilen === 0 && $steps>=$ilen)
        ) {
            throw Exception("steps {$steps} is not allowed.");
        }
    }


    public function get_encrypted(string $string, int $steps): string
    {
        if($string === "") return $string;
        $this->_limit_exception($steps);

        $chars = str_split($string);
        $result = [];
        foreach ($chars as $char)
            $result[] = $this->_get_pair($char, $steps);

        return implode("", $result);
    }

    private function _get_pair_reverse(string $char, int $steps): string
    {
        if(!in_array($char, $alphabet = $this->alphabet)) return $char;

        $ilen = count($alphabet);
        $poschar = array_search($char, $alphabet);
        if(($total = $poschar-$steps) > 0) {
            return $alphabet[$total];
        }

        $final = $steps % $ilen;
        $final = $poschar - $final;
        if($final<0) $final = $ilen + $final;
        return $alphabet[$final];
    }

    public function get_decrypted(string $string, int $steps): string
    {
        if($string === "") return $string;
        $this->_limit_exception($steps);
        $chars = str_split($string);

        $result = [];
        foreach ($chars as $char)
            $result[] = $this->_get_pair_reverse($char, $steps);

        return implode("", $result);
    }

}//EncryptsService