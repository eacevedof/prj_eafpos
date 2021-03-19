<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

class LoginMiddleService extends AppService
{
    private $origin = null;
    private $post = [];
    /**
     * @var ComponentEncdecrypt
     */
    private $encdec = null;

    public function __construct($post=[])
    {
        //el post con los datos de usuario
        $this->post = $post;
        //necesito el dominio pq la encriptación va por dominio en el encdecrypt.json
        $this->origin = $this->post["remotehost"] ?? "";
        $this->_load_encdec();
    }

    private function _get_encdec_config()
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        //$this->logd($sPathfile,"pathfile");
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->origin);
        return $arconf;
    }

    private function _load_encdec()
    {
        $config = $this->_get_encdec_config();
        //$this->logd($config,"_load_encdec");
        if(!$config) throw new \Exception("domain {$this->origin} is not authorized 2 by middle");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    private function _get_login_config($hostname="")
    {
        if(!$hostname) $hostname = $this->origin;
        $sPathfile = $_ENV["APP_LOGIN"] ?? __DIR__.DIRECTORY_SEPARATOR."login.json";
        $arconfig = (new ComponentConfig($sPathfile))->get_node("domain",$hostname);
        return $arconfig;
    }

    private function _get_user_password($hostname, $username)
    {
        $arconfig = $this->_get_login_config($hostname);
        foreach($arconfig["users"] as $aruser)
            if($aruser["user"] === $username)
                return $aruser["password"] ?? "";

        return false;
    }

    private function _get_remote_ip(){return $this->post["remoteip"];}

    private function _get_data_tokenized()
    {
        $username = $this->post["user"];
        $arpackage = [
            "salt0"    => date("Ymd-His"),
            "domain" => $this->origin, //nombre de la maquina que hace la petición suele ser *
            "salt1"    => rand(0,3),
            "remoteip" => $this->_get_remote_ip(), //viene por post
            "salt2"    => rand(4,8),
            "username" => $username,
            "salt3"    => rand(8,12),
            "password" => md5($this->_get_user_password($this->origin, $username)),
            "salt4"    => rand(12,15),
            "today"    => date("Ymd-His"),
        ];

        $instring = implode("|",$arpackage);
        $this->logd($instring,"instring");
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_token()
    {
        if(!$this->origin) throw new \Exception("No origin domain provided");
        $username = $this->post["user"] ?? "";
        $password = $this->post["password"] ?? "";
        $remoteip = $this->post["remoteip"] ?? "";

        if(!$remoteip) throw new \Exception("No remote ip provided");
        if(!$username) throw new \Exception("No user provided");
        if(!$password) throw new \Exception("No password provided");
        $config = $this->_get_login_config();
        if(!$config) throw new \Exception("Source hostname not authorized");

        $users = $config["users"] ?? [];
        foreach ($users as $user)
        {
            if($user["user"] === $username && $this->encdec->check_hashpassword($password,$user["password"])) {
                return $this->_get_data_tokenized();
            }
        }
        throw new \Exception("Bad user or password");
    }
}