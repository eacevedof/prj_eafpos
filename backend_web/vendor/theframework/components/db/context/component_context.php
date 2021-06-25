<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheFramework\Components\Db\Context\ComponentContext 
 * @file component_context.php v3.1.0
 * @date 24-07-2020 20:37 SPAIN
 * @observations
 */
namespace TheFramework\Components\Db\Context;

class ComponentContext
{
    private $isError;
    private $arErrors;

    private $arContexts;
    private $arContextPublic;

    private $idSelected;
    private $arSelected;

    public function __construct($sPathfile="", $idSelected="")
    {
        $this->idSelected = $idSelected;
        $this->arContexts = [];
        if(!$sPathfile) $sPathfile = $_ENV["APP_CONTEXTS"] ?? __DIR__.DIRECTORY_SEPARATOR."contexts.json";
        if(!is_file($sPathfile))
        {
            $this->add_error("No context file found: $sPathfile");
            return -1;
        }
        $this->_load_array_fromjson($sPathfile);
        $this->_load_context_noconf();
        $this->_load_selected();
    }

    private function _load_array_fromjson($sPathfile)
    {
        if($sPathfile)
            if(is_file($sPathfile))
            {
                $sJson = file_get_contents($sPathfile);
                $this->arContexts = json_decode($sJson,1);
                //pr($this->arContexts);die;
            }
            else
                $this->add_error("_load_array_fromjson: file $sPathfile not found");
        else
            $this->add_error("_load_array_fromjson: no pathfile passed");
    }

    /**
     * carga la información que no es sensible, por eso se elimina schemas
     */
    private function _load_context_noconf()
    {
        foreach($this->arContexts as $arContext)
        {
            unset($arContext["schemas"],$arContext["server"],$arContext["port"]);
            $this->arContextPublic[] = $arContext;
        }
    }

    private function _load_selected()
    {
//pr($this->idSelected);
        //si no se pasa id se asume que no se ha seleccionado un contexto
        $this->arSelected["ctx"] = $this->get_by_id($this->idSelected);
//pr($this->arSelected,"arselected");die;
        if($this->arSelected["ctx"])
            $this->arSelected["ctx"] = $this->arSelected["ctx"][array_keys($this->arSelected["ctx"])[0]];

        $this->arSelected["pubconfig"] = $this->get_pubconfig_by("id",$this->idSelected);
        //pr($this->arSelected,"arSelected");
    }

    private function _get_filter_level_1($sKey, $sValue, $arArray=[])
    {
        if(!$sKey && !$sValue) return [];
        if(!$arArray) $arArray = $this->arContexts;
        //pr("key:v -> $sKey, $sValue");
        //print_r($arArray);die;
        $arFiltered = array_filter($arArray, function($arConfig) use($sKey,$sValue) {
            $confval = $arConfig[$sKey] ?? "";
            return $confval === $sValue;
        });
        return $arFiltered;
    }

    public function get_config(){ return $this->arContexts;}

    public function get_by_id($id){ return $this->_get_filter_level_1("id",$id); }

    public function get_by($key,$val){ return $this->_get_filter_level_1($key,$val); }

    public function get_config_by($key,$val)
    {
        $arConfig = $this->_get_filter_level_1($key,$val);

        if($arConfig) {
            $arConfig = $arConfig[array_keys($arConfig)[0]];
            return $arConfig["schemas"];
        }
        return [];
    }

    public function get_selected(){return $this->arSelected;}
    public function get_selected_id(){return $this->arSelected["ctx"]["id"];}

    public function get_schemas(){return $this->arSelected["ctx"]["schemas"];}

    public function get_pubconfig_by($key,$val)
    {
        $arConfig = $this->_get_filter_level_1($key,$val,$this->arContextPublic);
        if($arConfig)
            return $arConfig[array_keys($arConfig)[0]];
        return [];
    }

    public function get_pubconfig(){return $this->arContextPublic;}
    public function get_errors(){return isset($this->arErrors)?$this->arErrors:[];}
    public function is_error(){return $this->isError;}
    public function get_dbname($alias){
        $schemas = $this->get_schemas();
        foreach ($schemas as $schema){
            $schalias = $schema["alias"] ?? "";
            if($schalias === $alias)
                return $schema["database"] ?? "";
        }
        return "";
    }

    private function add_error($sMessage){$this->isError = true; $this->arErrors[] = $sMessage;}

}//ComponentContext

/*
Array
(
    [0] => Array
        (
            [id] => c1
            [alias] => Docker mysql
            [description] => Docker mysql
            [type] => mysql
            [server] => 127.0.0.1
            [port] => 3350
            [schemas] => Array
                (
                    [0] => Array
                        (
                            [database] => db_one
                            [user] => root
                            [password] => root
                        )

                    [1] => Array
                        (
                            [database] => db_two
                            [user] => root
                            [password] => root
                        )

                )

        )

    [1] => Array
        (
        )

)
*/