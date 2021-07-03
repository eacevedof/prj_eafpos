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

use PHPUnit\Runner\Exception;
use TheFramework\Components\Db\Context\ComponentContext;
use TheFramework\Components\Db\ComponentCrud;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;
use App\Services\Apify\SysfieldsService;

final class WriterService extends AppService
{
    private const USER_UUID_KEY = "useruuid";
    private const ACTIONS = ["insert", "update", "delete", "deletelogic", "drop", "alter"];

    private array $fields;

    private string $idcontext;
    private string $dbname;

    private $oContext;
    private $oBehav;
    
    private string $action;

    public function __construct(string $idcontext="", string $dbalias="", string $table="")
    {
        if(!$idcontext) throw new Exception("No context provided");
        if(!$dbalias) throw new Exception("No db-alias received");
        if(!$table) throw new Exception("No table received");

        $this->idcontext = $idcontext;

        $this->oContext = new ComponentContext($this->get_env("APP_CONTEXTS"), $idcontext);
        $this->dbname = $this->oContext->get_dbname($dbalias);
        $db = DbFactory::get_dbobject_by_ctx($this->oContext, $this->dbname);
        $this->oBehav = new SchemaBehaviour($db);
        $this->fields = array_column($this->oBehav->get_fields($table, $this->dbname),"field_name");
    }
        
    private function _get_parsed_tosql(array $arParams)
    {
        if(!in_array($action = $this->action, self::ACTIONS)) 
            return $this->add_error("action: {$action} not found!");

        switch ($action) {
            case "insert":
                $this->_unset_sysfields($arParams, $action);
                $sql = $this->_get_insert_sql($arParams);
            break;
            case "update":
                $this->_unset_sysfields($arParams, $action);
                $sql = $this->_get_update_sql($arParams);
            break;   
            case "delete":
                $sql = $this->_get_delete_sql($arParams);
            break;
            case "deletelogic":
                $this->_unset_sysfields($arParams, $action);
                $sql = $this->__get_deletelogic_sql($arParams);
            break;
            default:
                return $this->add_error("_get_parsed_tosql","action: $action not implemented!");
        }
        return $sql;
    }

    private function _add_sysfields(ComponentCrud $oCrud, $arParams): void
    {
        if(!$table = $arParams["table"]) return;
        if(!($arParams["autosysfields"] ?? false)) return;

        $sysfields = (
            new SysfieldsService($table, $this->idcontext, $this->dbname, $this->action, $arParams[self::USER_UUID_KEY])
        )->get();

        foreach ($sysfields as $sysfield=>$value)
        {
            if(in_array($this->action, ["update", "deletelogic"]))
                $oCrud->add_update_fv($sysfield, $value);
            if($this->action==="insert")
                $oCrud->add_insert_fv($sysfield, $value);
        }
    }

    /**
     * elimina posibles escrituras directas en otros campos
     * @param $arParams
     * @param $action
     */
    private function _unset_sysfields(&$arParams, $action)
    {
        $issysfields = $arParams["autosysfields"] ?? 0;
        if($issysfields)
        {
            switch ($action) {
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
        if(!isset($arParams["table"])) return $this->add_error("_get_insert_sql no table");
        if(!isset($arParams["fields"])) return $this->add_error("_get_insert_sql no fields");

        $oCrud = new ComponentCrud();
        $oCrud->set_comment(str_replace(["*","/",],"",trim($arParams["comment"])));
        $oCrud->set_table($arParams["table"]);
        foreach($arParams["fields"] as $sFieldName=>$sFieldValue)
            if($sFieldValue==="null")
                $oCrud->add_insert_fv($sFieldName,null,0);
            else
                $oCrud->add_insert_fv($sFieldName,$sFieldValue);

        $this->_add_sysfields($oCrud, $arParams);
        if(in_array("update_date",$this->fields))
            $oCrud->add_insert_fv("update_date",null,0);

        $oCrud->autoinsert();
        
        return $oCrud->get_sql();
    }

    private function _get_update_sql($arParams)
    {
        if(!isset($arParams["table"])) return $this->add_error("_get_update_sql no table");
        if(!isset($arParams["fields"])) return $this->add_error("_get_update_sql no fields");
        //if(!isset($arParams["pks"])) return $this->add_error("_get_update_sql no pks");

        $oCrud = new ComponentCrud();
        $oCrud->set_comment(str_replace(["*","/",],"",$arParams["comment"]));
        $oCrud->set_table($arParams["table"]);

        foreach($arParams["fields"] as $sFieldName=>$sFieldValue)
            if($sFieldValue==="null")
                $oCrud->add_update_fv($sFieldName,null,0);
            else
                $oCrud->add_update_fv($sFieldName,$sFieldValue);

        $this->_add_sysfields($oCrud, $arParams);

        if(isset($arParams["pks"]))
            foreach($arParams["pks"] as $sFieldName=>$sFieldValue)
                $oCrud->add_pk_fv($sFieldName,$sFieldValue);


        if(isset($arParams["where"]))
            foreach($arParams["where"] as $sWhere)
                $oCrud->add_and($sWhere);


        $oCrud->autoupdate();
        $sql = $oCrud->get_sql();
        //pr($sql);die;
        return $sql;
    }//_get_update_sql

    private function _get_delete_sql($arParams)
    {
        if(!isset($arParams["table"])) return $this->add_error("_get_delete_sql no table");

        $oCrud = new ComponentCrud();
        $oCrud->set_comment(str_replace(["*","/",],"",$arParams["comment"]));
        $oCrud->set_table($arParams["table"]);
        if(isset($arParams["where"]))
            foreach($arParams["where"] as $sWhere)
            {
                $oCrud->add_and($sWhere);
            }        
        $oCrud->autodelete();
        $sql = $oCrud->get_sql();
        
        return $sql;      
    }//_get_delete_sql

    private function __get_deletelogic_sql($arParams)
    {
        if(!isset($arParams["table"])) return $this->add_error("__get_deletelogic_sql no table");

        $oCrud = new ComponentCrud();
        $oCrud->set_comment(str_replace(["*","/",],"",$arParams["comment"]));
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
        $sql = $oCrud->get_sql();
        //pr($sql);die;
        return $sql;
    }//__get_deletelogic_sql

//==================================
//      PUBLIC
//==================================
    public function write_raw($sql)
    {
        if(!$sql) return [];
        if(!$this->isError)
        {
            $r = $this->oBehav->write_raw($sql);
            if($this->oBehav->is_error())
                $this->add_error($this->oBehav->get_errors());
            return $r;
        }
        return -1;
    }
    
    public function write($arParams)
    {
        $sql = $this->_get_parsed_tosql($arParams, $this->action);
        return $this->write_raw($sql);
    }

    public function get_lastinsert_id(){return $this->oBehav->get_lastinsert_id();}

    public function set_action($action){$this->action = $action; return $this;}
}//WriterService
