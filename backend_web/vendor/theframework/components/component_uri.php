<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.1.0
 * @name ComponentUri
 * @file component_uri.php
 * @date 21-10-2016 16:13 (SPAIN)
 * @observations: 
 */
class ComponentUri //extends TheFrameworkComponent 
{
    private $isPermaLink;
    private $sIsoLanguage;
    private $sPackage;
    private $sController;
    private $sPartial;
    private $sMethod;
    private $arExtra;
    
    /**
     * 
     * @param type $sController
     * @param type $sPartial
     * @param type $sMethod
     * @param string|array $mxExtra 
     * @param type $sPackage
     * @param type $isPermaLink
     */
    public function __construct($sController=NULL,$sPartial=NULL,$sMethod=NULL,$mxExtra=NULL,$sPackage=NULL,$isPermaLink=0)
    {
        if(isset($_GET["tfw_iso_language"]))
            $this->sIsoLanguage = $_GET["tfw_iso_language"];
        $this->isPermaLink = $isPermaLink;
        $this->sPackage = $sPackage;
        $this->sController = $sController;
        $this->sPartial = $sPartial;
        $this->sMethod = $sMethod;
        $this->load_extra($mxExtra);
    }
    
    private function load_extra($mxExtra)
    {
        $this->arExtra = array();
        if($mxExtra)
        {
            if(is_string($mxExtra) && strstr($mxExtra,","))
            {
                $arKeyVal = explode(",",$mxExtra);
                if($this->isPermaLink)
                {
                    foreach($arKeyVal as $sKeyVal)
                    {
                        $sVal = explode("=",$sKeyVal);
                        $sVal = $sVal[1];
                        $this->arExtra[] = $sVal;
                    }
                }
                else
                {
                    foreach($arKeyVal as $sKeyVal)
                        $this->arExtra[] = $sKeyVal;
                }
            }
            elseif(is_string($mxExtra))
            {
                $arKeyVal = explode("&",$mxExtra);
                if($this->isPermaLink)
                {
                    foreach($arKeyVal as $sKeyVal)
                    {
                        $sVal = explode("=",$sKeyVal);
                        $sVal = $sVal[1];
                        $this->arExtra[] = $sVal;
                    }
                }
                else
                {
                    foreach($arKeyVal as $sKeyVal)
                        $this->arExtra[] = $sKeyVal;
                }
            }
            elseif(is_array($mxExtra))
            {
                foreach($mxExtra as $sKey=>$sValue)
                    $this->arExtra[]="$sKey=$sValue";
            }
        }
    }//load_extra
    
    private function get_joined_extra()
    {
        $sExtra = "";
        if($this->arExtra)
        {
            if($this->isPermaLink)
                $sExtra = implode("/",$this->arExtra);
            else
                $sExtra = implode("&",$this->arExtra);
        }
        return $sExtra;
    }//get_joined_extra
    
    public function get_built()
    {
        $sUrl = "";
        //recupero los parametros extra
        $sExtra = $this->get_joined_extra();
        if($this->isPermaLink)
        {   
            $cGlue = "/";//separador web
            //si se está enrutando si el metodo (o la vista) es "get_list" se marca a nulo
            //para que no exista duplicidad puesto que get_list va intrinsico en /module/
            if($this->sIsoLanguage) $arUrl[] = $this->sIsoLanguage;
            if($this->sPackage) $arUrl[] = $this->sPackage;
            if($this->sController) $arUrl[] = $this->sController;
            if($this->sPartial) $arUrl[] = $this->sPartial;
            $sMethod = $this->sMethod;
            if($sMethod=="get_list") $sMethod=NULL;            
            if($sMethod) $arUrl[] = $sMethod;            
            $sUrl .= $cGlue.implode($cGlue,$arUrl).$cGlue;
            if($sExtra) $sUrl .= $sExtra.$cGlue;
        }
        //& params url
        else 
        {
            $sUrl .= "index.php?";
            $cGlue = "&";
            if($this->sIsoLanguage) $arUrl[] = "lang=$this->sIsoLanguage";
            if($this->sPackage) $arUrl[] = "group=$this->sPackage";
            if($this->sController) $arUrl[] = "module=$this->sController";
            if($this->sPartial) $arUrl[] = "section=$this->sPartial";
            $sMethod = $this->sMethod;
            if(!$sMethod) $sMethod = "get_list";            
            $arUrl[] = "view=$sMethod";
            if($sExtra) $arUrl[] = $sExtra;
            $sUrl .= implode($cGlue,$arUrl);
        }        
        return $sUrl;
    }//get_built
    
    public function set_iso_language($sValue){$this->sIsoLanguage=$sValue;}
    public function set_permalink($isOn=TRUE){$this->isPermaLink=$isOn;}
    public function set_package($sValue){$this->sPackage=$sValue;}
    public function set_controller($sValue){$this->sController=$sValue;}
    public function set_partial($sValue){$this->sPartial=$sValue;}
    public function set_method($sValue){$this->sMethod=$sValue;}
    public function set_extra($mxValue){$this->load_extra($mxValue);}
    public function add_extra($sKey,$sValue){$this->arExtra[]="$sKey=$sValue";}
    public function add_extra1($sKeyValue){$this->arExtra[]=$sKeyValue;}
}//ComponentUri