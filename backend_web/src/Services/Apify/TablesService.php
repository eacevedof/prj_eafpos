<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Apify\Mysql
 * @file TablesService.php 1.0.0
 * @date 27-06-2019 17:55 SPAIN
 * @observations
 */
namespace App\Services\Apify;

use TheFramework\Components\Db\Context\ComponentContext;
use App\Services\AppService;
use App\Behaviours\SchemaBehaviour;
use App\Factories\DbFactory;

class TablesService extends AppService
{
    private $idContext;
    private $sDb;
    private $sTableName;
    
    private $oContext;
    private $oBehav;
    
    public function __construct($idContext="",$sDb="",$sTable="") 
    {
        $this->idContext = $idContext;
        $this->sDb = $sDb;
        $this->sTableName = $sTable;
        
        $this->oContext = new ComponentContext($_ENV["APP_CONTEXTS"],$idContext);
        $oDb = DbFactory::get_dbobject_by_ctx($this->oContext,$sDb);
        //pr($oDb);die;
        $this->oBehav = new SchemaBehaviour($oDb);
    }
    
    public function get_all()
    {      
        return $this->oBehav->get_tables($this->sDb);
    }
    
    public function get_table($sTableName)
    {
        return $this->oBehav->get_table($sTableName,$this->sDb);
    }
    
}//TablesService
