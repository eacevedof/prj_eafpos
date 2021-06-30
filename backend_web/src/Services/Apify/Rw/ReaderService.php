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

class ReaderService extends AppService
{
    use CacheQueryTrait;

    private $idContext;
    private $sDb;
    
    private $oContext;
    private $oBehav;
    private $sSQL;
    private $iFoundrows;
    private $fCacheTime = 0;

    public function __construct(string $idContext="", string $sDbalias="")
    {
        $this->idContext = $idContext;

        if(!$this->idContext) return $this->add_error("Error in context: $idContext");
        $this->oContext = new ComponentContext($_ENV["APP_CONTEXTS"], $idContext);
        $this->sDb = $this->oContext->get_dbname($sDbalias);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext,$this->sDb);
        if($oDb->is_error()) return $this->add_error($oDb->get_errors());

        $this->oBehav = new SchemaBehaviour($oDb);
    }
    
    private function _get_parsed_tosql($arParams)
    {
        if(!isset($arParams["table"])) $this->add_error("get_sql no table");
        if(!isset($arParams["fields"]) || !is_array($arParams["fields"])) $this->add_error("get_sql no fields");
        if($this->isError) return;

        $oCrud = new ComponentCrud();
        if(!isset($arParams["comment"])) $oCrud->set_comment($arParams["comment"]);
        $oCrud->set_table($arParams["table"]);
        if(isset($arParams["distinct"])) $oCrud->is_distinct($arParams["distinct"]);
        if(isset($arParams["foundrows"])) $oCrud->is_foundrows($arParams["foundrows"]);

        $oCrud->set_getfields($arParams["fields"]);
        $oCrud->set_joins($arParams["joins"]??[]);
        $oCrud->set_and($arParams["where"]??[]);
        $oCrud->set_groupby($arParams["groupby"]??[]);
        $oCrud->set_having($arParams["having"]??[]);

        $arTmp = [];
        if(isset($arParams["orderby"]))
        {
            foreach($arParams["orderby"] as $sField)
            {
                $arField = explode(" ",trim($sField));
                $arTmp[$arField[0]] = $arField[1] ?? "ASC";
            }
        }
        $oCrud->set_orderby($arTmp);

        if(isset($arParams["limit"]["perpage"]))
            $oCrud->set_limit($arParams["limit"]["perpage"] ?? 1000,$arParams["limit"]["regfrom"]??0);

        $oCrud->get_selectfrom();
        $sql =  $oCrud->get_sql();
        return $sql;
    }

    public function read_raw($sSQL): array
    {
        if(!$sSQL) return [];
        $this->sSQL = $sSQL;

        if($ttl = $this->fCacheTime) {
            if($r = $this->get_cached($sSQL)) {
                $this->iFoundrows = $this->get_cachedcount($sSQL);
                return $r;
            }
        }

        $r = $this->oBehav->read_raw($sSQL);
        $this->iFoundrows = $this->oBehav->get_foundrows();
        if($this->oBehav->is_error()) {
            if($ttl) $this->delete_all($sSQL);
            $this->logerr($errors = $this->oBehav->get_errors(),"readservice.read_raw");
            $this->add_error($errors);
            return $r;
        }

        if($ttl) {
            $this->addto_cache($sSQL, $r, $ttl);
            $this->addto_cachecount($sSQL, $this->iFoundrows, $ttl);
        }
        return $r;
    }
    
    public function get_read($arParams)
    {
        if(!$arParams) {
            $this->logerr($error = "get_read No params","readservice.get_read");
            return $this->add_error($error);
        }

        $this->fCacheTime = $arParams["cache_time"] ?? 0;
        $sSQL = $this->_get_parsed_tosql($arParams);
        $this->sSQL = $sSQL;
        $r = $this->read_raw($sSQL);
        return $r;
    }

    public function get_foundrows(){return $this->iFoundrows;}

}//ReaderService
