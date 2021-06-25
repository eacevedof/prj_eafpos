<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 2.0.0
 * @name ComponentImage
 * @date 30-06-2019 09:40 (SPAIN)
 * @file component_image.php
 * @requires:
 * 
 */
class ComponentImage 
{
    protected $arExtensions = array("jpg","png","jpeg","gif","tiff","tif","bmp");
    protected $sPathFolderTarget;
    protected $sPathFolderSource;    
    
    protected $sFilenameSource;
    protected $sFilenameTarget;
    protected $sExtensionSource;
    protected $sExtensionTarget;
    protected $sTargetContent;

    protected $sPathFileSource;
    protected $sPathFileTarget;
    
    protected $arThumbSizes;
    protected $arThumbExtensions;
    
    protected $iHeight;
    protected $iWidth;
    protected $iBitsSize;
    protected $sPathsourceHttp;
    
    //META DATA
    protected $sMetaFilename;
    protected $sMetaFileDatetime;
    protected $sMetaFilesize;
    protected $sMetaFiletype;
    protected $sMetaMimetype;
    protected $sMetaSections;
    protected $sMetaHtml;
    protected $iMetaHeight;
    protected $iMetaWidth;
    protected $isMetaColor;
    protected $sMetaComment;
    
    public function __construct()
    {
        ;
    }
    
    protected function load_path_source()
    {
        $this->sPathFileSource = $this->build_filepath();
    }
    
    protected function load_path_target()
    {
        $this->sPathFileTarget = $this->build_filepath(0);
    }
    
    public function load_target_size()
    {
        $sPathFile = $this->build_filepath(0);
        $arSize = getimagesize($sPathFile);
        $this->iWidth = $arSize[0];
        $this->iHeight = $arSize[1];
    }
    
    public function load_target_bytessize()
    {
        $sPathFile = $this->build_filepath(0);
        $this->iBitsSize = filesize($sPathFile);
    }
    
    private function load_metadata($arMetaData)
    {
        $this->sMetaComment = $arMetaData["COMPUTED"]["UserComment"];
        $this->sMetaHtml = $arMetaData["COMPUTED"]["html"];
        $this->iMetaHeight = $arMetaData["COMPUTED"]["Width"];
        $this->iMetaHeight = $arMetaData["COMPUTED"]["Height"];
        $this->isMetaColor = $arMetaData["COMPUTED"]["IsColor"];
        $this->sMetaMimetype = $arMetaData["FILE"]["MimeType"];
        $this->sMetaFiletype = $arMetaData["FILE"]["FileType"];
        $this->sMetaFilesize = $arMetaData["FILE"]["FileSize"];
        $this->sMetaFilename = $arMetaData["FILE"]["FileName"];
        $this->sMetaFileDatetime = $arMetaData["FILE"]["FileDateTime"];
        $this->sMetaSections = $arMetaData["FILE"]["SectionsFound"];        
    }
    
    public function load_target_metadata()
    {
        $sPathFile = $this->build_filepath(0);
        $arMetaData = exif_read_data($sPathFile,0,true);
        $this->load_metadata($arMetaData);
    }
    
    public function load_source_metadata()
    {
        //sin argumentos carga source
        $sPathFile = $this->build_filepath();
        $arMetaData = exif_read_data($sPathFile,0,true);
        $this->load_metadata($arMetaData);        
    }

    protected function build_image_resized($oImgToResize,$iWidth,$iHeight)
    {
        $oImageCanvas = imagecreatetruecolor($iWidth,$iHeight);
        $iSrcWidth = imagesx($oImgToResize);
        $iSrcHeight = imagesy($oImgToResize);
        //imagecopyresized($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h)
        //imagecopyresized($oImageCanvas,$oImgToResize,0,0,0,0,$iWidth,$iHeight,$iSrcWidth,$iSrcHeight);
        imagecopyresampled($oImageCanvas,$oImgToResize,0,0,0,0,$iWidth,$iHeight,$iSrcWidth,$iSrcHeight);
        return $oImageCanvas;
    }
    
    protected function build_image_cut($oImgToCut,$iWidth,$iHeight)
    {
        //$dst_x, $dst_y: Empezar a escribir en el lienzo desde
        $oImageCanvas = imagecreatetruecolor($iWidth,$iHeight);
        $iSrcWidth = imagesx($oImgToCut);
        $iSrcHeight = imagesy($oImgToCut);
        //imagecopyresampled($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);
        //imagecopyresampled($oImageCanvas,$oImgToCut,0,0,100,0,$iWidth,$iHeight,$iSrcWidth,$iSrcHeight);
        //imagecopy($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h)
        imagecopy($oImageCanvas,$oImgToCut,0,0,0,0,$iSrcWidth,$iSrcHeight);
        return $oImageCanvas;
    }
    
    protected function get_percent($iCurrSize,$iFinalSize)
    {
        //x=fS.100/cS
        $fPercent = NULL;
        if($iCurrSize!=0)
            //$iPercent = floor(100*($iBig-$iSmall)/$iBig);
            //$iPercent = floor(($iFinalSize*100/$iCurrSize));
            $fPercent = ($iFinalSize*100/$iCurrSize);
        return $fPercent;
    }
    
    protected function get_adjusted_length($iLength,$iPercent)
    {
        return ($iPercent*$iLength)/100;
    }
    
    public function make_thumb() 
    {
        $this->load_path_source();
        $this->load_path_target();
        
        if(!$this->iWidth) $this->iWidth = 0;
        if(!$this->iHeight) $this->iHeight = 0;
        
        $sExtension = $this->get_extension($this->sPathFileSource);
        if($sExtension=="jpg" || $sExtension=="jpeg")
            $oSrcImage = imagecreatefromjpeg($this->sPathFileSource);
        elseif($sExtension=="png")
            $oSrcImage = imagecreatefrompng($this->sPathFileSource);
        elseif($sExtension=="bmp")
            $oSrcImage = imagecreatefromwbmp($this->sPathFileSource);        
        elseif($sExtension=="gif")
            $oSrcImage = imagecreatefromgif($this->sPathFileSource);
        //imagecreatefrompng($filename)
        //bug($oSrcImage,"osourceimage");
        $iSrcWidth = imagesx($oSrcImage);
        $iSrcHeight = imagesy($oSrcImage);
        //bug($this->sPathFileSource,"source");bug($this->sPathFileTarget,"target");
        $oImageCut = NULL;
        //caso 1
        if($iSrcWidth>$this->iWidth || $iSrcHeight>$this->iHeight)
        {
            $fPerWidth = $this->get_percent($iSrcWidth,$this->iWidth);
            $fPerHeight = $this->get_percent($iSrcHeight,$this->iHeight);
            
            $fPerAdjust = $fPerWidth;
            if($fPerHeight>$fPerWidth) $fPerAdjust = $fPerHeight;
            
            $iTempWidth = $this->get_adjusted_length($iSrcWidth,$fPerAdjust);
            $iTempHeight = $this->get_adjusted_length($iSrcHeight,$fPerAdjust);
            
            //bug("fW:$this->iWidth,fW:$this->iHeight,srcW:$iSrcWidth,srcH:$iSrcHeight|perW:$fPerWidth,perH:$fPerHeight,perAdj:$fPerAdjust|tmpWidth:$iTempWidth,tmpHeight:$iTempHeight");
            $oImageCut = $this->build_image_resized($oSrcImage,$iTempWidth,$iTempHeight);
            $oImageCut = $this->build_image_cut($oImageCut,$this->iWidth,$this->iHeight);
        }
        //bug("isrch:$iSrcHeight,isrcw:$iSrcWidth,thisw:$this->iWidth,thish:$this->iHeight");
        if($oImageCut)
        {    
            //bug($oImageCut,"oImagecut");
            $isCreated = $this->create_image_by_extension($oImageCut,$this->sPathFileTarget,$sExtension);
     //       header('Content-Type: image/jpeg');
    //imagejpeg($oImageCut);
            //bug($isCreated,"make_thumb");
            if(!$isCreated) $this->add_error("Error: Thumb not created");
        }
        else
            $this->add_error("Error: No image cut to create thumb");
    }//make_thumb()
    
    protected function create_image_by_extension($oImage,$sPathFileTarget,$sExtension)
    {
        $sIsCreated = FALSE;
        $sExtension = strtolower(trim($sExtension));
        //bug($sExtension,"create_image_by_extension");
        //array("jpg","png","jpeg","gif","tiff","tif","bmp");
        switch($sExtension) 
        {
            case "jpg":
            case "jpeg":
            case "tiff":
            case "tif":                
                $sIsCreated = imagejpeg($oImage,$sPathFileTarget,100);
            break;
            case "png":
                $sIsCreated = imagepng($oImage,$sPathFileTarget,0);
                //bug($oImage,"oimage");bug($sPathFileTarget,"targetfile");bug($sIsCreated,"iscreated");die;
            break;
            case "gif":
                $sIsCreated = imagegif($oImage,$sPathFileTarget);
            break;
            case "bmp":
                $sIsCreated = image2wbmp($oImage,$sPathFileTarget);
            break;        
            default:
                $sIsCreated = imagejpeg($oImage,$sPathFileTarget,100);
            break;
        }
        return $sIsCreated;
    }
    
    
    protected function load_source_extension()
    {
        $arPathInfo = pathinfo($this->sFilenameSource);
        $sExtension = $sExtension = $arPathInfo["extension"];
        $this->clean_extension($sExtension);
        $this->sExtensionSource = $sExtension;
    }
    
    protected function load_target_extension()
    {
        $arPathInfo = pathinfo($this->sFilenameTarget);
        $sExtension = $sExtension = $arPathInfo["extension"];
        $this->clean_extension($sExtension);
        $this->sExtensionSource = $sExtension;
    }    
    
    protected function clean_extension(&$sExtension)
    {
        foreach($this->arExtensions as $sExt)
            if(strstr($sExtension,$sExt))
            {
                $sExtension = $sExt;
                return;
            }
        $sExtension = "txt";
    }
    
    private function fix_folderpath($sPathFolder)
    {
        $sPathFolderDs = $sPathFolder.DIRECTORY_SEPARATOR;
        //windows (cambia los dobles por uno solo)
        $sPathFolderDs = str_replace("\\\\",DIRECTORY_SEPARATOR,$sPathFolderDs);
        //unix 
        $sPathFolderDs = str_replace("//",DIRECTORY_SEPARATOR, $sPathFolderDs);
        return $sPathFolderDs;
    }    
    
    private function build_filepath($isSource=1)
    {
        $sPathFile = "";
        if($isSource)
        {
            $sPathFolder = $this->fix_folderpath($this->sPathFolderSource);
            $sPathFile = $sPathFolder.$this->sFilenameSource; 
            if($this->sPathsourceHttp) 
                $sPathFile = $this->sPathsourceHttp;
        }
        else
        {
            $sPathFolder = $this->fix_folderpath($this->sPathFolderTarget);
            $sPathFile = $sPathFolder.$this->sFilenameTarget;            
        }
        return $sPathFile;
    }
    
    protected function get_extension($sPathFile)
    {
        $sExtension = "";
        if(is_file($sPathFile))
        {
            $arPathInfo = pathinfo($sPathFile);
            $sExtension = $arPathInfo["extension"];
            $this->clean_extension($sExtension);
        }
        else
            $sExtension = "no_extension_nofile";
        return $sExtension;
    }
    
    //==================================
    //             SETS
    //==================================
    public function set_filename_source($sFileName){$this->sFilenameSource = $sFileName; $this->load_source_extension();}
    public function set_filename_target($sFileName){$this->sFilenameTarget = $sFileName; $this->load_target_extension();}
    public function set_path_folder_source($sPathFolder){$this->sPathFolderSource = $sPathFolder;}
    public function set_path_folder_target($sPathFolder){$this->sPathFolderTarget = $sPathFolder;}
    public function set_target_content($sContent){$this->sTargetContent = $sContent;}   
    
    public function set_pathsource_http($value){$this->sPathsourceHttp = $value;}
    public function set_meta_filename($value){$this->sMetaFilename = $value;}
    public function set_meta_filedatetime($value){$this->sMetaFileDatetime = $value;}
    public function set_meta_filesize($value){$this->sMetaFilesize = $value;}
    public function set_meta_filetype($value){$this->sMetaFiletype = $value;}
    public function set_meta_mimetype($value){$this->sMetaMimetype = $value;}
    public function set_meta_sections($value){$this->sMetaSections = $value;}
    public function set_meta_html($value){$this->sMetaHtml = $value;}
    public function set_meta_height($value){$this->iMetaHeight = $value;}
    public function set_meta_width($value){$this->iMetaWidth = $value;}
    public function set_is_meta_color($value){$this->isMetaColor = $value;}
    public function set_meta_content($value){$this->sMetaComment = $value;}
    public function set_width($value){$this->iWidth = $value;}
    public function set_height($value){$this->iHeight = $value;}

    //==================================
    //             GETS
    //==================================   
    public function get_width(){return $this->iWidth;}
    public function get_height(){return $this->iHeight;}
    public function get_pathsource_http(){return $this->sPathsourceHttp;}
    public function get_meta_filename(){return $this->sMetaFilename;}
    public function get_meta_filedatetime(){return $this->sMetaFileDatetime;}
    public function get_meta_filesize(){return $this->sMetaFilesize;}
    public function get_meta_filetype(){return $this->sMetaFiletype;}
    public function get_meta_mimetype(){return $this->sMetaMimetype;}
    public function get_meta_sections(){return $this->sMetaSections;}
    public function get_meta_html(){return $this->sMetaHtml;}
    public function get_meta_height(){return $this->iMetaHeight;}
    public function get_meta_width(){return $this->iMetaWidth;}
    public function get_is_meta_color(){return $this->isMetaColor;}
    public function get_meta_content(){return $this->sMetaComment;}
    public function get_bytes_size(){return $this->iBitsSize;}
    
    public function get_source_extension(){return $this->sExtensionSource;}
    public function get_target_extension(){return $this->sExtensionTarget;}

}