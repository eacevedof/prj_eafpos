<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use \Exception;
use TheFramework\Components\Formatter\ComponentMoment;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

class LoginService extends AppService
{
    private $domain = null;
    private $arlogin = null;
    /**
     * @var ComponentEncdecrypt
     */
    private $encdec = null;

    public function __construct($domain, $arlogin=[])
    {
        //necesito el dominio pq la encriptación va por dominio en el encdecrypt.json
        $this->domain = $domain;
        //el post con los datos de usuario
        $this->arlogin = $arlogin;
        $this->_load_encdec();
    }

    private function _get_encdec_config()
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        prd($sPathfile);
        //$this->logd($sPathfile,"pathfile");
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->domain);
        return $arconf;
    }

    private function _load_encdec()
    {
        $config = $this->_get_encdec_config();
        if(!$config) throw new \Exception("Domain {$this->domain} is not authorized 2");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    private function _get_login_config($domain="")
    {
        if(!$domain) $domain = $this->domain;
        $sPathfile = $_ENV["APP_LOGIN"] ?? __DIR__.DIRECTORY_SEPARATOR."login.json";
        $arconfig = (new ComponentConfig($sPathfile))->get_node("domain",$domain);
        return $arconfig;
    }

    private function _get_user_password($domain, $username)
    {
        $arconfig = $this->_get_login_config($domain);
        foreach($arconfig["users"] as $aruser)
            if($aruser["user"] === $username)
                return $aruser["password"] ?? "";

        return false;
    }

    private function _get_remote_ip(){return $_SERVER["REMOTE_ADDR"]  ?? "127.0.0.1";}

    private function _get_data_tokenized()
    {
        $username = $this->arlogin["user"] ?? "";
        $arpackage = [
            "salt0"    => date("Ymd-His"),
            "domain"   => $this->domain,
            "salt1"    => rand(0,3),
            "remoteip" => $this->_get_remote_ip(),
            "salt2"    => rand(4,8),
            "username" => $username,
            "salt3"    => rand(8,12),
            "password" => md5($this->_get_user_password($this->domain, $username)),
            "salt4"    => rand(12,15),
            "today"    => date("Ymd-His"),
        ];

        $instring = implode("|",$arpackage);
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_token()
    {
        $username = $this->arlogin["user"] ?? "";
        $password = $this->arlogin["password"] ?? "";
        if(!$username) throw new \Exception("No user provided");

        if(!$password) throw new \Exception("No password provided");

        $config = $this->_get_login_config();
        if(!$config) throw new \Exception("Source domain not authorized");

        $users = $config["users"] ?? [];
        foreach ($users as $user)
        {
            //$hashpass = $this->encdec->get_hashpassword($postpassw);
            //print_r($hashpass);die;
            if($user["user"] === $username && $this->encdec->check_hashpassword($password,$user["password"])) {
                return $this->_get_data_tokenized();
            }
        }
        throw new \Exception("Bad user or password");
    }

    private function _is_publicip()
    {
        $ip = $this->_get_remote_ip();
        $r = filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE |  FILTER_FLAG_NO_RES_RANGE
        );
        //$this->logd($r,"_is_publicip $ip");
        return $r;
    }

    private function validate_package($arpackage)
    {
        $this->logd($this->get_env(),"validate_package.ENV");
        //$this->logd($arpackage,"validate_package.arpaackage");
        if(count($arpackage)!==10) throw new Exception("Wrong token submitted (pieces)");

        list($s0,$domain,$s1,$remoteip,$s2,$username,$s3,$password,$s4,$date) = $arpackage;

        if($domain!==$this->domain) throw new Exception("Domain {$this->domain} is not authorized 1");

        //hago validacion en local por peticiones entre las ips de docker y mi maquina host que usan distitntas ips
        if (!$this->is_envlocal() && $remoteip !== $this->_get_remote_ip()) throw new Exception("Wrong source {$remoteip} in token");

        $md5pass = $this->_get_user_password($domain,$username);
        $md5pass = md5($md5pass);
        if($md5pass!==$password) throw new Exception("Wrong user or password submitted");

        list($day) = explode("-",$date);
        $now = date("Ymd");
        $moment = new ComponentMoment($day);
        $ndays = $moment->get_ndays($now);
        if($ndays>30)
            throw new Exception("Token has expired");
    }


    public function is_valid($token)
    {
        $instring = $this->encdec->get_ssldecrypted($token);
        //$this->logd($instring,"is_valid.instring of token $token");
        //print_r($instring);die;
        $arpackage = explode("|",$instring);
        $this->validate_package($arpackage);
        return true;
    }
}