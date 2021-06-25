<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name TheApplication\Components\ComponentConfig
 * @file ComponentConfig.php 1.0.0
 * @date 04-06-2020 12:35 SPAIN
 * @observations
 */
namespace TheFramework\Components\Config;

class Node
{
    private $arnode;

    public function __construct($arnode)
    {
        $this->arnode = $arnode;
    }

    public function find_by_key($key, $value)
    {
        $node = $this->arnode;
        $keys = array_keys($node);
        if(!in_array($key,$keys))  return null;

        if($node[$key] == $value)
            return $node;
    }
}


class ComponentConfig
{
    private $arcontent;

    public function __construct($path)
    {
        $this->_loadcontent($path);
    }

    private function _loadcontent($path)
    {
        $isfile = is_file($path);
        if(!$isfile)
            return;
        $this->arcontent = \json_decode(file_get_contents($path),1);
    }

    public function get_node($key,$value)
    {
        foreach ($this->arcontent as $arnode)
        {
            $objnode = (new Node($arnode))->find_by_key($key,$value);
            if($objnode !== null)
                return $arnode;
        }
        return [];
    }



}//ComponentConfig