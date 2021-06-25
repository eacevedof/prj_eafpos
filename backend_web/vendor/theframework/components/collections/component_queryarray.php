<?php

class ComponentQueryarray
{
    private $array;
    private $array2;
    private $result;

    public function __construct($data)
    {
        $this->array = $data;
    }

    public function get_colum($colname){
        return array_column($this->array,$colname);
    }

    public function where()
    {

    }

    public function set_array2($array){$this->array2 = $array;}

}//ComponentQueryarray