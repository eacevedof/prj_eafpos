<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.3.0
 * @name functions_string
 * @file functions_string.php 
 * @date 14-01-2017 11:06 (SPAIN)
 * @observations: String functions
 *  load:13
 * @requires
 */
function sep_to_camel($sSeparated,$sMark="_")
{
    $sCamelCased = "";
    $sSeparated = trim(strtolower($sSeparated));
    $arStrings = explode($sMark,$sSeparated);
    
    foreach($arStrings as $sString)
        $sCamelCased .= ucfirst($sString);
    
    return $sCamelCased;
}

function camel_to_sep($sCamelCased,$sSeparator="_")
{
    //separa en caracters
    $arChars = str_split($sCamelCased);
    $iNumChars = count($arChars);
    for($iCharPos=0; $iCharPos<$iNumChars; $iCharPos++)
    {
        $cPrevChar = NULL;
        $cChar = $arChars[$iCharPos];
        if(isset($arChars[$iCharPos-1]))$cPrevChar = $arChars[$iCharPos-1];
        //TODO TESTING: PROBAR ESTO.. con is_numeric me resuelve el campo txtPhone1, pero si este se llamará txtPhone12 me
        //crearia un campo phone_1_2. Se ha solucionado con el "or"
        //["hidRowChanged_1_0"]=>["row_changed___0___0"]
        if(ctype_upper($cChar)||(is_numeric($cChar)&&!is_numeric($cPrevChar)&&$cPrevChar!="_"))
            $sCamelCased = str_replace($cChar,$sSeparator.strtolower($cChar),$sCamelCased);
    }
    
    if($sCamelCased[0]=="_") $sCamelCased = substr($sCamelCased,1);
    return $sCamelCased;
}

function get_firstchar($sString)
{
    if(is_string($sString))
        return $sString[0]; 
    return NULL;
}

function get_lastchar($sString)
{
    if(is_string($sString))
        //return $sString[strlen($sString)-1]; 
        return substr($sString,-1);
    return NULL;
}

function is_firstchar($sString,$sChar){return (get_firstchar($sString)==$sChar);}
function is_lastchar($sString,$sChar){return (get_lastchar($sString)==$sChar);}

function isall_substrings($arSubstrings,$sString)
{
    foreach($arSubstrings as $sValue)
        if(!strstr($sString,$sValue))
            return FALSE;
    return TRUE;
}

function in_string($sSearch,$sString,$isRegex=0)
{
    if($isRegex)
        return (preg_match("/$sSearch/",$sString)==1);
    return strstr($sString,$sSearch);
}

function isone_substring($arSubstrings,$sString)
{
    foreach($arSubstrings as $sValue)
        if(strstr($sString,$sValue))
            return TRUE;
    return FALSE;
}

function remove_chars($mxFind,&$sString)
{
    if(is_array($mxFind))
    {
        foreach($mxFind as $c)
            $sString=str_replace($mxFind,"",$sString);
    }
    else
    {
        $sString=str_replace($mxFind,"",$sString);
    }
}

function remove_firstchar(&$sString){$sString=substr($sString,1);}
function remove_lastchar(&$sString){$sString=substr($sString,0,-1);}