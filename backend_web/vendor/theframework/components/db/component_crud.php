<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheFramework\Components\Db\ComponentCrud 
 * @file component_crud.php 2.7.1
 * @date 03-08-2020 14:54 SPAIN
 * @observations
 */
namespace TheFramework\Components\Db;

class ComponentCrud
{
    private $sSQL;
    private $sSQLComment;
    private $sTable; //Tabla sobre la que se realizará el crud
    private $arInsertFV;
    
    private $arNumeric; //si esta en este array no se escapa con '
    private $arOrderBy;
    private $arGroupBy;
    private $arHaving;
    private $arAnds;
    private $arJoins;
    
    private $isDistinct;
    private $isFoundrows;
    private $arUpdateFV;
    private $arPksFV;
    private $arGetFields;
    private $arResult;
    private $arEnd;
    private $arLimit;
    
    private $oDB;
    
    protected $arErrors = [];
    protected $isError = FALSE;

    protected $reserved = ["get","order"];

    /**
     * 
     * @param TheFramework\Components\Db\ComponentMysql $oDB
     */
    public function __construct($oDB=NULL)
    { 
        $this->arEnd = [];
        $this->arResult = [];
        $this->arInsertFV = [];
        $this->arUpdateFV = [];
        $this->arPksFV = [];
        $this->arGetFields = [];
        $this->arOrderBy = [];
        $this->arGroupBy = [];
        $this->arNumeric = [];
        $this->arAnds = [];
        $this->oDB = $oDB;
    }
    
    private function get_orderby()
    {
        $sOrderBy = "";
        $arSQL = [];
        if($this->arOrderBy)
        {
            $sOrderBy = " ORDER BY ";
            foreach($this->arOrderBy as $sField=>$sAD) {
                $this->clean_reserved($sField);
                $arSQL[] = "$sField $sAD";
            }
            $sOrderBy = $sOrderBy.implode(",",$arSQL);
        }
        return $sOrderBy;
    }

    private function get_having()
    {
        if(!$this->arHaving) return "";
        $arSQL = [];
        $sHaving = " HAVING ";
        foreach($this->arHaving as $sHavcond)
            $arSQL[] = $sHavcond;
        $sHaving = $sHaving.implode(", ",$arSQL);
        return $sHaving;
    }
    
    private function get_groupby()
    {
        $sGroupBy = "";
        $arSQL = [];
        if($this->arGroupBy)
        {
            $sGroupBy = " GROUP BY ";
            foreach($this->arGroupBy as $sField) {
                $this->clean_reserved($sField);
                $arSQL[] = $sField;
            }
            $sGroupBy = $sGroupBy.implode(",",$arSQL);
        }
        return $sGroupBy;
    }

    private function get_joins()
    {
        $sJoin = " ".implode("\n",$this->arJoins);
        return $sJoin;        
    }
    
    private function get_end()
    {
        $sEnd = " ".implode("\n",$this->arEnd);
        return $sEnd;        
    }

    private function get_limit()
    {
        if(!$this->arLimit) return "";
        // LIMIT regfrom (secuenta desde 0), perpage
        $sLimit = " LIMIT ".implode(", ",$this->arLimit);
        /**
         * si por ejemplo deseo paginar de 10 en 10
         * para la pag:
         *  1 sería LIMIT 0,10   -- 1 a 10
         *  2 LIMIT 10,10        -- 11 a 20
         *  3 LIMIT 20,10        -- 21 a 30
         */
        return $sLimit;
    }
    
    private function is_numeric($sFieldName){return in_array($sFieldName,$this->arNumeric);}

    private function is_reserved($word){return in_array(strtolower($word),$this->reserved);}

    private function clean_reserved(&$mxfields)
    {
        if(is_array($mxfields)) {
            foreach ($mxfields as $i => $field) {
                if ($this->is_reserved($field))
                    $mxfields[$i] = "`$field`";
            }
        }
        elseif(is_string($mxfields)) {
            if ($this->is_reserved($mxfields))
                $mxfields = "`$mxfields`";
        }
    }

    private function is_tagged($value)
    {
        if(!is_string($value)) return false;
        //$value = trim($value);
        $tagini = substr($value,0,2);
        $tagend = substr($value, -2);
        $ilen = strlen($value);
        if($ilen>4 && $tagini==="%%" && $tagend==="%%") {
            $field = substr($value, 2, $ilen - 4);
            return (trim($field) !== "");
        }
        return false;
    }

    private function get_untagged($tagged)
    {
        $ilen = strlen($tagged);
        return substr($tagged, 2, $ilen - 4);
    }

    public function autoinsert($sTable=NULL,$arFieldVal=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- autoinsert";
        
        $sSQLComment = "";
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arFieldVal)
                $arFieldVal = $this->arInsertFV;
            
            if($arFieldVal)
            {    
                $sSQL = "$sSQLComment INSERT INTO ";
                $sSQL .= "$sTable ( ";

                $arFields = array_keys($arFieldVal);
                $this->clean_reserved($arFields);
                $sSQL .= implode(",",$arFields);

                $arValues = array_values($arFieldVal);
                //los paso a entrecomillado
                foreach ($arValues as $i=>$sValue)
                {
                    if($sValue===NULL)
                        $arAux[] = "NULL";
                    else
                        $arAux[] = "'$sValue'";
                }

                $sSQL .= ") VALUES (";
                $sSQL .= implode(",",$arAux);
                $sSQL .= ")";
                
                $this->sSQL = $sSQL;
                //si hay bd intenta ejecutar la consulta
                $this->query("w");
            }//si se han proporcionado correctamente los datos campo=>valor
        }//se ha proporcionado una tabla
        return $this;
    }//autoinsert
    
    public function autoupdate($sTable=NULL,$arFieldVal=[],$arPksFV=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- autoupdate";
        
        $sSQLComment = "";
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arFieldVal)
                $arFieldVal = $this->arUpdateFV;
            if(!$arPksFV)
                $arPksFV = $this->arPksFV;

            $sSQL = "$sSQLComment UPDATE $sTable ";
            $sSQL .= "SET ";
            //creo las asignaciones de campos set extras
            $arAux = [];
            foreach($arFieldVal as $sField=>$sValue)
            {
                //echo "$sField  =  $sValue\n";
                $this->clean_reserved($sField);
                if($sValue===NULL)
                    $arAux[] = "$sField=NULL";
                elseif($this->is_tagged($sValue)) {
                    $arAux[] = "$sField={$this->get_untagged($sValue)}";
                }
                elseif($this->is_numeric($sField))
                    $arAux[] = "$sField=$sValue";
                else    
                    $arAux[] = "$sField='$sValue'";
            }

            $sSQL .= implode(",",$arAux);

            $sSQL .= " WHERE 1 ";

            //condiciones con las claves
            $arAux = [];
            foreach($arPksFV as $sField=>$sValue)
            {
                $this->clean_reserved($sField);
                if($sValue===NULL)
                    $arAux[] = "$sField IS NULL";
                elseif($this->is_tagged($sValue)) {
                    $arAux[] = "$sField={$this->get_untagged($sValue)}";
                }
                elseif($this->is_numeric($sField))
                    $arAux[] = "$sField=$sValue";
                else    
                    $arAux[] = "$sField='$sValue'";
            }
            
            $arAux = array_merge($arAux,$this->arAnds);
            if($arAux)
                $sSQL .= "AND ".implode(" AND ",$arAux);            
            
            $sSQL .= $this->get_end();
            $this->sSQL = $sSQL;
            //si hay bd intenta ejecutar la consulta
            $this->query("w");               
        }//se ha proporcionado una tabla
        return $this;
    }//autoupdate
    
    public function autodelete($sTable=NULL,$arPksFV=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- autodelete";
        
        $sSQLComment = "";
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arPksFV)
                $arPksFV = $this->arPksFV;
            
            $sSQL = "$sSQLComment DELETE FROM $sTable ";

            //condiciones con las claves
            $arAux = [];
            foreach($arPksFV as $sField=>$sValue)
            {
                $this->clean_reserved($sField);
                if($sValue===NULL)
                    $arAux[] = "$sField IS NULL";
                elseif($this->is_tagged($sValue)) {
                    $arAux[] = "$sField={$this->get_untagged($sValue)}";
                }
                elseif($this->is_numeric($sField))
                    $arAux[] = "$sField=$sValue";
                else    
                    $arAux[] = "$sField='$sValue'";
            }                
            
            $sSQL .= " WHERE 1 ";
            
            $arAux = array_merge($arAux,$this->arAnds);
            if($arAux)
                $sSQL .= "AND ".implode(" AND ",$arAux);            
            
            $sSQL .= $this->get_end();
            $this->sSQL = $sSQL;
            //si hay bd intenta ejecutar la consulta
            $this->query("w");
                
        }//se ha proporcionado una tabla
        return $this;
    }//autodelete     
    
    public function autodelete_logic($sTable=NULL,$arPksFV=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- autodelete_logic";
        
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arPksFV)
                $arPksFV = $this->arPksFV;
            
            if($arPksFV)
            {    
                //@todo
                $sSQL = "$sSQLComment UPDATE $sTable ";
                $sSQL .= "SET  ";

                //condiciones con las claves
                $arAnd = [];
                foreach($arPksFV as $sField=>$sValue)
                {
                    $this->clean_reserved($sField);
                    if($sValue===NULL)
                        $arAnd[] = "$sField IS NULL";
                    elseif($this->is_tagged($sValue)) {
                        $arAux[] = "$sField={$this->get_untagged($sValue)}";
                    }
                    elseif($this->is_numeric($sField))
                        $arAux[] = "$sField=$sValue";
                    else
                        $arAux[] = "$sField='$sValue'";
                }
                
                $sSQL .= " WHERE ".implode(" AND ",$arAnd);
                
                $this->sSQL = $sSQL;
                //si hay bd intenta ejecutar la consulta
                $this->query("w");
            }//si se han proporcionado correctamente las claves
        }//se ha proporcionado una tabla
        return $this;
    }//autodelete_logic    
    
    public function autoundelete_logic($sTable=NULL,$arPksFV=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- autoundelete_logic";
        
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arPksFV)
                $arPksFV = $this->arPksFV;
            
            if($arPksFV)
            {    
                $codUserSession = getPostParam("userId");
                $sNow = date("Ymdhis");
                $sSQL = "$sSQLComment UPDATE $sTable 
                        SET 
                        delete_date=NULL
                        ,delte_user=NULL
                        ,update_date='$sNow'
                        ,update_user='$codUserSession'
                        ";

                //condiciones con las claves
                $arAnd = [];
                foreach($arPksFV as $sField=>$sValue)
                {
                    $this->clean_reserved($sField);
                    if($sValue===NULL)
                        $arAnd[] = "$sField IS NULL";
                    elseif($this->is_numeric($sField))
                        $arAux[] = "$sField=$sValue";
                    else    
                        $arAux[] = "$sField='$sValue'";
                }
                
                $sSQL .= " WHERE ".implode(" AND ",$arAnd);
                
                $this->sSQL = $sSQL;
                if(is_object($this->oDB))
                    $this->oDB->exec($this->sSQL);
            }//si se han proporcionado correctamente las claves
        }//se ha proporcionado una tabla
        return $this;
    }//autoundelete_logic  
    
    public function get_selectfrom($sTable=NULL,$arFields=[],$arPksFV=[])
    {
        //Limpio la consulta 
        $this->sSQL = "-- get_selectfrom";
        
        $sSQLComment = "";
        if($this->sSQLComment)
            $sSQLComment = "/*$this->sSQLComment*/";
        
        if(!$sTable)
            $sTable = $this->sTable;
        
        if($sTable)
        {
            if(!$arFields)
                $arFields = $this->arGetFields;
            if(!$arPksFV)
                $arPksFV = $this->arPksFV;
            
            if($arFields)
            {
                $sSQL = "$sSQLComment SELECT ";
                if($this->isFoundrows) $sSQL .= "SQL_CALC_FOUND_ROWS ";
                if($this->isDistinct) $sSQL .= "DISTINCT ";
                $this->clean_reserved($arFields);
                $sSQL .= implode(",",$arFields)." ";
                $sSQL .= "FROM $sTable";
                
                $sSQL .= $this->get_joins();
                //condiciones con las claves
                $arAux = [];
                foreach($arPksFV as $sField=>$sValue)
                {
                    $this->clean_reserved($sField);
                    if($sValue===NULL)
                        $arAux[] = "$sField IS NULL";
                    elseif($this->is_numeric($sField))
                        $arAux[] = "$sField=$sValue";
                    else    
                        $arAux[] = "$sField='$sValue'";
                }
                
                $arAux = array_merge($arAux,$this->arAnds);
                if($arAux)
                    $sSQL .= " WHERE ".implode(" AND ",$arAux);
                
                $sSQL .= $this->get_groupby();
                $sSQL .= $this->get_having();
                $sSQL .= $this->get_orderby();
                $sSQL .= $this->get_end();
                $sSQL .= $this->get_limit();
                $this->sSQL = $sSQL;
                //bug($sSQL);die;
                $this->query();
                return $this->arResult;
            }//si se han proporcionado correctamente los datos campo=>valor y las claves
            return NULL;
        }//se ha proporcionado una tabla
    }//get_selectfrom
    
    private function extract_top_sql($sSQL)
    {
        $sTop = NULL;
        $sSQL = strtolower($sSQL);
        //puede ser select top x select distinct top 
        $sTopPatern = "/select[\s]+top[\s]+[\d]+[\s]/";
        preg_match($sTopPatern,$sSQL,$arMatch);
        //si no hay coincidencias es probable que haya un distinct asi que se extrae con distinct
        if(!$arMatch[0])
        {
            $sTopPatern = "/select[\s]+distinct[\s]+top[\s]+[\d]+[\s]/";
            preg_match($sTopPatern,$sSQL,$arMatch);
        }

        if($arMatch[0])
        {
            $sTop = explode("top",$arMatch[0]);
            $sTop = trim($sTop[1]);
        }
        return $sTop;
    }

    public function explode_sql($sSQL)
    {
        $arExploded = [];

        $sDistinct = strstr($sSQL,"select distinct ");
        $sTop = strstr($sSQL," top ");
        $sWhere = strstr($sSQL,"where ");
        $sGroupBy = strstr($sSQL,"group by ");
        $sOrderBy = strstr($sSQL,"order by ");

        if($sDistinct) $sDistinct = "distinct";
        else $sDistinct = NULL;

        if($sTop) $sTop = $this->extract_top_sql($sSQL);
        else $sTop = NULL;

        //SELECT y FROM siempre existen en una sentencia SQL
        $sFields = explode("from ",$sSQL);
        //var_dump($sFields);
        $sFields = explode("select ",$sFields[0]);
        //quito la sentencia top
        $sFields = str_replace("top $sTop ","",$sFields[1]);
        //si existiera distinct se elimina
        $sFields = str_replace("distinct","",$sFields);
        $sFields = trim($sFields);

        //Recuperacion de relaciones INNER LEFT ...
        $sHierarchy = explode("from ",$sSQL);
        if($sWhere)
            $sHierarchy = explode("where ",$sHierarchy[1]);
        //No hay clausula where busco proxima marca "group by"
        else
        {
            if($sGroupBy)
                $sHierarchy = explode("group by ",$sHierarchy[1]);
            else//no hay group by
                if($sOrderBy) 
                    $sHierarchy = explode("order by ",$sHierarchy[1]);
        }
        $sHierarchy = $sHierarchy[0];

        //Recuperacion de condiciones AND , OR despues de WHERE y antes de GROUP BY Y ORDER BY
        if($sWhere) 
        {    
            $sWhere = explode("where ",$sSQL);
            if($sGroupBy)
                $sWhere = explode("group by ",$sWhere[1]);
            elseif($sOrderBy)//no hay group by
                $sWhere = explode("order by ",$sWhere[1]);
            else
                $sWhere[0]=$sWhere[1];
        }

        $sWhere = $sWhere[0];

        //Recuperacion de agrupaciones
        if($sGroupBy)
        {
            $sGroupBy = explode("group by ",$sSQL);
            if($sOrderBy) 
                $sGroupBy = explode("order by ",$sGroupBy[1]);
        }
        $sGroupBy = $sGroupBy[0];

        //Recuperacion de agrupaciones
        if($sOrderBy)
            $sOrderBy = explode("order by ",$sSQL);
        $sOrderBy = $sOrderBy[1];

        $arExploded["distinct"] = $sDistinct;
        $arExploded["top"] = $sTop;
        $arExploded["fields"] = $sFields;
        $arExploded["joins"] = $sHierarchy;
        $arExploded["where"] = $sWhere;
        $arExploded["group by"] = $sGroupBy;
        $arExploded["order by"] = $sOrderBy;

        return $arExploded;
    }

    public function implode_sql($arSQL)
    {
        $sDistinct = $arSQL["distinct"];
        $sTop = $arSQL["top"];
        $sFields = trim($arSQL["fields"]);
        $sJoins = trim($arSQL["joins"]);
        $sWhere = trim($arSQL["where"]);
        $sGroupBy = trim($arSQL["group by"]);
        $sOrderBy = trim($arSQL["order by"]);

        $sSQL = "select ";
        if($sDistinct) $sSQL .= "$sDistinct ";
        if($sTop) $sSQL .= "top $sTop ";
        $sSQL .= "$sFields ";
        $sSQL .= "from ";
        $sSQL .= "$sJoins ";
        if($sWhere) $sSQL .= "where $sWhere ";
        if($sGroupBy) $sSQL .= "group by $sGroupBy ";
        if($sOrderBy) $sSQL .= "order by $sOrderBy";
        return $sSQL;
    }

    public function replace_fields($arReplace,$sFields)
    {
        foreach($arReplace as $sSearch=>$sReplace)
            $sFields = str_replace($sSearch,$sReplace,$sFields);
        return $sFields;
    }
        
    public function set_table($sTable=NULL){$this->sTable=$sTable; return $this;}
    public function set_comment($sComment){$this->sSQLComment = $sComment; return $this;}
    
    public function set_insert_fv($arFieldVal=[]){$this->arInsertFV = []; if(is_array($arFieldVal)) $this->arInsertFV=$arFieldVal; return $this;}
    public function add_insert_fv($sFieldName,$sValue,$isSanit=1){$this->arInsertFV[$sFieldName]=($isSanit)?$this->get_sanitized($sValue):$sValue; return $this;}

    public function set_pks_fv($arFieldVal=[]){$this->arPksFV = []; if(is_array($arFieldVal)) $this->arPksFV=$arFieldVal; return $this;}
    public function add_pk_fv($sFieldName,$sValue,$isSanit=1){$this->arPksFV[$sFieldName]=($isSanit)?$this->get_sanitized($sValue):$sValue; return $this;}
    
    public function set_update_fv($arFieldVal=[]){$this->arUpdateFV = []; if(is_array($arFieldVal)) $this->arUpdateFV=$arFieldVal; return $this;}
    public function add_update_fv($sFieldName,$sValue,$isSanit=1){$this->arUpdateFV[$sFieldName]=($isSanit)?$this->get_sanitized($sValue):$sValue; return $this;}
    
    public function set_getfields($arFields=[]){$this->arGetFields = []; if(is_array($arFields)) $this->arGetFields=$arFields; return $this;}
    public function add_getfield($sFieldName){$this->arGetFields[]=$sFieldName; return $this;}

    public function set_joins($arJoins=[]){$this->arJoins = []; if(is_array($arJoins)) $this->arJoins=$arJoins; return $this;}
    public function set_orderby($arOrderBy=[]){$this->arOrderBy = []; if(is_array($arOrderBy)) $this->arOrderBy=$arOrderBy; return $this;}
    public function set_groupby($arGroupBy=[]){$this->arGroupBy = []; if(is_array($arGroupBy)) $this->arGroupBy=$arGroupBy; return $this;}
    public function set_having($arHaving=[]){$this->arHaving = []; if(is_array($arHaving)) $this->arHaving=$arHaving; return $this;}
    
    public function set_end($arEnd=[]){$this->arEnd = []; if(is_array($arEnd)) $this->arEnd=$arEnd; return $this;}
    public function set_limit($iPPage=1000, $iRegfrom=0){
        $this->arLimit=["regfrom"=>$iRegfrom, "perpage"=>$iPPage];
        if($iPPage==null) $this->arLimit = [];
        return $this;
    }

    public function get_sql(){return $this->sSQL;}
    
    /**
     * @param string $sTable Tabla sobre la que se va a comprobar. Por defecto this.sTable
     * 1: Delete_Date IS NOT NULL (con borrado logico)<br/>
     * 0: Delete_Date IS NULL (sin borrado logico)<br/>
     * NULL: No aplica filtro por fecha solo claves<br/>
     * @param int $isDeleted
     * @return boolean
     */
    public function is_intable($sTable=NULL,$isDeleted=1)
    {
        if(!$sTable) $sTable = $this->sTable;
        
        $sSQL = "-- is_intable
                SELECT id FROM $sTable WHERE ";

        $arAnd = [];
        foreach($this->arPksFV as $sFieldName=>$sFieldValue)
            $arAnd[] = "$this->sTable.$sFieldName='$sFieldValue'";

        if($isDeleted===1)
            $arAnd[] = "$this->sTable.Delete_Date IS NOT NULL";
        elseif($isDeleted===0)
            $arAnd[] = "$this->sTable.Delete_Date IS NULL";
        
        $sSQL .= implode(" AND ",$arAnd);
        $this->sSQL = $sSQL;
        
        $arRow = [];
        if(is_object($this->oDB))
            $arRow = $this->oDB->query($this->sSQL);
        
        return (boolean)$arRow[0];
    }
    
    /**
     * Obtiene el ultimo entero + 1 de un campo tipo contador
     * @param type $sFieldName
     */
    public function get_nextcode($sFieldName="Num_Line")
    {
        if($this->sTable && $sFieldName)
        {
            $sSQL = "/*crud.get_nextcode*/
            SELECT MAX($sFieldName) AS imax
            FROM $this->sTable 
            WHERE 1=1 
            AND ISNUMERIC($sFieldName)=1
            ";
            
            $arAux = [];
            foreach($this->arPksFV as $sField=>$sValue)
            {    
                if($sValue===NULL)
                    $arAux[] = "$sField IS NULL";
                elseif($this->is_numeric($sField))
                    $arAux[] = "$sField=$sValue";
                else    
                    $arAux[] = "$sField='$sValue'";
            }
            
            if($arAux)
                $sSQL .= " AND ".implode(" AND ",$arAux);
            
            $iMax = NULL;
            $this->sSQL = $sSQL;
            if(is_object($this->oDB))
                $iMax = $this->oDB->query($this->sSQL);            
            if(!$iMax) $iMax = 0;
            $iMax++;
            return $iMax;
        }
        return NULL;
    }//get_nextcode()
    
    public function get_sanitized($sValue)
    {
        // no se pq he escapado el % y el _ pero no debería
        $sFixed = str_replace("'","\'",$sValue);
        //$sFixed = str_replace("%","\%",$sFixed);
        //$sFixed = str_replace("_","\_",$sFixed); si quiero guardar  SQL_CALC_FOUND_ROWS me hace SQL\_CALC_\
        return $sFixed;
    }//get_sanitized

    /**
     * 
     * @param char $sType r:read para selects, w:write. escrituras
     * @return Solo se sale
     */
    private function query($sType="r")
    {
        if(is_object($this->oDB))
        {
            //insert,update,delete
            if(method_exists($this->oDB,"exec") && $sType=="w")
                $this->arResult = $this->oDB->exec($this->sSQL);
            //selects
            elseif(method_exists($this->oDB,"query") && $sType=="r")
                $this->arResult = $this->oDB->query($this->sSQL);
            else 
                return $this->add_error("No match method/type operation");
            
            //propagamos el error
            if($this->oDB->is_error())
                $this->add_error($this->oDB->get_error());
        }
    }//query
    
    public function get_result(){$this->arResult;}
    public function is_distinct($isOn=TRUE){$this->isDistinct=$isOn;}
    public function is_foundrows($isOn=TRUE){$this->isFoundrows=$isOn;}
    public function add_orderby($sFieldName,$sOrder="ASC"){$this->arOrderBy[$sFieldName]=$sOrder;}
    public function add_groupby($sFieldName){$this->arGroupBy[]=$sFieldName;}
    public function add_having($sHavecond){$this->arHaving[]=$sHavecond;}
    public function add_numeric($sFieldName){$this->arNumeric[]=$sFieldName;}
    public function set_and($arAnds=[]){$this->arAnds = []; if(is_array($arAnds)) $this->arAnds=$arAnds;}
    public function add_and($sAnd){$this->arAnds[]=$sAnd;}
    public function add_and1($sFieldName,$sValue,$sOper="="){$this->arAnds[]="$sFieldName $sOper $sValue";}
    public function add_join($sJoin,$sKey=NULL){if($sKey)$this->arJoins[$sKey]=$sJoin;else$this->arJoins[]=$sJoin;}
    public function add_end($sEnd,$sKey=NULL){if($sKey)$this->arEnd[$sKey]=$sEnd;else$this->arEnd[]=$sEnd;}
    
    protected function add_error($sMessage){$this->isError = TRUE;$this->arErrors[]=$sMessage;}
    public function is_error(){return $this->isError;}
    public function get_errors($inJson=0){if($inJson) return json_encode($this->arErrors); return $this->arErrors;}
    public function get_error($i=0){isset($this->arErrors[$i])?$this->arErrors[$i]:NULL;}
    public function show_errors(){echo "<pre>".var_export($this->arErrors,1);}
    public function set_dbobj($oDb=NULL){$this->oDB=$oDb;}
    
}//Crud 2.7.1
