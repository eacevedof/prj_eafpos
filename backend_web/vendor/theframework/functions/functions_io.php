<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.2.0
 * @file functions_io.php 
 * @date 21-11-2016 10:49 (SPAIN)
 * @observations: funciones para imprimir por pantalla
 *  load:10
 * @requires
 */
function timer_on() 
{
    global $fStartTime;
    list($fMiliSec, $fSec) = explode(" ", microtime());
    $fStartTime = ((float)$fSec + (float)$fMiliSec);
}
 
function timer_off($asDebug=true, $sTitulo="",$isDie=true) 
{
    global $fStartTime;
    list($fMiliSec, $fSec) = explode(" ", microtime());
    $fEndTime = ((float)$fSec + (float)$fMiliSec);
    $fEndTime = $fEndTime-$fStartTime;
    if($asDebug)
        return bug($fEndTime." seg","tiempo ejecución $sTitulo",$isDie);
    else
        return $fEndTime;
}

function mssqlclean($sString,$isNumeric=0)
{
    $mxReturn = trim($sString);
    if($isNumeric)
    {
        //quito las comillas, dobles y simples
        $mxReturn = str_replace("'","",$mxReturn);
        $mxReturn = str_replace("\"","",$mxReturn);
        if($mxReturn=="")
            $mxReturn="NULL";
    }
    //string
    else 
    {
        $mxReturn = str_replace("'","''",$mxReturn);
    }        
    return $mxReturn;
}

function mysqlclean($sString,$isNumeric=0)
{
    $mxReturn = trim($sString);
    if($isNumeric)
    {
        //quito las comillas, dobles y simples
        $mxReturn = str_replace("'","",$mxReturn);
        $mxReturn = str_replace("\"","",$mxReturn);
        if($mxReturn=="")
            $mxReturn="NULL";
    }
    //string
    else 
    {
        $mxReturn = str_replace("\\","\\\\",$mxReturn);
        $mxReturn = str_replace("'","\'",$mxReturn);
    }        
    return $mxReturn;    
}

function userdate_to_crmdate($sUserDate,$cSeparator="/")
{
    $arDate = array(); 
    $arDate = explode($cSeparator,$sUserDate);
    return $arDate[2].$arDate[1].$arDate[0];
}

function crmdate_to_userdate($sCrmDate,$iLen=8,$cSeparator="/")
{
    $sDate = "";
    $sYear = substr($sCrmDate,0,4);
    $sMonth = substr($sCrmDate,4,2);
    $sDay = substr($sCrmDate,6,2);
    $sDate = "$sDay$cSeparator$sMonth$cSeparator$sYear";
    if($iLen==12 || $iLen==14)
    {
        $sHour = substr($sCrmDate,8,2);
        $sMin = substr($sCrmDate,10,2);
    }    
    if($iLen==14) $sSec = substr($sCrmDate,12,2);
    if($iLen==12) $sDate .= " $sHour:$sMin";
    if($iLen==14) $sDate .= " $sHour:$sMin:$sSec";
    return $sDate;
}

function usertime_to_crmtime($sUserTime,$iTime=4)
{
    $sCrmTime = "";
    $arTime4 = explode(":",$sUserTime);
    $sHour = sprintf("%02d",$arTime4[0]);
    $sMin = sprintf("%02d",$arTime4[1]);
    $sCrmTime = "$sHour$sMin";
    if($iTime==6)
    {
        $sSec = sprintf("%02d",$arTime4[2]);
        $sCrmTime.=$sSec;
    }
    return $sCrmTime;
}

function crmtime_to_usertime($sCrmTime,$iTime=4)
{
    $sUserTime = "";
    $sHour = substr($sCrmTime,0,2);
    $sMin = substr($sCrmTime,2,2);
    $sUserTime = "$sHour:$sMin";
    if($iTime==6)
    {
        $sSec = substr($sCrmTime,4,2);
        $sUserTime .= ":$sSec";
    }
    return $sUserTime;
}

function clean_before_save_db(&$arData)
{
    array_walk_recursive($arData,"clean_array_text_values");
}

function clean_array_text_values(&$mxValue,$mxKey)
{
    if (!is_array($mxValue))
    {
        //bug($mxValue,"antes de limpiar");
        $mxValue = clean_for_db($mxValue);
        //bug($mxValue,"despues de limpiar");
    }
} 

function clean_for_db($sText)
{
    //Si ya viene escapadas las comilas quito las barras de escape
    //para que quede en texto plano
    if(get_magic_quotes_gpc())
    {
        $sText = str_replace("\'","'",$sText);
        $sText = str_replace("\\\"","\"",$sText);
    }
    //$sText = stripslashes ($sText);
    //Pasa los caracteres de entidades html conflictivos:
    //comillas, mayor, menor y barra invertida
    //a texto simple
    $sText = htmlentities_to_plain_text($sText);
    //se escapan las comillas, solo las simples
    //$sText = addslashes($sText); en mssql no se escapa con \
    $sText = str_replace("'","''",$sText);
    //se escapan las barras invertidas
    //$sText = str_replace("\\","\\\\",$sText);
    return $sText;
}

function htmlentities_to_plain_text($sText)
{
    //	&#92; \
    $sText = str_replace("&#039;","'",$sText);
    $sText = str_replace("&gt;",">",$sText);
    $sText = str_replace("&quot;","\"",$sText);   
    $sText = str_replace("&lt;","<",$sText);
    $sText = str_replace("&#92;","\\",$sText);
    return $sText;
}

function clean_for_html($sPlainText)
{
    //bug($sDbText); en mssql no se guarda con slashes como en mysql en lugar de slashes se
    //utiliza ' . El sqlinjection solo se podria aplicar con este tipo de comillas no con las dobles.
    //$sHtmlText = stripslashes($sDbText);
    $sHtmlText = str_replace("<","&lt;",$sPlainText);
    $sHtmlText = str_replace(">","&gt;",$sHtmlText);
    $sHtmlText = str_replace("\"","&quot;",$sHtmlText);
    $sHtmlText = str_replace("'","&#039;",$sHtmlText);
    //esto evitaria que se cree un html como value="absbdf\" con lo cual se escaparia el último "
    $sHtmlText = str_replace("\\","&#92;",$sHtmlText);
    return $sHtmlText;
}

function get_tr($sConstantName){return @constant($sConstantName);}
function tr($sConstantName){echo get_tr($sConstantName);}
function preopen(){echo "<pre>\n";}
function preclose(){echo "</pre>\n";}
//ojo tambien está en functions_debug
function s($sString){if(!is_string($sString)) $sString = var_export($sString,1);echo $sString;}