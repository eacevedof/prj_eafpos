<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheApplication\Components\ComponentFile 
 * @file ComponentFile.php 1.0.0
 * @date 12-03-2019 16:27 SPAIN
 * @observations
 */
namespace TheFramework\Components;

class ComponentFile 
{
    const DS = DIRECTORY_SEPARATOR;
    
    //private $sPathFolderFrom;
    private $sPathFolderTo;
    private $sFileNameTo;
        
    public function __construct($sPathFolerTo="",$sFileNameTo="",$sPathFolderFrom="") 
    {
        //$this->sPathFolderFrom = $sPathFolderFrom; 
        $this->sPathFolderTo = $sPathFolerTo;        
        $this->sFileNameTo = $sFileNameTo;
        //if(!$sPathFolderFrom) $this->sPathFolderFrom = __DIR__;
        if(!$sPathFolerTo) $this->sPathFolderTo = __DIR__;
        if(!$sFileNameTo) $this->sFileNameTo = "compofiletmp.txt";
        //intenta crear la carpeta de logs
        $this->fix_folders();
    }
    
    private function fix_folders()
    {
        //$sLogFolder = $this->sPathFolderFrom.self::DS;
        //if(!is_dir($sLogFolder)) @mkdir($sLogFolder);
        $sLogFolder = $this->sPathFolderTo.self::DS;
        if(!is_dir($sLogFolder)) @mkdir($sLogFolder);
    }
        
    public function save($mxContent)
    {
        if(!is_string($mxContent)) 
            $mxContent = var_export($mxContent,1);
        
        $sPathFile = $this->sPathFolderTo.self::DS
                     .$this->sFileNameTo;
        
        if(is_file($sPathFile))
            $oCursor = fopen($sPathFile,"a");
        else
            $oCursor = fopen($sPathFile,"x");

        if($oCursor !== FALSE)
        {
            $sToSave = $mxContent;
            fwrite($oCursor,""); //Grabo el caracter vacio
            if(!empty($sToSave)) fwrite($oCursor,$sToSave);
            fclose($oCursor); //cierro el archivo.
        }
        else
        {
            return FALSE;
        }
        return TRUE;        
    }//save

    
    
    public function set_filenameto($sValue){$this->sFileNameTo=$sValue;}
    public function set_folderto($sValue){$this->sPathFolderTo=$sValue;}
    public function save_bulkfile($arData,$sFieldSep="@@@@",$sLineSep="####")
    {
        $arLines = [];
        if(is_array($arData))
        {
            foreach ($arData as $arFields)
                $arLines[] = implode($sFieldSep,$arFields).$sLineSep;
        }
        else;
            //$this->add_error();
        
        $sContent = implode("\n",$arLines);
        $this->save($sContent);
    }
    
}//ComponentFile