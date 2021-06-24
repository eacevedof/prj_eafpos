<?php
//index.php 3.0.0
const DS = DIRECTORY_SEPARATOR;
const DOCROOT = __DIR__;

$sPath = realpath(DOCROOT.DS."../src");
define("PATH_SRC",$sPath);
$sPath = realpath(DOCROOT.DS."../public");
define("PATH_PUBLIC",$sPath);
$sPath = realpath(DOCROOT.DS."../vendor");
define("PATH_VENDOR",$sPath);
$sPath = realpath(DOCROOT.DS."../logs");
define("PATH_LOGS",$sPath);
$sPath = realpath(DOCROOT.DS."../boot");
define("PATH_BOOT",$sPath);
$pathenv = realpath(DOCROOT.DS."../.env");

include_once PATH_BOOT.DS."functions.php";
//autoload de composer
include_once "../vendor/autoload.php";
//arranque de mis utilidades
include_once "../vendor/theframework/bootstrap.php";

console_loadenv($pathenv);

$env = getenv("APP_ENV");
if($env==="prod-xxx")
{
    $sToday = date("Ymd");
    ini_set("display_errors",0);
    ini_set("log_errors",1);
    ini_set("error_log",PATH_LOGS."/sys_$sToday.log");
}

$isCLI = (php_sapi_name() == "cli");
if($isCLI)
{
    $ar_arg = get_console_args($argv);

    if(isset($ar_arg["class"]))
    {
        $classname = $ar_arg["class"];
        $classname = str_replace(".","\\",$classname);
        try {
            $instance = new $classname();

            if(!$ar_arg["method"]) $ar_arg["method"] = "run";

            $method = $ar_arg["method"];
            $oRflecMethod = new \ReflectionMethod($classname, $method);

            $arMethArgs = [];
            foreach($oRflecMethod->getParameters() as $oParam)
            {
                if(isset($ar_arg[$oParam->getName()]))
                    $arMethArgs[] =  $ar_arg[$oParam->getName()];
                else
                    $arMethArgs[] =  $oParam->getDefaultValue();
            }

            $mxR = $oRflecMethod->invokeArgs($instance, $arMethArgs);
        }
        catch (\Exception $e) {
            echo "error:\n\t{$e->getMessage()}\n\n";
        }
    }
    else
    {
        echo "no parameter --class\n";
    }
}// is cli
else
    echo "";