<?php
namespace App\Services\Apify\Security;
use App\Services\AppService;
use Matrix\Exception;
use TheFramework\Components\Config\ComponentConfig;
use TheFramework\Components\Session\ComponentEncdecrypt;

final class SignatureService extends AppService
{
    private const POST_KEY_WORD = "word";
    private $domain;
    private $data;
    /**
     * @var ComponentEncdecrypt
     */
    private $encdec = null;

    public function __construct(string $domain, array $data)
    {
        $this->domain = $domain;
        $this->data = $data;
        $this->_load_encdec();
    }

    private function _get_encdec_config(): array
    {
        $sPathfile = $this->get_env("APP_ENCDECRYPT") ?? __DIR__.DIRECTORY_SEPARATOR."encdecrypt.json";
        //prd($sPathfile);
        $arconf = (new ComponentConfig($sPathfile))->get_node("domain",$this->domain);
        return $arconf;
    }

    private function _load_encdec(): void
    {
        $config = $this->_get_encdec_config($this->domain);
        if(!$config) throw new \Exception("Domain {$this->domain} is not authorized");

        $this->encdec = new ComponentEncdecrypt(1);
        $this->encdec->set_sslmethod($config["sslenc_method"]??"");
        $this->encdec->set_sslkey($config["sslenc_key"]??"");
        $this->encdec->set_sslsalt($config["sslsalt"]??"");
    }

    public function get_token(): string
    {
        $data = var_export($this->data,1);
        $package = [
            "domain"   => $this->domain,
            "remoteip" => $this->_get_remote_ip(),
            "useragent" => md5($this->_get_user_agent()),
            "hash"     => md5($data),
            "today"    => date("Ymd"),
        ];

        $instring = implode("-",$package);
        $token = $this->encdec->get_sslencrypted($instring);
        return $token;
    }

    public function get_password(): string
    {
        $word = $this->data[self::POST_KEY_WORD] ?? ":)";
        $password = $this->encdec->get_hashpassword($word);
        return $password;
    }

    private function _get_remote_ip(): string {return $_SERVER["REMOTE_ADDR"] ?? "127.0.0.1";}

    private function _get_user_agent(): string {return $_SERVER["HTTP_USER_AGENT"] ?? ":)"; }

    private function _validate_package(array $arpackage): void
    {
        if(!$arpackage) throw new Exception("Signature wrong token submitted");

        if($arpackage[0]!==$this->domain) throw new Exception("Signature domain {$this->domain} not authorized");

        if($arpackage[1]!==$this->_get_remote_ip()) throw new Exception("Signature wrong source {$arpackage[0]} in token");

        if($arpackage[2]!==md5($this->_get_user_agent())) throw new Exception("Signature wrong user agent in token");

        $data = var_export($this->data,1);
        $md5 = md5($data);
        if($arpackage[3]!==$md5) throw new Exception("Signature wrong hash submitted");

        if($arpackage[4]!==date("Ymd")) throw new Exception("Signature wrong token has expired");
    }

    public function is_valid(?string $token): bool
    {
        if(!$token) return false;
        $instring = $this->encdec->get_ssldecrypted($token);
        $package = explode("-",$instring);
        //esto lanza expecipones
        $this->_validate_package($package);
        return true;
    }
}