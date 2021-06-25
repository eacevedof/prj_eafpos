<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.0.0
 * @name ComponentXml
 * @file component_xml.php
 * @date 17-07-2015 10:41 (SPAIN)
 * @observations: 
 */
class ComponentXml 
{
    public function __construct(){;}
    
    public function build_head($sEncode="utf-8")
    {
        $sXmlTag = "";
        $sXmlTag .= "<?xml ";
        $sXmlTag .= "version=\"1.0\" encoding=\"$sEncode\" standalone=\"no\"?>\r\n";
        
        //<Document xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
//        $sXmlTag .= "<Document xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ";
//        $sXmlTag .= "xmlns=\"urn:iso:std:iso:20022:tech:xsd:pain.001.001.03\">\r\n";
        return $sXmlTag;
    }//build_head

    private function escape_xmlstring($sToEscape)
    {
        if($sToEscape)
        {
            $arReplace=array
            (
                "&"=>"&amp;",">"=>"&gt;","<"=>"&lt;",
                "'"=>"&apos;","\""=>"&quot;"," "=>"&#160;",
            );

            foreach($arReplace as $sSearch=>$sReplace)
                $sToEscape = str_replace($sSearch,$sReplace,$sToEscape);
        }
        return $sToEscape;
    }//escape_xmlstring
    
    public function build_comment($sComment)
    {
        $sXmlTag = "<!-- ";
        $sXmlTag .= $sComment;
        $sXmlTag .= " -->\r\n";
        return $sXmlTag;
    }    
    
    public function build_tag_open($sTagName,$sTagParams="")
    {
        $sXmlTag = "";
        $sXmlTag .= "<";
        $sXmlTag .= $sTagName;
        if($sTagParams) $sXmlTag .= " ".$sTagParams;
        $sXmlTag .= ">\r\n";
        return $sXmlTag;
    }
    
    public function build_tag_close($sTagName){return "</".$sTagName.">\r\n";}
    
    public function build_tag_simple($sTagName,$sInnerValue)
    {
        $sXmlTag = $this->build_tag_open($sTagName);
        $sXmlTag .= $sInnerValue;
        $sXmlTag .= $this->build_tag_close($sTagName);
        return $sXmlTag;
    }
    
    public function build_tag_params($sTagName,$sInnerValue,$sTagParams="")
    {
        $sXmlTag = $this->build_tag_open($sTagName,$sTagParams);
        $sXmlTag .= $sInnerValue;
        $sXmlTag .= $this->build_tag_close($sTagName);
        return $sXmlTag;
    }
    
    public function build_tag_scaped($sTagName,$sInnerValue,$sTagParams="")
    {
        $sXmlTag = $this->build_tag_open($sTagName,$sTagParams);
        $sXmlTag .= $this->escape_xmlstring($sInnerValue);
        $sXmlTag .= $this->build_tag_close($sTagName);
        return $sXmlTag;
    }    
    
    //=======================
    //         SETS
    //=======================    

    //=======================
    //        GETS
    //=======================    
}//ComponentXml 1.0.0