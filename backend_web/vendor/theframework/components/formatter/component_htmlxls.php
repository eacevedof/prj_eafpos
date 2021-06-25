<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.0.2
 * @name ComponentHtmlxls
 * @file component_htmlxls.php
 * @date 15-08-2014 13:55 (SPAIN)
 * @observations: 
 * @requires: 
 *  helper_table_td.php,
 *  helper_table_tr.php,
 *  helper_table.php
 */
import_helper("table");

class ComponentHtmlxls 
{
    //
    protected $arHeader;
    protected $arData;
    protected $oTable;
    protected $sFileName;
    
    public function __construct($arData,$arHeader=array())
    {
        $this->arData = $arData;
        $this->arHeader = $arHeader;
        $this->oTable = new HelperTable();
    }
    
    private function build_head()
    {
        if($this->arHeader)
        {    
            $oTmpTr = new HelperTableTr();
            foreach($this->arHeader as $sHeadLabel)
            {
                $TmpTd = new HelperTableTd();
                $TmpTd->set_innerhtml($sHeadLabel);
                $oTmpTr->add_inner_object($TmpTd);
            }
            $this->oTable->add_tr($oTmpTr);
        }
    }//build_head

    private function build_data()
    {
        if($this->arData)
        {
            foreach($this->arData as $arRow)
            {
                $oTmpTr = new HelperTableTr();
                foreach($arRow as $sFieldValue)
                {
                    $oTmpTd = new HelperTableTd();
                    $oTmpTd->set_innerhtml($sFieldValue);
                    $oTmpTr->add_td($oTmpTd);
                }
                $this->oTable->add_tr($oTmpTr);
            }
        }//
    }//build_data

    private function data_reorder()
    {
        $arList = array();
        if($this->arHeader)
        {
            foreach($this->arHeader as $sFileNameH=>$sLabel)
            {
                foreach($this->arData as $iRow=>$arValues)
                {
                    $arList[$iRow][$sFileNameH] = $arValues[$sFileNameH];
                }//foreach $arList
            }//foreach $this->arHeader
            $this->arData = $arList;
        }
    }
    
    public function download_xls()
    {
        $this->build_head();
        $this->data_reorder();
        $this->build_data();
        if($this->sFileName) 
            $sFileName = $this->sFileName."_";
        $sFileName = $sFileName.date("YmdHis").".xls";
        header("Content-type: application/vnd.ms-excel"); 
        header("Content-Disposition: attachment;filename=$sFileName");
        $this->oTable->show();
        exit();//evita imprimir debug
    }//download_xls
    
    //=======================
    //         SETS
    //=======================    
    public function set_header($arHeader){$this->arHeader = $arHeader;}
    public function set_data($arData){$this->arData = $arData;}
    public function set_fieldname($sFieldName){$this->sFileName = $sFieldName;}
    //=======================
    //        GETS
    //=======================    
}
