<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use \Exception;
use TheFramework\Components\Formatter\ComponentMoment;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

final class LoginService extends AppService
{
    private const POST_USER_KEY = "apify-user";
    private const POST_PASSWORD_KEY = "apify-password";

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

    private function _get_encdec_config(): array
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->domain);
        return $arconf;
    }

    private function _load_encdec(): void
    {
        $config = $this->_get_encdec_config();
        if(!$config) throw new \Exception("Domain {$this->domain} is not authorized 2");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    private function _get_login_config(string $domain=""): array
    {
        if(!$domain) $domain = $this->domain;
        $sPathfile = $_ENV["APP_LOGIN"] ?? __DIR__.DIRECTORY_SEPARATOR."pos-login.json";
        $arconfig = (new ComponentConfig($sPathfile))->get_node("domain",$domain);
        return $arconfig;
    }

    private function _get_user_password(string $domain, string $username): string
    {
        $arconfig = $this->_get_login_config($domain);
        foreach($arconfig["users"] as $aruser)
            if($aruser[self::POST_USER_KEY] === $username)
                return $aruser[self::POST_PASSWORD_KEY] ?? "";

        return "";
    }

    private function _get_remote_ip(): string {return $_SERVER["REMOTE_ADDR"]  ?? "127.0.0.1";}

    private function _get_user_agent(): string {return $_SERVER["HTTP_USER_AGENT"] ?? ":)"; }

    private function _get_data_tokenized(): string
    {
        $username = $this->arlogin[self::POST_USER_KEY] ?? "";
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
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_token(): string
    {
        $username = $this->arlogin[self::POST_USER_KEY] ?? "";
        if(!$username) throw new \Exception("No user provided");

        $password = $this->arlogin[self::POST_PASSWORD_KEY] ?? "";
        if(!$password) throw new \Exception("No password provided");

        $config = $this->_get_login_config();
        if(!$config) throw new \Exception("Source domain not authorized");

        $users = $config["users"] ?? [];
        foreach ($users as $user)
        {
            if($user["apifyuser"] === $username && $this->encdec->check_hashpassword($password, $user["apifypassword"])) {
                return $this->_get_data_tokenized();
            }
        }
        throw new \Exception("Bad user or password");
    }

    private function _validate_package($arpackage): void
    {
        if(count($arpackage)!==12) throw new Exception("Wrong token submitted (pieces)");

        list($s0,$domain,$s1,$remoteip,$s2,$useragent,$s3,$username,$s4,$password,$s5,$date) = $arpackage;

        if($domain!==$this->domain) throw new Exception("Domain {$this->domain} is not authorized 1");

        //hago validacion en local por peticiones entre las ips de docker y mi maquina host que usan distitntas ips
        if (!$this->is_envlocal() && $remoteip !== $this->_get_remote_ip())
            throw new Exception("Wrong source {$remoteip} in token");

        if($useragent !== md5($this->_get_user_agent())) throw new Exception("Wrong user agent");

        $md5pass = $this->_get_user_password($domain, $username);
        $md5pass = md5($md5pass);
        if($md5pass!==$password) throw new Exception("Wrong user or password submitted");

        list($day) = explode("-",$date);
        $now = date("Ymd");
        $moment = new ComponentMoment($day);
        $ndays = $moment->get_ndays($now);
        if($ndays>30)
            throw new Exception("Token has expired");
    }

    public function is_valid(?string $token): bool
    {
        if(!$token) return false;

        $instring = $this->encdec->get_ssldecrypted($token);
        $arpackage = explode("|",$instring);
        $this->_validate_package($arpackage);
        return true;
    }
}