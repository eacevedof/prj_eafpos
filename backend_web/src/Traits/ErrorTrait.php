<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Traits\ErrorTrait
 * @file ErrorTrait.php 1.0.0
 * @date 01-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Traits;

trait ErrorTrait
{
    protected $arErrors = [];
    protected $isError = FALSE;
        
    protected function add_error($sMessage){$this->isError = TRUE;$this->arErrors[]=$sMessage;}

    public function is_error(){return $this->isError;}
    public function get_errors($inJson=0){if($inJson) return json_encode($this->arErrors); return $this->arErrors;}
    public function get_error($i=0){isset($this->arErrors[$i])?$this->arErrors[$i]:NULL;}
    public function show_errors(){echo "<pre>".var_export($this->arErrors,1);}    
    
}//ErrorTrait
