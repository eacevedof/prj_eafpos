<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\Mysql
 * @file SysfieldsService.php 1.0.0
 * @date 27-06-2019 17:55 SPAIN
 * @observations
 */
namespace App\Services\Apify;

use TheFramework\Components\Db\Context\ComponentContext;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;

class SysfieldsService extends AppService
{
    private $usertable = "base_user";
    private $useruuidfield = "code_cache";

    private $useruuid = "";
    private $action = "";
    private $sDb;

    public function __construct($idContext="",$sDb="", $action="", $useruuid="")
    {
        $this->idContext = $idContext;
        $this->sDb = $sDb;
        $this->action = $action;
        $this->useruuid = $useruuid;

        $this->oContext = new ComponentContext($_ENV["APP_CONTEXTS"],$idContext);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext, $sDb);
        $this->oBehav = new SchemaBehaviour($oDb);
    }
        
    private function _get_allfields()
    {
        $allfields = $this->oBehav->get_fields($this->usertable, $this->sDb);
        if(!$allfields) return [];
        return array_column($allfields,"field_name");
    }

    private function _get_table_user()
    {
        return $this->oBehav->get_table($this->usertable, $this->sDb);
    }

    private function _get_userid()
    {
        //no se está suministrando el
        if($this->useruuid==="null") return null;
        $sql = "SELECT id FROM $this->usertable WHERE $this->useruuidfield='$this->useruuid'";
        //lg($sql,"ssqqll");
        $id = $this->oBehav->query($sql,0,0);
        if(!$id) $id = null;
        return $id;
    }

    private function _get_platform(){}

    private function _get_autofilled()
    {
        $action = $this->action;
        if($action==="deletelogic") $action = "delete";
        $fields = [
            "{$action}_date" => date("YmdHis"),
            "{$action}_user" => $this->_get_userid(),
        ];

        if($action==="insert")
            //fields[code_cache] = uuid
            $fields[$this->useruuidfield] = $this->_get_uuid();

        //if($action==="deletelogic")  $fields["update_date"] = "field-self";

        return $fields;
    }
    
    private function _get_sysfields()
    {
        $action = $this->action;
        if($action==="deletelogic") $action = "delete";
        $fields = [
            "{$action}_date", "{$action}_user"
        ];

        if($action === "insert") $fields[] = $this->useruuidfield;
        return $fields;
    }

    private function _get_uuid() {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for "time_low"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            // 16 bits for "time_mid"
            mt_rand( 0, 0xffff ),
            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand( 0, 0x0fff ) | 0x4000,
            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand( 0, 0x3fff ) | 0x8000,
            // 48 bits for "node"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }

    private function _exist_sysfields()
    {
        $allfields = $this->_get_allfields();
        $sysfields = $this->_get_sysfields();
//$this->logd($allfields,"allfields");
//$this->logd($sysfields,"sysfields");
        foreach ($sysfields as $sysfield)
            if(!in_array($sysfield, $allfields)) {
//$this->logd("not in array $sysfield");
                return false;
            }
        return true;
    }

    private function _isvalid()
    {
//$this->logd("isvalid $this->action");
        if(!$this->action) return false;
        if(!$this->_get_table_user()) return false;
        if(!$this->_exist_sysfields()) return false;
//$this->logd("isvalid end");
        return true;
    }

    public function get()
    {
        if(!$this->_isvalid()) return [];

        switch ($this->action){
            case "insert":
            case "update":
            case "deletelogic":
                return $this->_get_autofilled();
            break;
            default:
                return [];
        }
    }
    
}//SysfieldsService
