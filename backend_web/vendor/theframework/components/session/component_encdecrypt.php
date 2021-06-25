<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.5.1
 * @name ComponentEncdecrypt
 * @file component_encdecrypt.php
 * @date 15-04-2017 10:04 (SPAIN)
 * @observations:
 * https://github.com/eacevedof/prj_theframework/blob/9192e1a90010792048a6383efbebbd85f105922a/the_application/components/appcomponent_encdecrypt.php
 * @requires:
 */
namespace TheFramework\Components\Session;

class ComponentEncdecrypt
{
    private $sType = "normal";
    private $iLenDirty = 5;
    private $arNumberConfig;
    private $arExcludeChars;

    private $sSslMethod;
    private $sSslKey;
    private $sSslIv;

    private $useSalt;
    private $sSalt;
    private $useTime;

    public function __construct($useSalt=TRUE)
    {
        $this->arExcludeChars = array();
        $this->arNumberConfig = array("0"=>"e","1"=>"F","2"=>"g","3"=>"H","4"=>"i"
        ,"5"=>"j","6"=>"K","7"=>"l","8"=>"m","9"=>"N");

        $this->sSslMethod = "AES-256-CBC";
        $this->sSslKey = "@11111111@";
        $this->sSslIv = "99326425";
        $this->useSalt = $useSalt;
        $this->sSalt = "@#$.salt.$#@";

        if(defined("ENV_SSLENC_METHOD")) $this->sSslMethod = ENV_SSLENC_METHOD;
        if(defined("ENV_SSLENC_KEY")) $this->sSslKey = ENV_SSLENC_KEY;
        if(defined("ENV_SSLENC_IV")) $this->sSslIv = ENV_SSLENC_IV;
        if(defined("ENV_MD5_SALT")) $this->sSalt = ENV_MD5_SALT;
    }

    private function salt_it(&$sString,$useSalt=NULL)
    {
        if($useSalt===NULL)
            $useSalt = $this->useSalt;

        if($useSalt)
        {
            $sString = "$this->sSalt.$sString";
        }
    }

    public function get_sslencrypted($sToEncrypt,$useSalt=NULL)
    {
        $sSslKey = $this->sSslKey;
        $this->salt_it($sSslKey,$useSalt);
        $sHashKey = hash("sha256",$sSslKey);
        $sHashIv = substr(hash("sha256",$this->sSslIv),0,16);
        //print_r(openssl_get_cipher_methods());
        //pr("toenc:$sToEncrypt,method:$this->sSslMethod,hashkey:$sHashKey,0,hashiv:$sHashIv");
        if($this->useTime) $sToEncrypt = $sToEncrypt."-".date("YmdHis");
        $sEncrypted = openssl_encrypt($sToEncrypt,$this->sSslMethod,$sHashKey,0,$sHashIv);
        $sEncrypted = base64_encode($sEncrypted);
        return $sEncrypted;
    }//get_sslencrypted

    public function get_ssldecrypted($sEncrypted,$useSalt=NULL)
    {
        $sSslKey = $this->sSslKey;
        $this->salt_it($sSslKey,$useSalt);
        $sHashKey = hash("sha256",$sSslKey);
        $sHashIv = substr(hash("sha256",$this->sSslIv),0,16);
        $sDecrypted = base64_decode($sEncrypted);
        $sDecrypted = openssl_decrypt($sDecrypted,$this->sSslMethod,$sHashKey,0,$sHashIv);
        if($this->useTime)
        {
            $sDecrypted = explode("-",$sDecrypted);
            return $sDecrypted[0];
        }
        return $sDecrypted;
    }//get_ssldecrypted

    public function get_md5password($sToEncrypt,$useSalt=NULL)
    {
        $this->salt_it($sToEncrypt,$useSalt);
        $sMd5 = md5($sToEncrypt);
        return $sMd5;
    }//get_md5password

    public function check_md5password($sPass,$sPassMd5,$useSalt=NULL)
    {
        $sMd5 = $this->get_md5password($sPass,$useSalt);
        return($sMd5===$sPassMd5);
    }//check_md5password

    public function get_hashpassword($sToEncrypt,$useSalt=NULL)
    {
        $this->salt_it($sToEncrypt,$useSalt);
        return password_hash($sToEncrypt,PASSWORD_DEFAULT);
    }//get_hashpassword

    public function check_hashpassword($sPass,$sPassHash,$useSalt=NULL)
    {
        $this->salt_it($sPass,$useSalt);
        //bug("saltpas:$this->sSalt$sPass,passhash:$sPassHash");
        return password_verify($sPass,$sPassHash);
    }//check_hashpassword

    public function get_rnd_word($iLen=8)
    {
        $iLen = $iLen-4;
        $arConsonants = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","y","z",
            "B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Y","Z"
        ];
        $arVocals = ["a","e","i","o","u","A","E","I","O","U"];
        $arChars = ["@","#","&","$"];
        $arNumbers = ["0","1","2","3","4","5","6","7","8","9"];

        $arWord = [];
        for($i=0;$i<$iLen;$i++)
        {
            if($i%2===0)
            {
                $iPos = array_rand($arConsonants,1);
                $arWord[] = $arConsonants[$iPos];
            }
            else
            {
                $iPos = array_rand($arVocals,1);
                $arWord[] = $arVocals[$iPos];
            }
        }

        $iPos = array_rand($arChars,1);
        $arWord[] = $arChars[$iPos];
        shuffle($arNumbers);
        for($i=0;$i<3;$i++)
        {
            $iPos = array_rand($arNumbers,1);
            $arWord[] = $arNumbers[$iPos];
        }
        return implode("",$arWord);
    }

    private function num_replace(&$sNumeric)
    {
        $arNumbers = array_keys($this->arNumberConfig);
        $arNums = str_split($sNumeric);
        foreach($arNums as $i=>$cNumber)
            if(in_array($cNumber,$arNumbers))
                $arNums[$i] = $this->arNumberConfig[$cNumber];
        $sNumeric=implode("",$arNums);
    }//num_replace

    private function num_reset(&$sLetters)
    {
        $arLetters = array_values($this->arNumberConfig);
        $arChars = str_split($sLetters);
        foreach($arChars as $i=>$cLetter)
            if(in_array($cLetter,$arLetters))
                $arChars[$i] = array_search($cLetter,$this->arNumberConfig);
        $sLetters=implode("",$arChars);
    }//num_replace

    private function get_random($iLenDirty=NULL)
    {
        if(!$iLenDirty) $iLenDirty = $this->iLenDirty;

        $arChars = str_split("abcdefghijklmnopqrstuvwxyz"
            ."ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            ."0123456789!@#$%^&*()");
        //quito los caracteres que no me interesan, por ejemplo %,$ para las urls
        if($this->arExcludeChars)
        {
            foreach($arChars as $i=>$cChar)
                if(in_array($cChar,$this->arExcludeChars))
                    unset($arChars[$i]);
        }

        shuffle($arChars);
        $sRandom = "";
        foreach(array_rand($arChars,$iLenDirty) as $iPos)
            $sRandom .= $arChars[$iPos];
        return $sRandom;
    }//get_random

    private function dirty($sString)
    {
        $sString = strrev($sString);
        $arChars = str_split($sString);
        $sDirty = array();
        foreach($arChars as $c)
        {
            $sDirty[] = $c;
            $sDirty[] = $this->get_random();
        }
        $sDirty = implode("",$sDirty);
        $sDirty = $this->get_random().$sDirty;
        return $sDirty;
    }//dirty

    private function dirty_number($sNumeric)
    {
        //cambio los numeros por letras segun arNumberConfig
        $this->num_replace($sNumeric);
        return $this->dirty($sNumeric);
    }//dirty_number

    private function clean($sString,$iLenDirty=NULL)
    {
        if(!$iLenDirty) $iLenDirty = $this->iLenDirty;
        $arChars = str_split($sString);
        $sCleaned = array();

        $iDirty = 0;
        $i=0;
        foreach($arChars as $c)
        {
            if($i==$iLenDirty)
            {
                $sCleaned[]=$c;
                $i=0;
            }
            else
                $i++;
        }
        $sCleaned = implode("",$sCleaned);
        $sCleaned = strrev($sCleaned);
        return $sCleaned;
    }//clean

    private function clean_number($sString,$iLenDirty=NULL)
    {
        //limpio los caracteres inventados
        $sCleaned = $this->clean($sString,$iLenDirty);
        $this->num_reset($sCleaned);
        return $sCleaned;
    }//clean_number    

    public function get_encrypted($sString)
    {
        $sReturn = "";
        switch($this->sType)
        {
            case "numeric":
                $sReturn = $this->dirty_number($sString);
                break;
            default://normal
                $sReturn = $this->dirty($sString);
                break;
        }
        return $sReturn;

    }//encrypt

    public function get_decrypted($sString)
    {
        $sReturn = "";
        switch($this->sType)
        {
            case "numeric":
                $sReturn = $this->clean_number($sString);
                break;
            default://normal
                $sReturn = $this->clean($sString);
                break;
        }
        return $sReturn;
    }//get_decrypted

    public function get_csrf($useSalt=NULL)
    {
        $sSessId = session_id();
        if($sSessId)
            $sSessId = $this->get_hashpassword($sSessId,$useSalt);

        return $sSessId;
    }//get_csrf

    public function get_uniqid($sToUnique,$inMd5=0)
    {
        if($inMd5)
            return md5(uniqid($sToUnique,TRUE));
        return uniqid($sToUnique,TRUE);
    }//get_uniqid

    public function get_salted($sPass){return "$this->sSalt$sPass";}

    public function set_type($sType){$this->sType=$sType;}
    public function set_lendirty($iLenDirty){$this->iLenDirty = $iLenDirty;}
    public function set_toexclude($mxChars)
    {
        if(is_string($mxChars))
            $this->arExcludeChars = str_split($mxChars);
        elseif(is_array($mxChars))
            $this->arExcludeChars = $mxChars;
        $this->arExcludeChars = array_unique($this->arExcludeChars);
    }

    public function add_toexclude($cChar)
    {
        $this->arExcludeChars[] = $cChar;
        $this->arExcludeChars = array_unique($this->arExcludeChars);
    }

    public function set_sslkey($value){$this->sSslKey = $value;}
    public function set_sslsalt($value){$this->sSalt = $value;}
    public function set_sslmethod($value){$this->sSslMethod = $value;}
    public function set_ssliv($iValue){$this->sSslIv = $iValue;}
    public function set_use_salt($isOn=TRUE){$this->useSalt=$isOn;}
    //se usa para añadir miga a los valores numericos de modo que siempre devuelva un hash distinto
    public function set_use_time($isOn=TRUE){$this->useTime=$isOn;}
}//ComponentEncdecrypt