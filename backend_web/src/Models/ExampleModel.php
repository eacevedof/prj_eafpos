<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Models\ExampleModel 
 * @file ExampleModel.php v1.0.0
 * @date 29-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Models;

use App\Models\AppModel;

class ExampleModel extends AppModel
{
    public function __construct() 
    {
        $this->sTable = "titles";
        parent::__construct();
        $this->load_pk_fields();
        $this->load_fileds();
    }
        
    private function load_fileds()
    {
        $arTmp = [
            ["db"=>"emp_no","ui"=>"empno"],
            ["db"=>"title","ui"=>"utitle"],
            ["db"=>"from_date","ui"=>"fromdate"],
            ["db"=>"to_date","ui"=>"todate"]
        ];
        $this->arFields = $arTmp;
    }//load_fileds
    
    private function load_pk_fields()
    {
        $this->arPks = ["emp_no","title","from_date"];
    }//load_pk_fields
    
    // carga combo
    public function get_picklist()
    {
        $sSQL = "
        /*ExampleModel.get_picklist*/
        SELECT DISTINCT title,title
        FROM titles
        ORDER BY 2
        ";
        $arRows = $this->oDb->query($sSQL);
        return $arRows;
    }//get_picklist
    
}//ExampleModel
