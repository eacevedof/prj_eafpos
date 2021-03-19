<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Dbs\SchemaService
 * @file SchemaService.php 1.0.0
 * @date 28-01-2019 19:00 SPAIN
 * @observations
 */
namespace App\Services\Dbs;

use App\Behaviours\SchemaBehaviour;

class SchemaService
{
    private $oBehav;

    public function __construct($oDb=NULL)
    {
        //necesitaria un objeto de db
        $this->oBehav = new SchemaBehaviour($oDb);
    }

    public function get_tables()
    {
        //$arReturn = [];
        $arReturn = $this->oBehav->get_tables();
        return $arReturn;
    }

    public function get_fields_info($sTable)
    {
        $arReturn = $this->oBehav->get_fields_info($sTable);
        return $arReturn;
    }

    public function get_tables_info($sTables="")
    {
        $arTables = [];
        if(!$sTables)
            $arTables = $this->get_tables();
        else
            $arTables = explode(",",$sTables);

        $arReturn = [];
        foreach ($arTables as $sTable)
            $arReturn[$sTable] = $this->get_fields_info($sTable);

        return $arReturn;
    }

}//SchemaService