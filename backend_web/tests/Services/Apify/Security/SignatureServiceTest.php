<?php
// en: /<project>/backend 
// ./vendor/bin/phpunit --bootstrap ./vendor/theframework/bootstrap.php ./tests/Services/Apify/Security/SignatureServiceTest.php --color=auto
// ./vendor/bin/phpunit --bootstrap ./vendor/theframework/bootstrap.php ./tests
use PHPUnit\Framework\TestCase;
use TheFramework\Components\ComponentLog;
use App\Services\Apify\Security\SignatureService;

$pathappboot = realpath(__DIR__ . "/../../../../boot/appbootstrap.php");
include_once($pathappboot);

class SignatureServiceTest extends TestCase
{

    private function log($mxVar,$sTitle=NULL)
    {
        $oLog = new ComponentLog("logs",__DIR__);
        $oLog->save($mxVar,$sTitle);
    }
    
    public function test_get_token()
    {
        $post=["user"=>"fulanito","password"=>"menganito"];
        $oServ = new SignatureService("localhost:200",$post);
        $token = $oServ->get_token();
        $this->assertIsString($token);
    }

    /**
     * @depends test_get_token
     */
    public function test_is_valid()
    {
        $post=["user"=>"fulanito","password"=>"menganito"];
        $oServ = new SignatureService("localhost:200",$post);
        $token = $oServ->get_token();
        $r = $oServ->is_valid($token);
        $this->assertEquals(true,$r);
    }

    /**
     * @depends test_get_token
     * @expectedException \Exception
     * @expectedExceptionMessage Wrong hash submitted
     */
    public function test_is_invalid()
    {
        $post=["user"=>"fulanito","password"=>"menganito"];
        $oServ = new SignatureService("localhost:200",$post);
        $token = $oServ->get_token();

        $post=["user"=>"fulanito","password"=>"menganito","injected"=>"some injected"];
        $oServ = new SignatureService("localhost:200",$post);
        $r = $oServ->is_valid($token);
        //$this->expectException("\Exception"); //no va
        //$this->expectException("Matrix\Exception"); //no va
        //$this->expectExceptionMessage("Wrong hash submitted"); //no va
    }

    /**
     * @expectedException \Exception
     */
    public function test_domain_not_configured()
    {
        $post=["user"=>"fulanito","password"=>"menganito"];
        $oServ = new SignatureService("nonexistentdomain.com",$post);
        $token = $oServ->get_token();
    }
    
}//SignatureServiceTest