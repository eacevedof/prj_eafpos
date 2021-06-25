<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.3.1
 * @name ComponentSession
 * @file component_session.php
 * @date 23-04-2017 12:37 (SPAIN)
 * @observations
 *  load:27
 */
class ComponentSession extends TheFrameworkComponent
{
    
    public function __construct()
    {   ;}
    
    public function close()
    {
        if(!headers_sent())
        {
            session_unset();
            if(session_status()==PHP_SESSION_NONE)
                session_start();
            $_SESSION=NULL; //$_GET=NULL; $_POST=NULL;
            /*CLOSE PREVIOUS SESSION*/
            //session_unlink();
            session_destroy();
            /*NOW GENERATING LINK FOR SESSION DATA */
            session_id();
            session_start();
            session_write_close();
            //session_regenerate_id();//Regenerating SID for sending
        }
    }    

    public function set($sKey,$mxValue){$_SESSION[$sKey]=$mxValue;}
    public function set_filter($sController,$sPartial,$sMethod,$mxValue)
    {
        $sKey = "$sController$sPartial$sMethod";
        $_SESSION[$sKey] = $mxValue;
    }
    
    public function clear($sKey){unset($_SESSION[$sKey]);}
    public function clearall(){unset($_SESSION);}
    /**
     * Escribe en $_SESSION["tfw_user_identificator"] = $iId
     * @param int $iId Puede ser negativo 
     */
    public function set_user_id($iId){$_SESSION["tfw_user_identificator"] = $iId;}
    public function set_user_language($sLanguage){$_SESSION["tfw_user_language"] = $sLanguage;}
    public function set_user_language_id($IdLanguage){$_SESSION["tfw_user_idlanguage"] = $IdLanguage;}
    
    public function get($sKey){return $_SESSION[$sKey];}
    public function get_filter($sController,$sPartial,$sMethod)
    {
        $sKey = "$sController$sPartial$sMethod";
        return $this->get($sKey);
    }
    
    public function exists($sKey){return ($_SESSION[$sKey]!=null);}
    
    public function get_user_id(){return isset($_SESSION["tfw_user_identificator"])?$_SESSION["tfw_user_identificator"]:NULL;}
    public function get_user_language(){return isset($_SESSION["tfw_user_language"])?$_SESSION["tfw_user_language"]:NULL;}
    public function get_user_id_language(){return isset($_SESSION["tfw_user_idlanguage"])?$_SESSION["tfw_user_idlanguage"]:NULL;}
    public function get_id(){return session_id();}
    
}//ComponentSession