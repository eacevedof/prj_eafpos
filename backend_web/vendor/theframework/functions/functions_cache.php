<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.0.0B
 * @file functions_cache.php 
 * @date 25-11-2016 05:02 (SPAIN)
 * @observations: Utils
 *  load:11
 * @requires
 */
//pr("functions_cache.php 1.0.0");
//comprueba si una url es cacheable segun una configuracion de rutas cacheables
function tfw_iscacheable($sUrl)
{
    $arExclude = ["adminpannel",".gif",".png",".jpg","?s","contact","blog","ico","error"];
    foreach($arExclude as $sEx)
        if(strstr($sUrl,$sEx))
            return FALSE;
    return TRUE;
}

function tfw_iscached($sUrl)
{
    if(defined("TFW_IS_CACHE"))
    {
        //si se debe recuperar de cache
        if(TFW_IS_CACHE==1)
        {
            $sFileName = str_replace("/","-",$sUrl);
            $sFileName.=".html";
            $sFileName = TFW_PATH_FOLDER_CACHEDS.$sFileName;
            return ["path_file"=>$sFileName,"is_file"=>is_file($sFileName)];
        }
    }
    return ["path_file"=>NULL,"is_file"=>NULL];
}

function tfw_cachesave()
{
    if(TFW_IS_CACHE==1)
    {
        $sUrl = $_SERVER["REQUEST_URI"];
        if(tfw_iscacheable($sUrl))
        {
            $arCached = tfw_iscached($sUrl);
            if(!$arCached["is_file"] && $arCached["path_file"])
            {    
                $sPathFile = $arCached["path_file"];
                $oFile = fopen($sPathFile,"w");
                $sDateNow = date("YmdHis");
                $sFileContent = "<!--cache:$sDateNow-->\n";
                $sFileContent .= ob_get_contents();
                $sFileContent .= "<!--cache:$sDateNow-->";
                fwrite($oFile,$sFileContent);
                fclose($oFile);
            }//nofile
        }//iscacheable
    }//iscache
}

function tfw_loadcached()
{
    if(TFW_IS_CACHE==1)
    {
        $sUrl = $_SERVER["REQUEST_URI"];
        if(tfw_iscacheable($sUrl))
        {        
            $arCached = tfw_iscached($sUrl);
            if($arCached["is_file"])
            {
                include($arCached["path_file"]);
                exit();
            }
        }
    }
}