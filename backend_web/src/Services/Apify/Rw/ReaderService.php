<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\Mysql
 * @file ReaderService.php 1.0.0
 * @date 27-06-2019 17:55 SPAIN
 * @observations
 */
namespace App\Services\Apify\Rw;

use TheFramework\Components\Db\Context\ComponentContext;
use TheFramework\Components\Db\ComponentCrud;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;
use App\Traits\CacheQueryTrait;
use \Exception;

final class ReaderService extends AppService
{
    use CacheQueryTrait;

    private $idcontext;
    private $dbname;
    
    private $oContext;
    private $oBehav;
    private string $sql;
    private int $foundrows;
    private float $cachettl = 0;
    private string $maintable = "";

    public function __construct(string $idcontext="", string $dbalias="")
    {
        $this->idcontext = $idcontext;

        if(!$this->idcontext) return $this->add_error("Error in context: $idcontext");
        $this->oContext = new ComponentContext($_ENV["APP_CONTEXTS"], $idcontext);
        $this->dbname = $this->oContext->get_dbname($dbalias);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext, $this->dbname);
        if($oDb->is_error()) return $this->add_error($oDb->get_errors());

        $this->oBehav = new SchemaBehaviour($oDb);
    }
    
    private function _get_parsed_tosql($arParams)
    {
        if(!isset($arParams["table"])) throw new Exception("_get_parsed_tosql no table");
        if(!isset($arParams["fields"]) || !is_array($arParams["fields"])) throw new Exception("_get_parsed_tosql no array fields");;

        $crud = new ComponentCrud();
        if($arParams["comment"] ?? "") $crud->set_comment($arParams["comment"]);

        $crud->set_table($this->maintable = $arParams["table"]);
        if(isset($arParams["distinct"])) $crud->is_distinct($arParams["distinct"]);
        if(isset($arParams["foundrows"])) $crud->is_foundrows($arParams["foundrows"]);

        $crud->set_getfields($arParams["fields"]);
        $crud->set_joins($arParams["joins"] ?? []);
        $crud->set_and($arParams["where"] ?? []);
        $crud->set_groupby($arParams["groupby"] ?? []);
        $crud->set_having($arParams["having"] ?? []);

        $arTmp = [];
        if(isset($arParams["orderby"]))
        {
            foreach($arParams["orderby"] as $sField)
            {
                $arField = explode(" ",trim($sField));
                $arTmp[$arField[0]] = $arField[1] ?? "ASC";
            }
        }
        $crud->set_orderby($arTmp);

        if(isset($arParams["limit"]["perpage"]))
            $crud->set_limit($arParams["limit"]["perpage"] ?? 1000,$arParams["limit"]["regfrom"]??0);

        $crud->get_selectfrom();
        $sql =  $crud->get_sql();
        return $sql;
    }

    public function read_raw($sql): array
    {
        if(!$sql) return [];
        $this->sql = $sql;

        if($ttl = $this->cachettl) {
            if($r = $this->get_cached($sql, $this->maintable)) {
                $this->foundrows = $this->get_cachedcount($sql, $this->maintable);
                return $r;
            }
        }

        $r = $this->oBehav->read_raw($sql);
        $this->foundrows = $this->oBehav->get_foundrows();
        if($this->oBehav->is_error()) {
            if($ttl) $this->delete_all($sql, $this->maintable);
            $this->logerr($errors = $this->oBehav->get_errors(),"readservice.read_raw");
            $this->add_error($errors);
            return $r;
        }

        if($ttl) {
            $this->addto_cache($sql, $r, $ttl, $this->maintable);
            $this->addto_cachecount($sql, $this->foundrows, $ttl, $this->maintable);
        }
        return $r;
    }
    
    public function get_read($arParams)
    {
        if(!$arParams) {
            $this->logerr($error = "get_read no params","readservice.get_read");
            return $this->add_error($error);
        }

        $this->cachettl = (int) $arParams["cache_time"] ?? 0;
        $sql = $this->_get_parsed_tosql($arParams);
        $this->sql = $sql;
        $r = $this->read_raw($sql);
        return $r;
    }

    public function get_foundrows(){return $this->foundrows;}

}//ReaderService
