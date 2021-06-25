<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.2.1
 * @name functions_format
 * @file functions_format.php 
 * @date 18-02-2017 19:52 (SPAIN)
 * @observations: Common functions
 *  load:12
 */

function two_positions($sValue){return sprintf("%02d",$sValue);}

//============================================
//       DATABASE TO BACKOFFICE FORMAT
//============================================
/**
 * DbDate Puede ser date,datetime
 * @param string $sDbDate yyyymmddxxxx
 * @param string $sSeparator Default -
 * @return string dd-mm-yyyy
 */

//dt: datetime. Sirve para limpiar el formato datetime de mysql
function dt_clean($sDate)
{
    //2015-12-28 12:32:12
    $sDate = str_replace("-","",$sDate);
    $sDate = str_replace(":","",$sDate);
    $sDate = str_replace(" ","",$sDate);
    $sDate = trim($sDate);
    return $sDate;
}//dt_clean

function dbbo_date($sDbDate,$sSeparator="-")
{
    $sBoDate = "";
    //0123 45 67
    if(strlen($sDbDate)>7 )
    {    
        if(!is_numeric($sDbDate))
            //2015-12-28 12:32:12
            $sDbDate = dt_clean($sDbDate);
        
        $sYear = substr($sDbDate,0,4);
        $sMonth = substr($sDbDate,4,2);
        $sDay = substr($sDbDate,6,2);

        $sMonth = two_positions($sMonth);
        $sDay = two_positions($sDay);

        $sBoDate = "$sDay$sSeparator$sMonth$sSeparator$sYear";        
    }
    return $sBoDate;
}

function dbbo_datetime4($sDbDate,$sSeparator="-")
{
    $sBoDateTime4 = "";
    //0123 45 67 80 11 22
    if(strlen($sDbDate)>11 && is_numeric($sDbDate))
    {    
        $sYear = substr($sDbDate,0,4);
        $sMonth = substr($sDbDate,4,2);
        $sDay = substr($sDbDate,6,2);
        
        $sMonth = two_positions($sMonth);
        $sDay = two_positions($sDay);
        
        $sH = substr($sDbDate,8,2);
        $sM = substr($sDbDate,10,2);
        //$sS = substr($sDbDate,12,2);
        $sH = two_positions($sH);
        $sM = two_positions($sM);

        $sBoDateTime4 = "$sDay$sSeparator$sMonth$sSeparator$sYear $sH:$sM";
    }
    return $sBoDateTime4;
}

function dbbo_datetime6($sDbDate,$sSeparator="-")
{
    $sBoDateTime4 = "";
    //0123 45 67 80 11 22
    if(strlen($sDbDate)>11 && is_numeric($sDbDate))
    {    
        $sYear = substr($sDbDate,0,4);
        $sMonth = substr($sDbDate,4,2);
        $sDay = substr($sDbDate,6,2);
        
        $sMonth = two_positions($sMonth);
        $sDay = two_positions($sDay);
        
        $sH = substr($sDbDate,8,2);
        $sM = substr($sDbDate,10,2);
        $sS = substr($sDbDate,12,2);
        
        $sH = two_positions($sH);
        $sM = two_positions($sM);
        $sS = two_positions($sS);
        $sBoDateTime4 = "$sDay$sSeparator$sMonth$sSeparator$sYear $sH:$sM:$sS";
    }
    return $sBoDateTime4;
}

function dbbo_time4($sDbDate)
{
    $sTime4 = "";
    //0123 45 67 80 11 22
    $iLen = strlen($sDbDate);
    if($iLen && is_numeric($sDbDate))
    {
        //datetime yyyymmddhhmmss
        if($iLen>8)
        {
            $sH = substr($sDbDate,8,2);
            $sM = substr($sDbDate,10,2);
            //$sS = substr($sDbDate,12,2);
        }
        //time sec hhmm ó hh:mm:ss
        elseif($iLen>3 )
        {
            $sH = substr($sDbDate,0,2);
            $sM = substr($sDbDate,2,2);
        }
        $sH = two_positions($sH);
        $sM = two_positions($sM);
        //$sS = two_positions($sS);        
        $sTime4 = "$sH:$sM";  
    }
    return $sTime4;
}

function dbbo_time6($sDbDate)
{
    $sTime6 = "";
    //0123 45 67 80 11 22
    $iLen = strlen($sDbDate);
    if($iLen && is_numeric($sDbDate))
    {
        //datetime yyyymmddhhmmss
        if($iLen>12)
        {
            $sH = substr($sDbDate,8,2);
            $sM = substr($sDbDate,10,2);
            $sS = substr($sDbDate,12,2);
        }
        //time sec hhmmss
        elseif($iLen>4)
        {
            $sH = substr($sDbDate,0,2);
            $sM = substr($sDbDate,2,2);
            $sS = substr($sDbDate,4,2);
        }
        $sH = two_positions($sH);
        $sM = two_positions($sM);
        $sS = two_positions($sS);
        $sTime6 = "$sH:$sM:$sS";  
    }
    return $sTime6;
}

function dbbo_int($sValue,$dec=".",$thou=",")
{
    $int = 0;
    if(is_numeric($sValue))
    {
        $int = number_format($sValue,0,$dec,$thou);
    }
    return $int;
}

function dbbo_numeric2($sValue,$dec=".",$thou="")
{
    $numeric2 = 0.00;
    if(!is_null($sValue))
        $numeric2 = number_format($sValue,2,$dec,$thou);
    return $numeric2;
}

//============================================
//       BACKOFFICE TO DATABASE FORMAT
//============================================
function bodb_numeric2($sValue,$dec=".",$thou="")
{
    $numeric2 = 0.00;
    if(!is_null($sValue))
        $numeric2 = number_format($sValue,2,$dec,$thou);
    return $numeric2;
}


//boDate puede ser dd-mm-yyyy hh:mm ó dd-mm-yyyy hh:mm:ss
function bodb_date($sBoDate,$sSeparator="-")
{
    $sDbDate = "";
    $sBoDate = trim($sBoDate);
    $iLen = strlen($sBoDate);
    if(strstr($sBoDate,"/")) $sSeparator="/";
    //dd-mm-yyy...
    if($iLen>8)
    {
        if(strstr($sBoDate," "))
        {    
            $arBodate = explode(" ",$sBoDate);
            $arBodate = explode($sSeparator,$arBodate[0]);
        }
        else 
        {
            $arBodate = explode($sSeparator,$sBoDate);
        } 
        //yyyymmmddd
        $sDbDate = $arBodate[2].$arBodate[1].$arBodate[0];
    }
    return $sDbDate;
}

//hh:mm:ss, hh:mm, dd/mm/yyyy hh:mm dd/mm/yyyy hh:mm:ss
function bodb_time4($sBoDate,$sSeparator="-")
{
    $sDbDate = "";
    $sBoDate = trim($sBoDate);
    $iLen = strlen($sBoDate);
    if(strstr($sBoDate,"/")) $sSeparator="/";
    //dd/mm/yyyy hh:mm | ss
    if($iLen>9)
    {
        if(strstr($sBoDate," "))
        {    
            $arBodate = explode(" ",$sBoDate);
            $arBodate = explode($sSeparator,$arBodate[1]);
        }
        else 
        {
            $arBodate = explode($sSeparator,$sBoDate);
        } 
        //hhmm
        //$sDbDate = $arBodate[0].$arBodate[1];        
    }
    //hh:mm:ss
    elseif($iLen>7)
    {
        $arBodate = explode(":",$sBoDate);        
        //$sDbDate = $arBodate[0].$arBodate[1];
    }
    //hh:mm
    elseif($iLen>4)
    {
        //bug($sBoDate);
        $arBodate = explode(":",$sBoDate);
        //$sDbDate = $arBodate[0].$arBodate[1];        
    }
    
    //0->hh 1->mm (2->ss se omite)
    $arBodate[0] = two_positions($arBodate[0]);
    $arBodate[1] = two_positions($arBodate[1]);
    $sDbDate = $arBodate[0].$arBodate[1];
    return $sDbDate;
}

function bodb_time6($sBoDate,$sSeparator="-")
{
    $sDbDate = "";
    $sBoDate = trim($sBoDate);
    $iLen = strlen($sBoDate);
    if(strstr($sBoDate,"/")) $sSeparator="/";
    //dd/mm/yyyy hh:mm | ss
    if($iLen>9)
    {
        if(strstr($sBoDate," "))
        {    
            $arBodate = explode(" ",$sBoDate);
            $arBodate = explode($sSeparator,$arBodate[1]);
        }
        else 
        {
            $arBodate = explode($sSeparator,$sBoDate);
        } 
        //hhmm
        //$sDbDate = $arBodate[0].$arBodate[1];        
    }
    //hh:mm:ss
    elseif($iLen>7)
    {
        $arBodate = explode(":",$sBoDate);        
        //$sDbDate = $arBodate[0].$arBodate[1];
    }
    //hh:mm
    elseif($iLen>4)
    {
        $arBodate = explode(":",$sBoDate);
        //$sDbDate = $arBodate[0].$arBodate[1];        
    }
    //0->hh 1->mm (2->ss se omite)
    $arBodate[0] = two_positions($arBodate[0]);
    $arBodate[1] = two_positions($arBodate[1]);
    $arBodate[2] = two_positions($arBodate[2]);
    $sDbDate = $arBodate[0].$arBodate[1].$arBodate[2];
    return $sDbDate;    
}

function bodb_datetime4($sBoDate,$sSeparator="-")
{
    $sDbDateTime = "";
    $sBoDate = trim($sBoDate);
    $iLen = strlen($sBoDate);
    if(strstr($sBoDate,"/")) $sSeparator="/";
    //dd-mm-yyyy hh:mm | ss
    if($iLen>15)
    {
        if(strstr($sBoDate," "))
        {    
            $arBodate = explode(" ",$sBoDate);
            $arBodate = explode($sSeparator,$arBodate[0]);
            $arBoTime = explode(":",$arBodate[1]);
        }
    }
    //dd-mm-yyyy 
    elseif($iLen>9)//<15
    {
        $arBodate = explode($sSeparator,$sBoDate);
    }
    //0->hh 1->mm (2->ss se omite)
    $arBoTime[0] = two_positions($arBoTime[0]);
    $arBoTime[1] = two_positions($arBoTime[1]);
    //$arBoTime[2] = two_positions($arBoTime[2]);

    $sDbDateTime = $arBodate[2].$arBodate[1].$arBodate[0].$arBoTime[0].$arBoTime[1];//.$arBoTime[2];
    return $sDbDateTime;
}

function bodb_datetime6($sBoDate,$sSeparator="-")
{
    $sDbDateTime = "";
    $sBoDate = trim($sBoDate);
    $iLen = strlen($sBoDate);
    if(strstr($sBoDate,"/")) $sSeparator="/";
    //dd-mm-yyyy hh:mm | ss
    if($iLen>15)
    {
        if(strstr($sBoDate," "))
        {    
            $arBodate = explode(" ",$sBoDate);
            $arBodate = explode($sSeparator,$arBodate[0]);
            $arBoTime = explode(":",$arBodate[1]);
        }
    }
    //dd-mm-yyyy 
    elseif($iLen>9)//<15
    {
        $arBodate = explode($sSeparator,$sBoDate);
    }
    
    //0->hh 1->mm (2->ss se omite)
    if(isset($arBoTime[0])) $arBoTime[0] = two_positions($arBoTime[0]);
    if(isset($arBoTime[1])) $arBoTime[1] = two_positions($arBoTime[1]);
    if(isset($arBoTime[2])) $arBoTime[2] = two_positions($arBoTime[2]);

    if(isset($arBodate))
        $sDbDateTime = $arBodate[2].$arBodate[1].$arBodate[0];
    if(isset($arBoTime))
        $sDbDateTime .= $arBoTime[0].$arBoTime[1].$arBoTime[2];
    
    return $sDbDateTime;    
}

function bodb_int($sBoInt)
{
    return (int)$sBoInt;
}

function float_round($fValue,$iRoundLen=2)
{
    $iRoundLen = pow(10,$iRoundLen);
    return round($fValue * $iRoundLen) / $iRoundLen;
}

function float_roundstr($fValue,$iRoundLen=2)
{
    $fValue = float_round($fValue,$iRoundLen);
    $fValue = number_format($fValue,$iRoundLen,".","");
    $fValue = (string)$fValue;
    return $fValue;
}
