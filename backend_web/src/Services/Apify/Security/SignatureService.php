<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use Matrix\Exception;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

class SignatureService extends AppService
{
    private $domain = null;
    private $data = null;
    /**
     * @var ComponentEncdecrypt
     */
    private $encdec = null;

    public function __construct($domain,$data)
    {
        $this->domain = $domain;
        $this->data = $data;
        $this->_load_encdec();
    }

    private function _get_encdec_config()
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->domain);
        return $arconf;
    }

    private function _load_encdec()
    {
        $config = $this->_get_encdec_config($this->domain);
        if(!$config) throw new \Exception("Domain {$this->domain} is not authorized");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    public function get_token()
    {
        $data = var_export($this->data,1);
        $package = [
            "domain"   => $this->domain,
            "remoteip" => $this->_get_remote_ip(),
            "hash"     => md5($data),
            "today"    => date("Ymd"),
        ];

        $instring = implode("-",$package);
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_password()
    {
        $word = $this->data["word"] ?? ":)";
        $password = $this->encdec->get_hashpassword($word);
        return $password;
    }

    private function _get_remote_ip(){return $_SERVER["REMOTE_ADDR"] ?? "127.0.0.1";}

    private function validate_package($arpackage)
    {
        $data = var_export($this->data,1);

        if(!$arpackage) throw new Exception("Wrong token submitted");

        if($arpackage[0]!==$this->domain) throw new Exception("Domain {$this->domain} not Authorized");

        if($arpackage[1]!==$this->_get_remote_ip()) throw new Exception("Wrong source {$arpackage[0]} in token");

        $md5 = md5($data);
        if($arpackage[2]!==$md5) throw new Exception("Wrong hash submitted");

        if($arpackage[3]!==date("Ymd")) throw new Exception("token has expired");
    }

    public function is_valid($token)
    {
        $instring = $this->encdec->get_ssldecrypted($token);
        $package = explode("-",$instring);
        //esto lanza expecipones
        $this->validate_package($package);
        return true;
    }
}