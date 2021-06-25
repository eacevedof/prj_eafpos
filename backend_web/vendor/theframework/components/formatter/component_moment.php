<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheFramework\Components\Formatter\ComponentMoment
 * @file component_moment.php 1.0.0
 * @date 04-06-2020 14:03 SPAIN
 * @observations
 */
namespace TheFramework\Components\Formatter;

final class ComponentMoment
{
    private $date = "";
    private $cleaned = "";
    private $ardate = [];
    private $operdate = "";
    private $periods = [];

    private $errors = [];

    public function __construct($date="")
    {
        $this->date = !$date?date("Ymd"):trim($date);
        $this->_load_exploded();
        $this->_load_periods();
    }

    private function _load_periods()
    {
        $this->periods = [
            "d"=>["day","days"],
            "m"=>["month","months"],
            "w"=>["week","weeks"],
            "y"=>["year","years"]
        ];
    }

    private function _get_as_array($yyymmdd)
    {
        $ardate = [];
        $numbers = str_split($yyymmdd);

        $tmp = "";
        foreach(range(0,3) as $i) $tmp .= $numbers[$i];
        $ardate[0] = $tmp;

        $tmp = "";
        foreach(range(4,5) as $i) $tmp .= $numbers[$i];
        $ardate[1] = $tmp;

        $tmp = "";
        foreach(range(6,7) as $i) $tmp .= $numbers[$i];
        $ardate[2] = $tmp;

        return $ardate;
    }

    private function _load_exploded()
    {
        if(!$this->is_valid()) return -1;

        $date = $this->date;
        if(strstr($date,"-")) $this->ardate = explode("-",$date);
        elseif(strstr($date,"/")) $this->ardate = explode("/",$date);
        else
        {
            $this->ardate = $this->_get_as_array($date);
        }
        $this->cleaned = implode("",$this->ardate);
        $this->operdate = $this->cleaned;
    }

    private function _get_strtotimed($stroperation)
    {
        $strtotime = strtotime($stroperation);
        $newdate = date("Ymd",$strtotime);
        return $newdate;
    }

    private function _common_ops($i,$period,$op="-")
    {
        $stroperation = date($this->cleaned)."$op $i $period";
        $this->operdate = $this->_get_strtotimed($stroperation);
        //return $this;
    }

    private function _by_month($i, $sign="-")
    {
        //los movimientos por meses y años dan "error" para los últimos días de mes por 
        //esto tengo que tratarlos manualmente.
        //si se hace esto: 20200331 - 1 month el resultado es 20200301 y debería ser 20200229
        //esto es lo que corrige este metodo
        $thisday = $this->ardate[2];
        $yyyymm01 = $this->ardate[0].$this->ardate[1]."01";
        //todos los segundos pasados hasta la fecha
        $stroperation = strtotime(date($yyyymm01)."$sign $i months");
        $newmonth = date("Ym",$stroperation);
        $newmonth01 = $newmonth."01";
        $newmonththisday = $newmonth.$thisday;
        $newmonthlastday = date("Ymt", strtotime($newmonth01));
        //lg("by_month: yyyymm01:$yyyymm01,newmonth: $newmonth, newmonth01:$newmonth01, newmonthlastday:$newmonthlastday","by_month $i");
        if($newmonththisday>$newmonthlastday)
            $this->operdate = $newmonthlastday;
        else
            $this->operdate = $newmonththisday;
    }

    public function is_valid()
    {
        return (bool) strtotime($this->date);
    }

    public function add($i=1,$period="days")
    {
        if(!in_array($period, $this->periods["m"]))
        {
            $this->_common_ops($i, $period, "+");
        }
        else
            $this->_by_month($i, "+");
        return $this;
    }

    public function subtract($i=1,$period="days")
    {
        if(!in_array($period, $this->periods["m"]))
        {
            $this->_common_ops($i, $period);
        }
        else
            $this->_by_month($i);

        return $this;
    }

    public function as_maxdate($today="")
    {
        if(!$today) $today = date("Ymd");
        if($this->cleaned > $today)
        {
            $this->cleaned = $today;
            $this->ardate = $this->_get_as_array($this->cleaned);
            $this->operdate = $today;
        }
        return $this;
    }

    public function get_calculated()
    {
        return $this->operdate;
    }

    public function is_fullmonth($yyyymmdd)
    {
        $ardate = $this->_get_as_array($yyyymmdd);
        //si tienen el mismo día y distinto mes es completo
        return (($this->ardate[1] != $ardate[1]) && ($this->ardate[2] == $ardate[2]));
    }

    public function get_ndays($yyymmdd)
    {
        $earlier = new \DateTime($this->cleaned);
        $later = new \DateTime($yyymmdd);
        $diff = $later->diff($earlier)->format("%a");
        return $diff;
    }

    public function get_day(){ return $this->ardate[2];}
    public function get_month(){ return $this->ardate[1];}
    public function get_year(){ return $this->ardate[0];}

    public function get_lastday()
    {
        return date("Ymt",strtotime($this->cleaned));
    }

    public function has_day($day)
    {
        $yyyymmdd = $this->get_lastday();
        $ardate = $this->_get_as_array($yyyymmdd);
        return ($day<=$ardate[2]);
    }

    public function is_greater_than($date)
    {
        $odatein = new \DateTime($this->date);
        $odatex = new \DateTime($date);
        return $odatein > $odatex;

    }
}