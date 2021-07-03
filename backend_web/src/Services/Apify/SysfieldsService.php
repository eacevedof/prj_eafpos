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

use App\Traits\CacheQueryTrait;
use TheFramework\Components\Db\Context\ComponentContext;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;

final class SysfieldsService extends AppService
{
    use CacheQueryTrait;

    private const USER_TABLE = "base_user";
    private const USER_UUID_FIELD = "code_cache";

    private string $targettable;
    private string $codecachevalue;
    private string $action;
    private string $dbname;
    private $oBehav;

    private const ACTION_INSERT = "insert";
    private const ACTION_UPDATE = "update";
    private const ACTION_DELETE = "deletelogic";

    private const INSERT_FIELDS = ["insert_user","insert_date","insert_platform","code_cache"];
    private const UPDATE_FIELDS = ["update_user","update_date","update_platform"];
    private const DELETE_FIELDS = ["delete_user","delete_date","delete_platform"];
    
    public function __construct(
        string $targettable, string $idContext="", string $dbname="", string $action="", ?string $codecache=""
    )
    {
        $this->targettable = $targettable;
        $this->dbname = $dbname;
        $this->action = $action;
        $this->codecachevalue = str_replace(["'","%"," "],"",$codecache??"");

        $ctx = new ComponentContext($_ENV["APP_CONTEXTS"], $idContext);
        $oDb = DbFactory::get_dbobject_by_ctx($ctx, $dbname);
        $this->oBehav = new SchemaBehaviour($oDb);
    }
    
    private function _get_table_user(): array
    {
        return $this->oBehav->get_table(self::USER_TABLE, $this->dbname);
    }

    private function _get_target_fields(): array
    {
        return array_column($this->oBehav->get_fields($this->targettable, $this->dbname),"field_name");
    }

    private function _get_userid_from_db(): ?string
    {
        $table = self::USER_TABLE;
        $field = self::USER_UUID_FIELD;
        if(!$this->codecachevalue || $this->codecachevalue==="null") return null;
        $sql = "/*_get_userid_from_db*/ SELECT id FROM $table WHERE $field='$this->codecachevalue'";
        if($id = $this->get_cachedsingle($sql)) return $id;

        $id = $this->oBehav->query($sql,0,0);
        $this->addto_cachesingle($sql, $id, 3600);

        if(!$id) return null;
        return $id;
    }

    private function _get_sysfields_by_action(): array
    {
        switch ($this->action)
        {
            case self::ACTION_INSERT:
                return self::INSERT_FIELDS;
            case self::ACTION_UPDATE:
                return self::UPDATE_FIELDS;
            case self::ACTION_DELETE:
                return self::DELETE_FIELDS;
        }
    }

    private function _get_platform(): string { return ""; }

    private function _get_autofilled(): array
    {
        $finalfields = $this->_get_final_fields();
        foreach ($finalfields as $fieldname => $value) 
        {
            if(strstr($fieldname,"_date"))
                $finalfields[$fieldname] = date("YmdHis");

            if(strstr($fieldname,"_user"))
                $finalfields[$fieldname] = $this->_get_table_user() ? $this->_get_userid_from_db(): "-1";

            if(strstr($fieldname,"_platform"))
                $finalfields[$fieldname] = $this->_get_platform();

            if($fieldname === self::USER_UUID_FIELD)
                $finalfields[$fieldname] = uniqid();
        }
        return $finalfields;
    }

    private function _get_final_fields(): array
    {
        $allfields = $this->_get_target_fields();
        $sysfields = $this->_get_sysfields_by_action();

        $final = [];
        foreach ($sysfields as $sysfield)
        {
            if(in_array($sysfield, $allfields))
                $final[$sysfield] = "";
        }
        return $final;
    }

    public function get(): array
    {
        if(!in_array($this->action, [self::ACTION_INSERT, self::ACTION_UPDATE, self::ACTION_DELETE])) return [];
        return $this->_get_autofilled();
    }
    
}//SysfieldsService
