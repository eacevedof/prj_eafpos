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
    
    private function _get_parsed_tosql(array $qparams): string
    {
        if(!isset($qparams["fields"]) || !is_array($qparams["fields"]))
            $this->_exeption("invalid or empty fields in read params");

        $crud = new ComponentCrud();
        if($qparams["comment"] ?? "") $crud->set_comment($qparams["comment"]);

        $crud->set_table($this->maintable = $qparams["table"]);
        if(isset($qparams["distinct"])) $crud->is_distinct($qparams["distinct"]);
        if(isset($qparams["foundrows"])) $crud->is_foundrows($qparams["foundrows"]);

        $crud->set_getfields($qparams["fields"]);
        $crud->set_joins($qparams["joins"] ?? []);
        $crud->set_and($qparams["where"] ?? []);
        $crud->set_groupby($qparams["groupby"] ?? []);
        $crud->set_having($qparams["having"] ?? []);

        $arTmp = [];
        if(isset($qparams["orderby"]))
        {
            foreach($qparams["orderby"] as $sField)
            {
                $arField = explode(" ",trim($sField));
                $arTmp[$arField[0]] = $arField[1] ?? "ASC";
            }
        }
        $crud->set_orderby($arTmp);

        if(isset($qparams["limit"]["perpage"]))
            $crud->set_limit($qparams["limit"]["perpage"] ?? 1000,$qparams["limit"]["regfrom"]??0);

        $crud->get_selectfrom();
        $sql =  $crud->get_sql();
        return $sql;
    }

    public function read_raw(string $sql): array
    {
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
    
    public function get_read($qparams)
    {
        if(!is_array($qparams)) $this->_exeption("read params is not an array");
        if(!$table = trim($qparams["table"])) $this->_exeption("missing read table");

        $this->maintable = explode(" ", $table)[0];
        $this->cachettl = (int) $qparams["cache_time"] ?? 0;
        $sql = $this->_get_parsed_tosql($qparams);
        $r = $this->read_raw($sql);
        return $r;
    }

    public function get_foundrows(){return $this->foundrows;}

}//ReaderService
