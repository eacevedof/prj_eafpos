<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheFramework\Components\Db\ComponentMysql 
 * @file component_mysql.php v2.2.0
 * @date 10-06-2020 15:10 SPAIN
 * @observations
 */
namespace TheFramework\Components\Db;

final class ComponentMysql
{
    private $arConn;
    private $isError;
    private $arErrors;    
    private $iAffected;
    private $iFoundrows;
    private $iLastid;
    
    public function __construct($arConn=[]) 
    {
        $this->isError = FALSE;
        $this->arErrors = [];
        $this->arConn = $arConn;
        $this->iFoundrows = 0;
        $this->iLastid = -1;
    }

    private function get_conn_string()
    {
        if(!$this->arConn)
            throw new \Exception("No database config passed");

        $arCon["mysql:host"] = $this->arConn["server"] ?? "";
        $arCon["dbname"] = $this->arConn["database"] ?? "";
        $arCon["port"] = $this->arConn["port"] ?? "";
        //$arCon["ConnectionPooling"] = (isset($this->arConn["pool"])?$this->arConn["pool"]:"0");
        
        $sString = "";
        foreach($arCon as $sK=>$sV)
            $sString .= "$sK=$sV;";
        
        return $sString;
    }//get_conn_string

    private function get_rowcol($arResult,$iCol=NULL,$iRow=NULL)
    {
        if(is_int($iCol) || is_int($iRow))
        {
            $arColnames = $arResult[0];
            $arColnames = array_keys($arColnames);
//bug($arColnames);
            $sColname = (isset($arColnames[$iCol])?$arColnames[$iCol]:"");
            if($sColname)
                $arResult = array_column($arResult,$sColname);
        
            if(isset($arResult[$iRow]))
                $arResult = $arResult[$iRow];
        }
        return $arResult;
    }
    
    public function query($sSQL,$iCol=NULL,$iRow=NULL)
    {
        $arResult = [];        
        try 
        {
            //devuelve server y bd
            $sConn = $this->get_conn_string();
            //pr($sConn,"component_mysql.query");die;
            //pr($this->arConn,"xxxxxxxxxxxxxxxx");die("yyyyyyyyyy");
            //https://stackoverflow.com/questions/38671330/error-with-php7-and-sql-server-on-windows
            $oPdo = new \PDO($sConn,$this->arConn["user"],$this->arConn["password"]
                    ,[\PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
            $oPdo->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION );

            $this->log($sSQL,"ComponentMysql.exec");
            $oCursor = $oPdo->query($sSQL);
            if($oCursor===FALSE)
            {
                $this->add_error("exec-error: $sSQL");
            }
            else
            {
                while($arRow = $oCursor->fetch(\PDO::FETCH_ASSOC))
                    $arResult[] = $arRow;

                $sSQL = "SELECT FOUND_ROWS()";
                $this->iFoundrows = $oPdo->query($sSQL)->fetch(\PDO::FETCH_COLUMN);

                $this->iAffected = count($arResult);
                if($arResult)
                    $arResult = $this->get_rowcol($arResult,$iCol,$iRow);
            }
        }
        catch(\PDOException $oE)
        {
            $sMessage = "exception:{$oE->getMessage()}";
            $this->add_error($sMessage);
            $this->log($sSQL,"ComponentMysql.query error: $sMessage");
        }
        return $arResult;
    }//query
    
    public function exec($sSQL)
    {
        try 
        {
            $sConn = $this->get_conn_string();
            //https://stackoverflow.com/questions/19577056/using-pdo-to-create-table
            $oPdo = new \PDO($sConn,$this->arConn["user"],$this->arConn["password"]
                    ,[\PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
            $oPdo->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION );
            $this->log($sSQL,"ComponentMysql.exec");
            $mxR = $oPdo->exec($sSQL);

            $this->iAffected = $mxR;

            if(strstr($sSQL,"INSERT INTO ")) $this->iLastid = $oPdo->lastInsertId();

            if($mxR===FALSE)
            {
                $this->add_error("exec-error: $sSQL");
            }
            return $mxR;
        }
        catch(\PDOException $oE)
        {           
            $sMessage = "exception:{$oE->getMessage()}";
            $this->add_error($sMessage);
            $this->log($sSQL,"ComponentMysql.exec error: $sMessage");
        }
    }//exec    
    
    private function log($mxVar,$sTitle=NULL)
    {
        if(defined("PATH_LOGS") && class_exists("\TheFramework\Components\ComponentLog"))
        {
            $oLog = new \TheFramework\Components\ComponentLog("sql",PATH_LOGS);
            $oLog->save($mxVar,"-- ".$sTitle);
        }
        if(function_exists("get_log_producer"))
        {
            get_log_producer()->send($mxVar, "-- ".$sTitle, "sql");
        }
    }
  
    private function add_error($sMessage){$this->isError = TRUE;$this->iAffected=-1; $this->arErrors[]=$sMessage;}    
    public function is_error(){return $this->isError;}
    public function get_errors(){return $this->arErrors;}
    public function get_error($i=0){return isset($this->arErrors[$i])?$this->arErrors[$i]:NULL;}
    public function show_errors(){echo "<pre>".var_export($this->arErrors,1);}
    
    public function add_conn($k,$v){$this->arConn[$k]=$v;}
    public function set_conn($config){$this->arConn = $config;}

    public function get_conn($k){return $this->arConn[$k];}
    public function get_affected(){return $this->iAffected;}
    public function get_foundrows(){return $this->iFoundrows;}
    public function get_lastid(){return $this->iLastid;}
    
}//ComponentMysql
