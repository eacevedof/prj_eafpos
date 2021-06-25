<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.10.0
 * @file functions_utils.php 
 * @date 08-02-2017 10:50 (SPAIN)
 * @observations: Utils
 *  load:11
 * @requires
 */
//pr("functions_utils.php 1.6.8");
function use_file_from_includedpath($mxFileName,$sPrefix="",$sExtension="php",$sPathFolder="")
{
    $isIncluded = FALSE;
    //bugipath();
    //bug("filename:$mxFileName,prefix:$sPrefix,pathfolder:$sPathFolder","use_file_from_includedpath");
    if($sPathFolder && !is_pathendds($sPathFolder)) 
        $sPathFolder .= DIRECTORY_SEPARATOR;
    
    if(is_array($mxFileName))
        foreach($mxFileName as $sFileName)
        {   
            $sFileName = trim($sFileName);
            $sFileName = "$sPathFolder$sPrefix$sFileName.$sExtension";
            if(core_isfile_includepath($sFileName))
                $isIncluded = include_once $sFileName;
            //pr($isIncluded,"use_file_from_includedpath.isIncluded:$sFileName");
        }
    else//string
    {
        $mxFileName = str_replace("\n","",$mxFileName);
        $mxFileName = trim($mxFileName);
        //se importa todo lo que hay en la carpeta
        if(strstr($mxFileName,"*") && $sPathFolder)
        {
            //NO VA!!
            //esto no es suficiente, se debe recorrer todos las rutas en include_path
            //y con estas concatenando buscar el directorio. Una vez encontrado, y es es el problema,
            //encontrarlo ya que para esto debo pasarle un array de mapeo tipo de clase y ruta raiz predefinida,  
            //obtener su contenido y con cada uno de estos archivos hacer el include 
            //especifico
            $arFiles = array_diff(scandir($sPathFolder),array("..","."));
            foreach($arFiles as $mxFileName)
            {
                $sFileName = "$sPathFolder$sPrefix$mxFileName.$sExtension";
                //bug($sFileName,"ruta a incluir en *");
                if(core_isfile_includepath($sFileName))
                    $isIncluded = include_once $sFileName;
                //pr($isIncluded,"use_file_from_includedpath.isIncluded:$sFileName");              
            }
        }
        elseif(strstr($mxFileName,","))
        {
            $arNames = explode(",",$mxFileName);
            foreach($arNames as $mxFileName)
            {
                $mxFileName = trim($mxFileName);
                $sFileName = "$sPathFolder$sPrefix$mxFileName.$sExtension";
                //bug($sFileName);
                if(core_isfile_includepath($sFileName))
                    $isIncluded = include_once $sFileName;
                //pr($isIncluded,"use_file_from_includedpath.isIncluded:$sFileName");               
            }
        }
        else//string sin separación
        {
            $sFileName = "$sPathFolder$sPrefix$mxFileName.$sExtension";
            //bug($sFileName,"import");
            //bugfile($sFileName,$sFileName);
            //bugfileipath($sFileName);
            if(core_isfile_includepath($sFileName))
                $isIncluded = include_once $sFileName;
            //pr($isIncluded,"use_file_from_includedpath.isIncluded:$sFileName"); 
        }
    }
    //if($sPrefix=="model_"){bug($mxFileName);bugif();die;}
}//use_file_from_includedpath

function import($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"","php",$sPathFolder);}

//===============
//  IMPORT CORE
//===============
function import_model($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"model_","php",$sPathFolder);}
function import_component($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"component_","php",$sPathFolder);}
/**
 * 
 * @param mixto $mxFileName array, csv string or simple string
 * @param string $sPathFolder Used for unusual controllers name. Example modulebulder
 */
function import_controller($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"controller_","php",$sPathFolder);}
function import_helper($mxFileName){use_file_from_includedpath($mxFileName,"helper_");}
function import_view($mxFileName){use_file_from_includedpath($mxFileName,"view_");}
function import_behaviour($mxFileName){use_file_from_includedpath($mxFileName,"behaviour_");}
function import_plugin($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"","php",$sPathFolder);}

//===============
//  IMPORT APP
//===============
//function import_appmodel($mxFileName){use_file_from_includedpath($mxFileName,"appmodel_");}
function import_appcomponent($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"appcomponent_","php",$sPathFolder);}
function import_appcontroller($mxFileName,$sPathFolder="",$sExtension="php")
{
    //customernotes\controller_customernotes.php" lo encuentra.
    // \ o /customernotes\controller_customernotes.php" no lo encuentra
    //$sPathFolder .= DIRECTORY_SEPARATOR;
    //$sPathFolder .= $mxFileName;
    use_file_from_includedpath($mxFileName,"controller_",$sExtension,$sPathFolder);
}
function import_apphelper($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"apphelper_","php",$sPathFolder);}
function import_appbehaviour($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"appbehaviour_","php",$sPathFolder);}
function import_appview($mxFileName,$sPathFolder=""){use_file_from_includedpath($mxFileName,"appview_","php",$sPathFolder);}
function import_appvendor($mxFileName,$sPathFolder=""){
//    if(!is_firstchar($sPathFolder,"/"))
//        $sPathFolder = "/$sPathFolder";
    use_file_from_includedpath($mxFileName,"","php",$sPathFolder);}
/**
 * If $sLanguage is empty it tries to recover language from session if it is still empty then applies default language = "english"
 * @param mixed $mxModule array|string|csvstring
 * @param string $sLanguage User language
 */
function import_apptranslate($mxModule,$sPathFolder="")
{
    $sModule = $_GET["tfw_module"];
    //tengo que abrir la session para comprobar si hay un usuario registrado
    if(session_status()==PHP_SESSION_NONE) session_start();
    //bugp();bugg();
    $sLanguage = $_SESSION["tfw_user_language"];
    //al terminar la recuperación del idioma del usuario, cierro para evitar error con posteriores includes
    session_write_close();

    //si se acarrea el codigo iso en la primera posicion de la url
    if(isset($_GET["tfw_iso_language"]))
        $sLanguage = $_GET["tfw_iso_language"];

    if(!$sLanguage) $sLanguage = TFW_DEFAULT_LANGUAGE;
    
    if($sPathFolder) $sPathFolder = "/$sPathFolder";
    //$sFileName = "$sPathFolder$sPrefix$mxFileName.$sExtension";

    use_file_from_includedpath($mxModule,"$sLanguage$sPathFolder/translate_");
    //ñapa para forzar a que cargue traducciones desde subcarpetas
    use_file_from_includedpath($mxModule,"$sLanguage$sPathFolder/$sModule/translate_");
}//import_apptranslate

/**
 * If $sLanguage is empty it tries to recover language from session if it is still empty then applies default language = "english"
 * @param mixed $mxModule array|string|csvstring
 * @param string $sLanguage User language
 */
function import_apptranslatelng($mxModule,$sLanguage=NULL,$sPathFolder="")
{
    $sModule = $_GET["tfw_module"];
    if(!$sLanguage)
    {   
        //tengo que abrir la session para comprobar si hay un usuario registrado
        if(session_status()==PHP_SESSION_NONE) session_start();
        //bugp();bugg();
        $sLanguage = $_SESSION["tfw_user_language"];
        //al terminar la recuperación del idioma del usuario, cierro para evitar error con posteriores includes
        session_write_close();
        
        //si se acarrea el codigo iso en la primera posicion de la url
        if(isset($_GET["tfw_iso_language"]))
            $sLanguage = $_GET["tfw_iso_language"];
        
        if(!$sLanguage) $sLanguage = TFW_DEFAULT_LANGUAGE;
    }
    if($sPathFolder) $sPathFolder = "/$sPathFolder";
    //$sFileName = "$sPathFolder$sPrefix$mxFileName.$sExtension";
    use_file_from_includedpath($mxModule,"$sLanguage.$sPathFolder/translate_");
    //ñapa para forzar a que cargue traducciones desde subcarpetas
    use_file_from_includedpath($mxModule,"$sLanguage.$sPathFolder/$sModule/translate_");
}//import_apptranslatelng

//APP MAIN
function import_appmain($mxFileName){use_file_from_includedpath($mxFileName,"theapplication_");}

function array_key_position($sKey,$arSearch){return array_search($sKey,array_keys($arSearch));}

function array_kvmerge(&$arArray,$sGlue=":")
{
    $arTmp = [];
    foreach($arArray as $sKey=>$mxAr)
    {
        if(!is_string($mxAr))
            $mxAr = var_export($mxAr,TRUE);
        $arTmp[] = "$sKey$sGlue$mxAr";
    }
    $arArray = $arTmp;
}//array_kvmerge

function is_pathendds($sPathPath){return is_lastchar($sPathPath,"/") && is_lastchar($sPathPath,"\\");}

function size_inbytes($sValue) 
{
    $sValue = trim($sValue);
    $sLastChar = strtolower($sValue[strlen($sValue)-1]);
    switch($sLastChar) 
    {
        // The 'G' modifier is available since PHP 5.1.0
        case "g": $sValue *= 1024;  
        case "m": $sValue *= 1024;
        case "k": $sValue *= 1024;
    }
    return $sValue;
}

/**
 * TODO
 * @param string $sTimeFrom
 * @param string $sTimeTo
 * @param string $sType
 */
function time_interval($sTimeFrom="01-01-2013 07:35:00",$sTimeTo="01-01-2013 08:21:00",$sType="His")
{
    $iReturn = 0;
    
    $iSecsFrom = strtotime($sTimeFrom);
    $iSecsTo = strtotime($sTimeTo);

    $iSecs = $iSecsTo-$iSecsFrom;
    $iMins = ceil($iSecs/60);
    var_dump($iSecsFrom,$iSecsTo,$iSecs,$iMins);
}

//example: dateadd("20150917",3)
function dateadd($sDbDate,$iDays=0,$iMonths=0,$iYears=0) 
{
    //(el número de segundos desde el 1 de Enero del 1970 00:00:00 UTC
    $iSecs1970 = strtotime($sDbDate);
    $sNewDate = date
    (
        "Y-m-d h:i:s"
        ,mktime(date("h",$iSecs1970),
            date("i",$iSecs1970),date("s",$iSecs1970),date("m",$iSecs1970)+$iMonths,
            date("d",$iSecs1970)+$iDays,date("Y",$iSecs1970)+$iYears)
    );
    return $sNewDate;
}

function remove_files($sPathFolderDs){array_map("unlink",glob("$sPathFolderDs*"));}