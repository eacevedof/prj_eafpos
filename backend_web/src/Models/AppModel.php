<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Models\AppModel 
 * @file AppModel.php 2.1.0
 * @date 28-06-2018 00:00 SPAIN
 * @observations
 */
namespace App\Models;

use TheFramework\Components\Db\ComponentMysql;
use TheFramework\Components\Db\ComponentCrud;

use App\Traits\ErrorTrait;
use App\Traits\LogTrait;

class AppModel 
{
    use ErrorTrait;
    use LogTrait;
    
    protected $oDb;
    protected $sTable;
    protected $arFields;
    protected $arPks;
    
    public function __construct(ComponentMysql $oDb=NULL) 
    {
        $this->oDb = $oDb;
        if(!$this->oDb)
            throw new \Exception("No ddbobject in AppModel");
    }
        
    public function query($sSQL,$iCol=NULL,$iRow=NULL)
    {
        $mxRet = $this->oDb->query($sSQL,$iCol=NULL,$iRow=NULL);
        if($this->oDb->is_error())
            $this->add_error($this->oDb->get_errors());
        return $mxRet;
    }
    
    public function execute($sSQL)
    {
        $mxRet = $this->oDb->exec($sSQL);
        //pr($this->oDb->get_errors(),"appmodel.execute");die;
        if($this->oDb->is_error())
            $this->add_error($this->oDb->get_errors());        
        return $mxRet;
    }    
    
    public function get_max($sField)
    {
        if($sField)
        {
            $sSQL = "SELECT MAX($sField) AS maxed FROM $this->sTable";
            $mxMaxed = $this->oDb->query($sSQL);
            $mxMaxed = (isset($mxMaxed[0]["maxed"])?$mxMaxed[0]["maxed"]:NULL);
            return $mxMaxed;
        }
        return NULL;
    }
    
    public function get_lastinsert_id()
    {
        return $this->oDb->get_lastid();
    }
    
    //$arPost = $_POST
    //busca los campos de form en el post y guarda sus valores
    //en los campos de bd
    protected function get_keyvals($arPost)
    {
        $arFieldsUi = array_keys($arPost);
        $arReturn = [];
        foreach($this->arFields as $arMap)
        {
            $sFieldDb = $arMap["db"];
            $sFieldUi = $arMap["ui"];
            if(in_array($sFieldUi,$arFieldsUi))
                $arReturn[$sFieldDb] = $arPost[$sFieldUi];
        }
        return $arReturn;
    }
    
    //hace un insert automatico a partir de lo que viene en $_POST
    public function insert($arPost,$isUi=1)
    {
        $arData = $arPost;
        if($isUi)
            $arData = $this->get_keyvals($arPost);
        
        //print_r($arData);die;
        if($arData)
        {
            //helper generador de consulta. 
            //se le inyecta el objeto de bd para que la ejecute directamente
            $oCrud = new ComponentCrud($this->oDb);
            $oCrud->set_table($this->sTable);
            foreach($arData as $sFieldName=>$sValue)
                $oCrud->add_insert_fv($sFieldName,$sValue);
            $oCrud->autoinsert();
            //print_r($oCrud);die;
            $this->log($oCrud->get_sql());
            if($oCrud->is_error())
                $this->add_error("An error occurred while trying to save");
            $this->log($oCrud->get_sql(),($oCrud->is_error()?"ERROR":NULL));
        }
    }//insert    

    private function get_pks($arData)
    {
        $arPks = [];
        foreach($arData as $sFieldName=>$sValue)
            if(in_array($sFieldName,$this->arPks))
                $arPks[$sFieldName] = $sValue;
        return $arPks;
    }
    
    private function get_no_pks($arData)
    {
        $arPks = [];
        foreach($arData as $sFieldName=>$sValue)
            if(!in_array($sFieldName,$this->arPks))
                $arPks[$sFieldName] = $sValue;
        return $arPks;
    }    
    
    public function update($arPost,$isUi=1)
    {
        $arData = $arPost;
        if($isUi)
            $arData = $this->get_keyvals($arPost);
        
        $arNoPks = $this->get_no_pks($arData);
        $arPks = $this->get_pks($arData);
        
        if($arData)
        {
            //habría que comprobar count(arPks)==count($this->arPks)
            $oCrud = new ComponentCrud($this->oDb);
            $oCrud->set_table($this->sTable);
            
            //valores del "SET"
            foreach($arNoPks as $sFieldName=>$sValue)
                $oCrud->add_update_fv($sFieldName,$sValue);
            
            //valores del WHERE 
            foreach($arPks as $sFieldName=>$sValue)
                $oCrud->add_pk_fv($sFieldName,$sValue);
            
            $oCrud->autoupdate();           
            if($oCrud->is_error())
                $this->add_error("An error occurred while trying to delete");  
            
            $this->log($oCrud->get_sql(),($oCrud->is_error()?"ERROR":NULL));
        }
    }//update
    
    public function delete($arPost)
    {
        $arData = $this->get_keyvals($arPost);
        $arPks = $this->get_pks($arData);
        if($arPks)
        {
            $oCrud = new ComponentCrud($this->oDb);
            $oCrud->set_table($this->sTable);
            foreach($arPks as $sFieldName=>$sValue)
                $oCrud->add_pk_fv($sFieldName,$sValue);
            $oCrud->autodelete();
            
            if($oCrud->is_error())
                $this->add_error("An error occurred while trying to delete");  
            
            $this->log($oCrud->get_sql(),($oCrud->is_error()?"ERROR":NULL));
        }
    }//delete
    
    /**
     * Se usa antes de borrar o actualizar
     * Se pasa el post y comprueba que existan todos los campos clave
     * @param array $arPost ["uifield"=>"value" ...]
     * @return boolean
     */
    public function is_pks_ok($arPost)
    {
        $arData = $this->get_keyvals($arPost);
        $arPks = $this->get_no_pks($arData);
        return (count($arPks)===count($this->arPks));
    }
        
    public function set_table($sTable){$this->sTable = $sTable;}
    public function add_pk($sFieldName){$this->arPks[] = $sFieldName;}
    public function set_pk($sFieldName){$this->arPks = []; $this->arPks[] = $sFieldName;}
}//AppModel
