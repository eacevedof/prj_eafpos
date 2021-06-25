<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 2.0.0
 * @name ComponentZip
 * @file component_zip.php
 * @date 30-06-2019 18:28 (SPAIN)
 * @observations
 * 
 */
class ComponentZip 
{
    protected $sPathSource;
    protected $sPathTarget;
    protected $arFolders;
    protected $arFiles;
    protected $arZipNames;

    public function __construct()
    {
        parent::__construct();
    }

    private function get_name_target($iPosFolder)
    {
        $sZipName = $this->arZipNames[$iPosFolder];
        //si no hay se coge el primero
        if(!$sZipName)
            $sZipName = $this->arZipNames[0];
        //si sigue sin haber se aplica por defecto
        if(!$sZipName)
            $sZipName = "zipnoname";
        
        if($sZipName!="zipnoname")
            $sZipName = $this->get_slug_cleaned($sZipName,"_");
        return $sZipName;
    }
    
    public function compress_folders()
    {
        $this->fix_path_target();
        if(is_dir($this->sPathTarget))
        {    
            if(is_dir($this->sPathSource))
            {    
                foreach($this->arFolders as $i=>$sFolderName)
                {
                    $sPathSoruce = $this->get_path_source($sFolderName);
                    if(is_dir($sPathSoruce))
                    {
                        $sZipName = $this->get_name_target($i);
                        $sZipPathTarget = $this->get_path_target($sZipName);
                        $this->compress($sPathSoruce,$sZipPathTarget);
                    }
                    else
                    {
                        $sMessage = "Folder source $sPathSoruce is not a directory";
                        $this->add_error($sMessage);
                    }
                }//foreach arFolders
            }
            else
            {
                $sMessage = "Folder source $sFolderName is not a directory";
                $this->add_error($sMessage);                
            }
        }
        else
        {
            $sMessage = "Folder target $sFolderName is not a directory";
            $this->add_error($sMessage);            
        }
    }
    
    private function fix_path_target(){if(!$this->sPathTarget && $this->sPathSource) $this->sPathTarget = $this->sPathSource;}
    
    
    public function compress($sPathSrcDirNoDS,$sPathFileZip)
    {
        if($oCursor = opendir($sPathSrcDirNoDS))  
        {
            $oZipArchive = new ZipArchive();
            //ZipArchive::CREATE
            if($oZipArchive->open($sPathFileZip,ZipArchive::CREATE)!==TRUE) 
            {
                $sMessage = "Cannot open $sPathFileZip";
                $this->add_error($sMessage);
                return;
            }
            
            //Recorro todo los archivos
            while(false !== ($sFileName = readdir($oCursor))) 
                $oZipArchive->addFile($sPathSrcDirNoDS.$sFileName);

            closedir($oCursor);
            $this->add_debug("numfiles: $oZipArchive->numFiles");
            $this->add_debug("status: $oZipArchive->status");
            $oZipArchive->close();
            $this->add_debug("Zip File: $sPathFileZip");
        }
    }
    
    
    //==================================
    //             SETS
    //==================================
    public function set_path_source($sValue){$this->sPathSource = $this->get_fixed_syspath($sValue);}
    public function set_path_target($sValue){$this->sPathTarget = $this->get_fixed_syspath($sValue);}
    
    public function set_folder($sFolderName){$this->arFolders = array();if(trim($sFolderName))$this->arFolders[]=$sFolderName;}
    public function add_folder($sFolderName){if(trim($sFolderName))$this->arFolders[]=$sFolderName;}
    public function set_files($sFileName){$this->arFiles = array();if(trim($sFileName))$this->arFiles[]=$sFileName;}
    public function add_files($sFileName){if(trim($sFileName))$this->arFiles[]=$sFileName;}

    public function set_zipname($sFileName){$this->arZipNames = array();if(trim($sFileName))$this->arZipNames[]=$sFileName;}
    public function add_zipname($sFileName){if(trim($sFileName))$this->arZipNames[]=$sFileName;}    
    
    //==================================
    //             GETS
    //==================================
    private function get_path_source($sFileFolder){ return $this->sPathSource.DIRECTORY_SEPARATOR.$sFileFolder;}
    private function get_path_target($sFileFolder){ return $this->sPathTarget.DIRECTORY_SEPARATOR.$sFileFolder;}
}