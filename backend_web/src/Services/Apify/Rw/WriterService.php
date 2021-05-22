<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\Mysql
 * @file WriterService.php 1.0.0
 * @date 30-06-2019 12:42 SPAIN
 * @observations
 */
namespace App\Services\Apify\Rw;

use TheFramework\Components\Db\Context\ComponentContext;
use TheFramework\Components\Db\ComponentCrud;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;
use App\Services\Apify\SysfieldsService;

class WriterService extends AppService
{
    private $idContext;
    private $sDb;

    private $oContext;
    private $oBehav;
    
    private $arActions;
    private $action;

    public function __construct($idContext="",$sDbalias="")
    {
        //$this->logd($_POST,"write post");
        $this->idContext = $idContext;

        $this->oContext = new ComponentContext($this->get_env("APP_CONTEXTS"),$idContext);
        $this->sDb = $this->oContext->get_dbname($sDbalias);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext,$this->sDb);
        $this->oBehav = new SchemaBehaviour($oDb);
        $this->arActions = ["insert","update","delete","deletelogic","drop","alter"];
    }
        
    private function _get_parsed_tosql($arParams)
    {
        $sAction = $this->action;
        if(!isset($sAction)) return $this->add_error("_get_parsed_tosql no param action");
        if(!in_array($sAction,$this->arActions)) return $this->add_error("action: {$sAction} not found!");

        switch ($sAction) {
            case "insert":
                $this->_unset_sysfields($arParams,$sAction);
                $sSQL = $this->_get_insert_sql($arParams);
            break;
            case "update":
                $this->_unset_sysfields($arParams,$sAction);
                $sSQL = $this->_get_update_sql($arParams);
            break;   
            case "delete":
                $sSQL = $this->_get_delete_sql($arParams);
            break;
            case "deletelogic":
                $this->_unset_sysfields($arParams,$sAction);
                $sSQL = $this->__get_deletelogic_sql($arParams);
            break;
            default:
                return $this->add_error("_get_parsed_tosql","action: $sAction not implemented!");
        }
        return $sSQL;
    }

    private function _add_sysfields(ComponentCrud $oCrud, $arParams)
    {
        $issysfields = $arParams["autosysfields"] ?? 0;
        if($issysfields){
            $useruuid = $arParams["useruuid"];
            $sysfields = (new SysfieldsService($this->idContext, $this->sDb,$this->action,$useruuid))->get();
//$this->logd($sysfields,"_add_sysfields $this->action");
            foreach ($sysfields as $sysfield=>$value){
                if(in_array($this->action,["update","deletelogic"])) $oCrud->add_update_fv($sysfield, $value);
                if($this->action=="insert") $oCrud->add_insert_fv($sysfield, $value);
            }
        }
    }

    private function _unset_sysfields(&$arParams,$sAction)
    {
        $issysfields = $arParams["autosysfields"] ?? 0;
        if($issysfields)
        {
            switch ($sAction) {
                case "insert":
                    $arUnset = ["update_date", "update_user", "update_platform", "delete_date", "delete_user", "delete_platform"];
                    break;
                case "update":
                    $arUnset = ["insert_date", "insert_user", "insert_platform", "delete_date", "delete_user", "delete_platform"];
                    break;
                case "deletelogic":
                    $arUnset = ["insert_date", "insert_user", "insert_platform", "update_date", "update_user", "update_platform"];
                    break;
                default:
                    $arUnset = [];
            }

            foreach ($arUnset as $fieldname)
                if (isset($arParams["fields"][$fieldname]))
                    unset($arParams["fields"][$fieldname]);
        }
    }

    private function _get_insert_sql($arParams)
    {
//$this->logd($arParams,"_get_insert_sql.arparam");
        if(!isset($arParams["table"])) return $this->add_error("_get_insert_sql no table");
        if(!isset($arParams["fields"])) return $this->add_error("_get_insert_sql no fields");

        $oCrud = new ComponentCrud();
        $oCrud->set_table($arParams["table"]);
        foreach($arParams["fields"] as $sFieldName=>$sFieldValue)
            if($sFieldValue==="null")
                $oCrud->add_insert_fv($sFieldName,null,0);
            else
                $oCrud->add_insert_fv($sFieldName,$sFieldValue);

        $this->_add_sysfields($oCrud, $arParams);
        $oCrud->add_insert_fv("update_date",null,0);

        $oCrud->autoinsert();
        
        return $oCrud->get_sql();
    }

    private function _get_update_sql($arParams)
    {
//$this->logd($arParams,"_get_update_sql.arparam");
        if(!isset($arParams["table"])) return $this->add_error("_get_update_sql no table");
        if(!isset($arParams["fields"])) return $this->add_error("_get_update_sql no fields");
        //if(!isset($arParams["pks"])) return $this->add_error("_get_update_sql no pks");

        $oCrud = new ComponentCrud();
        $oCrud->set_table($arParams["table"]);

        foreach($arParams["fields"] as $sFieldName=>$sFieldValue)
            if($sFieldValue==="null")
                $oCrud->add_update_fv($sFieldName,null,0);
            else
                $oCrud->add_update_fv($sFieldName,$sFieldValue);

        $this->_add_sysfields($oCrud, $arParams);

        if(isset($arParams["pks"]))
            foreach($arParams["pks"] as $sFieldName=>$sFieldValue)
            {
                $oCrud->add_pk_fv($sFieldName,$sFieldValue);
            }

        if(isset($arParams["where"]))
            foreach($arParams["where"] as $sWhere)
            {
                $oCrud->add_and($sWhere);
            }

        $oCrud->autoupdate();
        $sSQL = $oCrud->get_sql();
        //pr($sSQL);die;
        return $sSQL;
    }//_get_update_sql

    private function _get_delete_sql($arParams)
    {
        if(!isset($arParams["table"])) return $this->add_error("_get_delete_sql no table");

        $oCrud = new ComponentCrud();
        $oCrud->set_table($arParams["table"]);
        if(isset($arParams["where"]))
            foreach($arParams["where"] as $sWhere)
            {
                $oCrud->add_and($sWhere);
            }        
        $oCrud->autodelete();
        $sSQL = $oCrud->get_sql();
        
        return $sSQL;      
    }//_get_delete_sql

    private function __get_deletelogic_sql($arParams)
    {
        if(!isset($arParams["table"])) return $this->add_error("__get_deletelogic_sql no table");

        $oCrud = new ComponentCrud();
        $oCrud->set_table($arParams["table"]);
        $this->_add_sysfields($oCrud, $arParams);

        $oCrud->add_update_fv("delete_platform",$arParams["fields"]["delete_platform"]);
        //como el registro tiene el trigger del update si quiero marcar el softdelete tambien actualizaría el update_date
        //si paso en formato de tags obligo que el update_date=update_date es decir se mantenga el update_date anterior
        $oCrud->add_update_fv("update_date","%%update_date%%",0);

        if(isset($arParams["pks"]))
            foreach($arParams["pks"] as $sFieldName=>$sFieldValue)
            {
                $oCrud->add_pk_fv($sFieldName,$sFieldValue);
            }

        if(isset($arParams["where"]))
            foreach($arParams["where"] as $sWhere)
            {
                $oCrud->add_and($sWhere);
            }

        $oCrud->autoupdate();
        $sSQL = $oCrud->get_sql();
        //pr($sSQL);die;
        return $sSQL;
    }//__get_deletelogic_sql

//==================================
//      PUBLIC
//==================================
    public function write_raw($sSQL)
    {
        if(!$sSQL) return [];
        if(!$this->isError)
        {
            $r = $this->oBehav->write_raw($sSQL);
            if($this->oBehav->is_error())
                $this->add_error($this->oBehav->get_errors());
            return $r;
        }
        return -1;
    }
    
    public function write($arParams)
    {
        $sAction = $this->action;
        $sSQL = $this->_get_parsed_tosql($arParams,$sAction);
        //print_r($sSQL);die;
        return $this->write_raw($sSQL);
    }

    public function get_lastinsert_id(){return $this->oBehav->get_lastinsert_id();}

    public function set_action($action){$this->action = $action; return $this;}
    
}//WriterService
