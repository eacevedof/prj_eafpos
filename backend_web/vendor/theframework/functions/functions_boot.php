<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 2.5.1
 * @name functions_boot
 * @file functions_boot.php 
 * @date 06-08-2017 15:25 (SPAIN)
 * @observations: 
 *  load:8
 */
function core_isfile_includepath($sFilePath)
{
    $isFile = stream_resolve_include_path($sFilePath);
    //pr("result:$isFile","core_isfile_includepath:$sFilePath");
    return $isFile;
}//core_isfile_includepath

function core_router
($sModuleParam,$sSectionParam,$sViewParam,$sPackageParam
,$sDefController="status",$sAccessMethod="pos-login",$sDefMethod="get_list",$sDefMethod404="error_404")
{
    if(defined("TFW_DEFAULT_CONTROLLER"))
        if(TFW_DEFAULT_CONTROLLER!="")
            $sDefController = TFW_DEFAULT_CONTROLLER;
    
    if(defined("TFW_DEFAULT_ACCESSMETHOD"))
        if(TFW_DEFAULT_ACCESSMETHOD!="")
            $sAccessMethod = TFW_DEFAULT_ACCESSMETHOD;
        
    if(defined("TFW_DEFAULT_METHOD"))
        if(TFW_DEFAULT_METHOD!="")
            $sDefMethod = TFW_DEFAULT_METHOD;
            
    if(defined("TFW_DEFAULT_METHOD404"))
        if(TFW_DEFAULT_METHOD404!="")
            $sDefMethod404 = TFW_DEFAULT_METHOD404; 
        
    //TFW_DEFAULT_METHOD404    
    $arReturn = array
    (
        "controller_name"=>""
        ,"controller_method"=>""
        ,"controller_package"=>""
        ,"controller_path"=>""
        ,"controller_type"=>"Controller"//partial
    );

    //variables a utilizar
    $sPathController = "";
    
    $sController = $sModuleParam;
    $sPartialController = $sSectionParam;
    $sMethod = $sViewParam;
    $sPackage = $sPackageParam;
    if(!$sPackage) $sPackage="public";
    
    $arReturn["controller_package"] = $sPackage;
    
    if($sController)
    {
        $sPathController = $sController;    
        $sPathController = $sPackage.DIRECTORY_SEPARATOR.$sController;
        
        if($sPartialController)
        {
            $sPathController .= DIRECTORY_SEPARATOR."partial_$sPartialController";
            $arReturn["controller_name"] = $sPartialController;
            $arReturn["controller_type"] = "Partial";
        }
        //no partialcontroller (tab)
        else
        {    
            $sPathController .= DIRECTORY_SEPARATOR."controller_$sController";
            $arReturn["controller_name"] = $sController;
        }
        //pr($sPathController,"pathcontroller 1");
        if($sMethod)
            $arReturn["controller_method"] = $sMethod;
        else
            $arReturn["controller_method"] = $sDefMethod;
    }
    //no se ha proporcionado controlador por lo tanto es la url raiz /,/index.php,/index.php?
    else
    {
        $sPathController = $sDefController;
        //pr($sPathController,"pathcontroller 2");
        $arReturn["controller_name"] = $sDefController;
        $sPathController = $sPackage.DIRECTORY_SEPARATOR.$sDefController;
        $sPathController .= DIRECTORY_SEPARATOR."controller_$sDefController";
        //No hay partial (tab) ni metodo => homes->pos-login
        if(!$sPartialController && !$sMethod)
            $arReturn["controller_method"] = $sDefMethod;
        else
            $arReturn["controller_method"] = $sDefMethod404;
    }
    //pr($arReturn);
    //$sPathController = ".".DIRECTORY_SEPARATOR."$sPathController.php";
    $sPathController = "$sPathController.php";
    //bug($sPathController,"sPathController");
    if(core_isfile_includepath($sPathController))
        $arReturn["controller_path"] = $sPathController;
    else
    {
        $arReturn = array
        (
            "controller_package"=>"public"
            ,"controller_type"=>"Controller"
            ,"controller_name"=>"Status"
            ,"controller_method"=>"error_404"
            ,"controller_path"=>"public".DIRECTORY_SEPARATOR."status".DIRECTORY_SEPARATOR."controller_status.php"
            ,"error"=>"$sPathController not found!"
        );
    }
    
    //bug($arReturn);
    if($arReturn["controller_type"]=="Partial")
    {    
        if($_GET["tfw_module"])
            $_GET["tfw_controller"] = $_GET["tfw_module"];
        elseif($_GET["tfw_controller"]) 
            $_GET["tfw_module"] = $_GET["tfw_controller"];
        $_GET["tfw_partial"] = $arReturn["controller_name"];
        $_GET["tfw_section"] = $_GET["tfw_partial"];
    }
    else
    {
        //globales
        $_GET["tfw_controller"] = $arReturn["controller_name"];
        $_GET["tfw_module"] = $_GET["tfw_controller"];        
    }
    
    $_GET["tfw_method"] = $arReturn["controller_method"];
    $_GET["tfw_view"] = $_GET["tfw_method"];
    //pr("core_router"); bugg();//die;
    return $arReturn;
}

function get_fixed_syspath($sPathDir="")
{
    if($sPathDir)
    {
        $sPathDir = str_replace("/",DIRECTORY_SEPARATOR,$sPathDir);
        $sPathDir = str_replace("\\",DIRECTORY_SEPARATOR,$sPathDir);
    }
    return $sPathDir;
}

function get_absolute_path($sSubPath)
{
    if(is_firstchar($sSubPath,"/")||is_firstchar($sSubPath,"\\"))
        remove_firstchar($sSubPath);
    $sSubPath = DIRECTORY_SEPARATOR.$sSubPath;        
    
    $arPaths = explode(PATH_SEPARATOR,get_include_path());
    foreach($arPaths as $sDirPath)
    {
        $sTmpPath = $sDirPath.$sSubPath;
        //echo $sTmpPath."<br>";
        if(is_file($sTmpPath))
            return $sTmpPath;
    }
    return "path not found";
}//get_absolute_path

function is_isolang_config()
{
    if(defined("TFW_DEFAULT_LANGUAGE_ISO"))
        return (trim(TFW_DEFAULT_LANGUAGE_ISO)!=="");
    return FALSE;
}//tfw_is_isolanguage

function tfw_loadlanguage($sIndexController,$sIndexPackage)
{
    //bug($_COOKIE);
    session_start();
    //bugss();
    //carpeta de idioma
    $sLangFolder = TFW_DEFAULT_LANGUAGE;
    
    //carpetas = idioma por defecto
    if(!isset($_SESSION["tfw_user_language"])) $_SESSION["tfw_user_language"] = $sLangFolder;
    if(!isset($_SESSION["tfw_public_language"])) $_SESSION["tfw_public_language"] = $sLangFolder;
    if(isset($_POST["selTfwPublicLanguage"])) $_SESSION["tfw_public_language"] = $_POST["selTfwPublicLanguage"];
    
    //traduccion para módulos publicos
    if($sIndexPackage=="public")
        $sLangFolder = $_SESSION["tfw_public_language"];
    //traduccion para módulos privados (user->language)
    else 
        $sLangFolder = $_SESSION["tfw_user_language"];

    //si se acarrea el codigo iso en la primera posicion de la url
    if(isset($_GET["tfw_iso_language"]))
        $sLangFolder = $_GET["tfw_iso_language"];
    
    $sLangFolderDS = $sLangFolder.TFW_DS;
    //bugipath();die;
    //prj_theframework\the_public\..\the_application\controllers"
    //TRANSLATE MAIN
    $sPathIncludeFile = $sLangFolderDS."translate_main.php";
    //bugfile($sPathIncludeFile,$sPathIncludeFile);
    //bug(core_isfile_includepath($sPathIncludeFile),$sPathIncludeFile);
    //includepath comprueba si existe el archivo en la pila de rutas 
    if(core_isfile_includepath($sPathIncludeFile))
        include_once($sPathIncludeFile);

    //TRANSLATE CONTROLLER 
    //se busca en la carpeta del controlador
    $sPathIncludeFile = $sIndexPackage.TFW_DS.$sIndexController.TFW_DS."translate_$sLangFolder.php";
    //bug($sPathIncludeFile,"translate_$sLangFolder.php");
    if(core_isfile_includepath($sPathIncludeFile))
        include_once($sPathIncludeFile);
    //si no esta en la carpeta del controlador se busca en la carpeta de traducciones
    else
    {
        //se busca en una subcarpeta con nombre de controlador
        $sPathIncludeFile = $sLangFolderDS.$sIndexController."/translate_$sIndexController.php";
        if(core_isfile_includepath($sPathIncludeFile))
            include_once($sPathIncludeFile);
        
        $sPathIncludeFile = $sLangFolderDS."translate_$sIndexController.php";
        //bug($sPathIncludeFile);
        //bug(core_isfile_includepath($sPathIncludeFile), $sPathIncludeFile);
        if(core_isfile_includepath($sPathIncludeFile))
            include_once($sPathIncludeFile);
    }

    //TRANSLATE PARTIAL
    if(isset($_GET["tfw_section"])||isset($_GET["tfw_partial"]))
    {
        $sPartial = $_GET["tfw_section"];
        if(!$sPartial) $sPartial = $_GET["tfw_partial"];
        //se busca en la carpeta del controlador
        $sPathIncludeFile = $sIndexPackage.TFW_DS.$_GET["tfw_controller"].TFW_DS."translate_$sLangFolder"."_"."$sPartial.php";
        //bug($sPathIncludeFile,"translate_$sLangFolder.php");
        if(core_isfile_includepath($sPathIncludeFile))
            include_once($sPathIncludeFile);
        //si no esta en la carpeta controlador se busca en the_application/translations
        else
        {
            $sPathIncludeFile = $sLangFolderDS.$sIndexController."/translate_$sPartial.php";
            if(core_isfile_includepath($sPathIncludeFile))
                include_once($sPathIncludeFile);
            
            $sPathIncludeFile = $sLangFolderDS."translate_$sPartial.php";
            if(core_isfile_includepath($sPathIncludeFile)) 
                include_once($sPathIncludeFile);
        }
    }
    session_write_close();
}

function tfw_loadcontroller($sIndexControllerPath,$sIndexController,$sIndexType,$sIndexMethod)
{
    $isIncluded = include($sIndexControllerPath);
    if($isIncluded)
    {
        $sTfwClassName = $sIndexType.sep_to_camel($sIndexController);
        //bug($sTfwClassName,"sTfwClassName");die;
        if(class_exists($sTfwClassName))
        {
            //bug($sTfwClassName,"objeto a crear"); die;
            $oTfwController = new $sTfwClassName();
            if(method_exists($oTfwController,$sIndexMethod))
                $oTfwController->{$sIndexMethod}();
            else
            {
                pr("Theframework: <b>Method 1</b> $sIndexMethod does not exist or is not public in <b>$sTfwClassName</b>!");
                die;
            }

            if(!$oTfwController->is_ajax())    
                if(IS_DEBUG_ALLOWED  || 
                  (isset($_SESSION["tfw_user_identificator"]) && ($_SESSION["tfw_user_identificator"]=="1"//user bo system
                    || $_SESSION["tfw_user_identificator"]=="-10" /*developer=-10*/)))
                    ComponentDebug::set_sql("<b>controller:</b>$sIndexController, <b>type:</b>$sIndexType, <b>method:</b>$sIndexMethod, controllerpath:$sIndexControllerPath",0,0);
                    ComponentDebug::get_sqls_in_html_table();
        }
        else 
        {
            pr("Theframework: <b>Controller 2</b> $sTfwClassName does not exist!");
            die;    
        }        
    }
    else
    {
        pr("Theframework: <b>Controller 3</b> $sIndexControllerPath not found!");
        die;  
    }
}

function tfw_loadalert()
{
    if(isset($_SESSION["tfw_message"]["a"]) && $_SESSION["tfw_message"]["a"])
    {
        import_helper("javascript");
        $oJavascript = new HelperJavascript();
        $sJs = implode(" ",$_SESSION["tfw_message"]["a"]);
        unset($_SESSION["tfw_message"]["a"]);
        $sJs = str_replace("'","\\'",$sJs);
        $oJavascript->add_js_line("alert('$sJs');");
        $oJavascript->show();
    }
}

function tfw_get_routes()
{
    $sFileRoutes = "app_routes_en.php";
    if(defined("TFW_DEFAULT_LANGUAGE_ISO"))
    {
        if(TFW_DEFAULT_LANGUAGE_ISO!="")
        {
            $sCodIso = TFW_DEFAULT_LANGUAGE_ISO;
            $sFileRoutes = "app_routes_{$sCodIso}.php";
            $sUrl = trim($_SERVER["REQUEST_URI"]);
            if($sUrl!=="/")
            {
                if(is_firstchar($sUrl,"/"))remove_firstchar($sUrl);
                if(is_lastchar($sUrl,"/")) remove_lastchar($sUrl);
                $arPieces = explode("/",$sUrl);

                if(isset($arPieces[0]))
                {
                    $sCodIso = $arPieces[0];
                    $sFileRoutes = "app_routes_{$sCodIso}.php";
                }
                //pr($sUrl,"url"); pr($arPieces,"pieces"); pr($sFileRoutes,"fileroutes");die;
                if(!core_isfile_includepath($sFileRoutes))
                    $sFileRoutes = "app_routes_en.php";
            }//si la url tiene algo, es decir dominio/algo... si no se pone nada vendria solo la barra
        }//si esta defindo el iso vacio tira de ingles     
    }//sino esta definido el iso, tira de ingles

    return $sFileRoutes;    
}//tfw_get_routes()