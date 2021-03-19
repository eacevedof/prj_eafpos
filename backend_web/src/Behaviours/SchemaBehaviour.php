<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Behaviours\SchemaBehaviour 
 * @file SchemaBehaviour.php v1.0.0
 * @date 29-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Behaviours;

use App\Models\AppModel;
use App\Services\Dbs\CoreQueriesService;

class SchemaBehaviour extends AppModel
{
    private $oQServ;
    private $iFoundrows;
    
    public function __construct($oDb=NULL) 
    {
        parent::__construct($oDb);
        $this->oQServ = new CoreQueriesService();
    }
    
    public function query($sSQL,$iCol=NULL,$iRow=NULL)
    {
        $r = $this->oDb->query($sSQL,$iCol,$iRow);
        $this->iFoundrows = $this->oDb->get_foundrows();
        if($this->oDb->is_error())
            $this->add_error($this->oDb->get_errors());
        return $r;
    }

    public function execute($sSQL)
    {
        $r = $this->oDb->exec($sSQL);
        if($this->oDb->is_error())
            $this->add_error($this->oDb->get_errors());
        return $r;
    }    
    
    public function get_schemas()
    {
        $sSQL = " -- get_schemas
        SELECT schema_name as dbname
        FROM information_schema.schemata
        ORDER BY schema_name;";
        $arRows = $this->query($sSQL);
        return $arRows;
    }
    
    public function get_tables($sDb="")
    {
        $sSQL = $this->oQServ->get_tables($sDb);
        //bug($sSQL);
        $arRows = $this->query($sSQL,0);
        //bug($arRows);
        return $arRows;
    }
    
    public function get_table($sTable,$sDb="")
    {
        $sSQL = $this->oQServ->get_tables($sDb,$sTable);
        //bug($sSQL);
        $arRows = $this->query($sSQL,0);
        //bug($arRows);
        return $arRows;        
    }
   
    public function get_fields_info($sTable,$sDb="")
    {
        $sSQL = $this->oQServ->get_fields($sDb,$sTable);
        $arRows = $this->query($sSQL);
        //bug($arRows);die;
        return $arRows;
    }

    public function get_fields($sTable,$sDb="")
    {
        $sSQL = $this->oQServ->get_fields_min($sDb,$sTable);
        $arRows = $this->query($sSQL);
        //bug($arRows);die;
        return $arRows;
    }

    public function get_field_info($sField,$sTable,$sDb="")
    {
        $sSQL = $this->oQServ->get_field($sDb,$sTable,$sField);
        $arRows = $this->query($sSQL);
        //bug($arRows);die;
        return $arRows;
    }    
    
    public function read_raw($sSQL){ return $this->query($sSQL);}
    public function write_raw($sSQL){ return $this->execute($sSQL);}
    public function get_foundrows(){return $this->iFoundrows; }


}//SchemaBehaviour
