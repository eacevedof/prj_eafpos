<?php
//index.php 3.0.0
define("DS",DIRECTORY_SEPARATOR);
define("DOCROOT",__DIR__);//con $_SERVER[DOCUMENT_ROOT] y PWD no va
$sPath = realpath(DOCROOT.DS."../src");
define("PATH_SRC",$sPath);
$sPath = realpath(DOCROOT.DS."../public");
define("PATH_PUBLIC",$sPath);
$sPath = realpath(DOCROOT.DS."../vendor");
define("PATH_VENDOR",$sPath);
$sPath = realpath(DOCROOT.DS."../logs");
define("PATH_LOGS",$sPath);

$envcontent = file_get_contents(DOCROOT.DS."../.env");
$envcontent = explode(PHP_EOL, $envcontent);
foreach ($envcontent as $env)
{
    if($env[0] === "#" || trim($env)==="") continue;
    $parts = explode("=",$env);
    $key = trim($parts[0]);
    array_shift($parts);
    $value = implode("=",$parts);
    $value = trim($value);

    putenv(sprintf("%s=%s", $key, $value));
    $_ENV[$key] = $value;
    $_SERVER[$key] = $value;
}

//echo(PATH_SRC);die;
//$arConfig = realpath(PATH_SRC_CONFIG.DS."config.php");
//include($arConfig);

//DOCUMENT_ROOT:es la carpeta public
//echo $_SERVER["DOCUMENT_ROOT"];die;
//si se está en producción se desactivan los mensajes en el navegador
$env = getenv("APP_ENV");
if($env==="prod")
{
    $sToday = date("Ymd");
    ini_set("display_errors",0);
    ini_set("log_errors",1);
    //Define where do you want the log to go, syslog or a file of your liking with
    ini_set("error_log","{$_SERVER["DOCUMENT_ROOT"]}/../src/logs/sys_$sToday.log"); // or ini_set("error_log", "/path/to/syslog/file")
}

//autoload de composer
include_once '../vendor/autoload.php';
//arranque de mis utilidades
include_once '../vendor/theframework/bootstrap.php';

function arguments($argv) {
    $_ARG = array();
    foreach ($argv as $arg_i) 
    {
        if (preg_match("/--([^=]+)=(.*)/",$arg_i,$arKeyVal)) {
            $_ARG[$arKeyVal[1]] = $arKeyVal[2];
        } 
        elseif(preg_match("/-([a-zA-Z0-9])/",$arg_i,$arKeyVal)) {
            $_ARG[$arKeyVal[1]] = "true";
        }
    }
    return $_ARG;
}

$isCLI = (php_sapi_name() == "cli");
if($isCLI)
{
    //print_r($argv);
    $ar_arg = arguments($argv);
    //print_r($ar_arg);
    if(isset($ar_arg["class"]))
    {
        $classname = $ar_arg["class"];
        $classname = str_replace(".","\\",$classname);
        $instance = new $classname();
        
        if(isset($ar_arg["method"]))
        {
            $method = $ar_arg["method"];
            $oRflecMethod = new \ReflectionMethod($classname, $method);
            
            //print_r($oRflecMethod->getParameters());
            $arMethArgs = [];
            foreach($oRflecMethod->getParameters() as $oParam)
            {
                if(isset($ar_arg[$oParam->getName()]))
                    $arMethArgs[] =  $ar_arg[$oParam->getName()];
                else 
                    $arMethArgs[] =  $oParam->getDefaultValue();
            }
            
            //var_dump($oRflecMethod->getParameters());
            //$o->{$method}();
            $mxR = $oRflecMethod->invokeArgs($instance, $arMethArgs);
            print_r($mxR);
        }// is method
    }// is class
}// is cli
else
    echo "";