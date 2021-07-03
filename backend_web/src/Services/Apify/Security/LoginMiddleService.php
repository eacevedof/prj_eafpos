<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

final class LoginMiddleService extends AppService
{
    private const POST_USER_KEY = "apify-user";
    private const POST_PASSWORD_KEY = "apify-password";

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

    private function _get_encdec_config(): array
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->origin);
        return $arconf;
    }

    private function _load_encdec(): void
    {
        $config = $this->_get_encdec_config();
        //$this->logd($config,"_load_encdec");
        if(!$config) throw new \Exception("domain {$this->origin} is not authorized 2 by middle");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    private function _get_login_config($hostname=""): array
    {
        if(!$hostname) $hostname = $this->origin;
        $sPathfile = $_ENV["APP_LOGIN"] ?? __DIR__.DIRECTORY_SEPARATOR."pos-login.json";
        $arconfig = (new ComponentConfig($sPathfile))->get_node("domain",$hostname);
        return $arconfig;
    }

    private function _get_user_password($hostname, $username): string
    {
        $arconfig = $this->_get_login_config($hostname);
        foreach($arconfig["users"] as $aruser)
            if($aruser["user"] === $username)
                return $aruser[self::POST_PASSWORD_KEY] ?? "";

        return "";
    }

    private function _get_remote_ip(): string {return $this->post["remoteip"] ?? "";}

    private function _get_user_agent(): string {return $this->post["useragent"] ?? ":)"; }

    private function _get_data_tokenized(): string
    {
        $username = $this->post[self::POST_USER_KEY];
        $arpackage = [
            "salt0"    => date("Ymd-His"),
            "domain"   => $this->domain,
            "salt1"    => rand(0,3),
            "remoteip" => $this->_get_remote_ip(),
            "salt2"    => rand(3,7),
            "useragent" => md5($this->_get_user_agent()),
            "salt3"    => rand(7,11),
            "username" => $username,
            "salt4"    => rand(11,15),
            "password" => md5($this->_get_user_password($this->domain, $username)),
            "salt5"    => rand(15,19),
            "today"    => date("Ymd-His"),
        ];

        $instring = implode("|",$arpackage);
        $this->logd($instring,"instring");
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_token(): string
    {
        if(!$this->origin) throw new \Exception("No origin domain provided");
        $username = $this->post[self::POST_USER_KEY] ?? "";
        if(!$username) throw new \Exception("No user provided");

        $password = $this->post[self::POST_PASSWORD_KEY] ?? "";
        if(!$password) throw new \Exception("No password provided");

        $remoteip = $this->post["remoteip"] ?? "";
        if(!$remoteip) throw new \Exception("No remote ip provided");

        $config = $this->_get_login_config();
        if(!$config) throw new \Exception("Source hostname not authorized");

        $users = $config["users"] ?? [];
        foreach ($users as $user)
        {
            if($user["apifyuser"] === $username &&
                $this->encdec->check_hashpassword($password, $user["apifypassword"])
            )
            {
                return $this->_get_data_tokenized();
            }
        }
        throw new \Exception("Bad user or password");
    }
}