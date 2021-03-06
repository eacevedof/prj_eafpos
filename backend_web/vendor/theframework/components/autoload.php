<?php
//components autoload
//autoload.php 2.0.0
$sPathRoot = dirname(__FILE__).DIRECTORY_SEPARATOR;
//die("sPathRoot: $sPathRoot");//...tests\vendor\theframework\components
$arSubFolders[] = get_include_path();
$arSubFolders[] = $sPathRoot;//ruta de components
//subcarpetas dentro de components
$arSubFolders[] = $sPathRoot."console";
$arSubFolders[] = $sPathRoot."db";
$arSubFolders[] = $sPathRoot."session";
$arSubFolders[] = $sPathRoot."config";
$arSubFolders[] = $sPathRoot."formatter";
$arSubFolders[] = $sPathRoot."db".DIRECTORY_SEPARATOR."integration";
$arSubFolders[] = $sPathRoot."db".DIRECTORY_SEPARATOR."context";


$sPathInclude = implode(PATH_SEPARATOR,$arSubFolders);
set_include_path($sPathInclude);

spl_autoload_register(function($sNSClassName)
{
    //si existe la palabra TheFramework
    if(strstr($sNSClassName,"TheFramework"))
    {
        $arClass = explode("\\",$sNSClassName);
        $sClassName = end($arClass);
        //https://autohotkey.com/docs/misc/RegEx-QuickRef.htm
        // (?<=...) and (?<!...) are positive and negative look-behinds (respectively) 
        // because they look to the left of the current position rather than the right 
        $sClassName = preg_replace("/(?<!^)([A-Z])/","_\\1",$sClassName);
        
        if(!strstr($sClassName,"Component")) return;
        
        //print_r("classname:".$sClassName);
        if(strstr($sClassName,"Component"))
        {
            $sClassName = str_replace("Component","",$sClassName);
            $sClassName = strtolower($sClassName);
            //if(strstr($sClassName,"xp"))die($sClassName);
            $sClassName = "component$sClassName.php";
        }
        
        //print_r("\n classname include: $sClassName");
        if(stream_resolve_include_path($sClassName))
            include_once $sClassName;
        
        elseif(function_exists("lg"))
        {
            lg("Class not found: $sClassName");
        }
        elseif($isComp) 
        {
            echo "Class not found: $sClassName";
        }
    }
});//spl_autoload_register

