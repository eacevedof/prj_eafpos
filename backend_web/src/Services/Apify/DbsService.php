<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\DbsService
 * @file DbsService.php 1.1.0
 * @date 02-07-2019 17:55 SPAIN
 * @observations
 */
namespace App\Services\Apify;

use TheFramework\Components\Db\Context\ComponentContext;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;

class DbsService extends AppService
{
    private $idContext;
    private $oContext;
    private $oBehav;
    
    public function __construct($idContext="")
    {
        $this->idContext = $idContext;
        $this->oContext = new ComponentContext($_ENV["APP_CONTEXTS"],$idContext);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext);
        $this->oBehav = new SchemaBehaviour($oDb);
    }
    
    public function get_all()
    {
        $arRows = $this->oBehav->get_schemas();
        //bug($this->oBehav);die;
        return $arRows;
    }

    public function is_db($database)
    {
        $config = $this->oContext->get_by_id($this->idContext);
        $cofigdb = $config[0]["schemas"]["database"] ?? "";
        return  $cofigdb === $database;
    }

}//DbsService
