<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.3.1
 * @name ComponentPage 
 * @date 05-10-2014 12:14 (SPAIN)
 * @observations: Trocea un array según una cantidad de páginas
 */
class ComponentPage 
{
    private $arItems;
    /**
    * Los items por pagina que se deberan mostrar
    * 
    * @var mixed
    */
    
    private $iNumItemsPerPage;
    private $iNumRequestPage;
    private $iNumOfPages;
    private $isExact = true;
    
    private $sUriPagePattern;
    
    private $isError = false;
    private $sMessage;

    private $isError404 = false;
    
    private $iNumTotalItems;
    private $iNumNextPage;
    private $iNumPreviousPage;
    private $iNumLastPage;
    private $iNumFirstPage;

    public function __construct($arItems=array(),$iNumPage=1,$iItemsPerPage=25,$sUrl="")
    {
        if(!empty($arItems))
        {
            //bug($iNumPage,"iNumPage");
            $this->sUriPagePattern = $sUrl;
            $iNumPage = $this->avoid_not_number($iNumPage);
            $this->iNumRequestPage = $iNumPage;
            //actualiza arItems y iNumtotalItems
            $this->set_items($arItems);
            //actualiza itemps per page
            $this->set_items_per_page($iItemsPerPage);
        }
        else 
        {
            $this->iNumTotalItems = 0;
            $this->iNumNextPage = 1;
            $this->iNumPreviousPage = 1;
            $this->iNumLastPage = 1;
            $this->iNumFirstPage = 1;
        }
    }
    
    /**
    * Si hay error por rango muestra las cabeceras
    * 
    * @param string $sURL  http://www.myurl.com/section/category/page-
    * @param integer $iCode  301|404
    */
    private function send_header($iCode=301,$sURL=null,$sMensaje404="Page not found")
    {
        if(!headers_sent())
        {  
            switch($iCode)
            {
                case 301:
                    header( "HTTP/1.1 301 Moved Permanently" );
                    header ("Location: $sURL");                 
                break;
                case 404:
                    header("HTTP/1.0 404 Not Found");
                    header("Status: 404 Not Found"); 
                    echo $sMensaje404;               
                break;
            } 
            exit;
        }
    }
    
    private function avoid_not_number($string)
    {
        $iEntero = $string;
        if(!is_numeric($iEntero))
            $iEntero = 1;
        return $iEntero;
    }
    
    /**
    * Recupera una cantidad de items desde el array que contiene a
    * todos.  Los items de la pagina correspondiente
    * Hace los sets de los atributos de navegacion
    */
    private function get_array_page_items()
    {
        $arPageItems = array();
        //$this->arItems = $this->arItems;
        $this->iNumTotalItems = count($this->arItems);
        $this->iNumFirstPage = 1;
        $this->iNumNextPage = $this->iNumRequestPage+1;
        $this->iNumPreviousPage = $this->iNumRequestPage-1;
        $this->iNumLastPage = $this->iNumOfPages;
              
        //$this->iNumItemsPerPage = $this->iNumItemsPerPage;
        //$this->iNumRequestPage = $this->iNumRequestPage;
        //$this->iNumOfPages = $this->iNumOfPages;

        //bug($iNumPage); bug($iNumOfPages);        
        //Si la pagina recibida esta en el rango
        if($this->iNumRequestPage>0 && $this->iNumRequestPage<=$this->iNumOfPages)
        {
            //iKeyInicio = 8 x (4-1) = 24
            $iStartKey = $this->iNumItemsPerPage * ($this->iNumRequestPage - 1);
            //iKeyFinal = 24 + (8 - 1) = 24 + 7 = 31
            //En caso de resto == 0 y que la pagina actual no sea
            //la ultima se puede aplicar el key Final asi
            $iLastKey = $iStartKey + ($this->iNumItemsPerPage - 1);
            //Si la pagina actual es la ultima
            if($this->iNumRequestPage == $this->iNumOfPages && !$this->isExact)
            {
                //Las paginas que respetan los items/pagina 
                $iNumOfFullPages = $this->iNumOfPages - 1;
                //El numero de items distribuidos en estas paginas
                $iNumItemsDistributed = $iNumOfFullPages * $this->iNumItemsPerPage;
                $iNumItemsLastPage = $this->iNumTotalItems - $iNumItemsDistributed;
                $iLastKey = $iStartKey + ($iNumItemsLastPage - 1);  
            }

            for($i=$iStartKey; $i<=$iLastKey; $i++)
                $arPageItems[] = $this->arItems[$i];
            //bug($arResultado, "get_array_items");
        }
        //else //La Request page no esta en el rango
            //$arPageItems = null;
        return $arPageItems;
    }
    
    /**
    * Calcula el numero de paginas en las que se puede dividir
    * el array completo
    * @return integer iNumPaginas  El numero de paginas en que se dividira $this->_arItems
    */
    public function load_num_of_pages()
    {
        $arItems = $this->arItems;
        $iItemsPerPage = $this->iNumItemsPerPage;  
        $iTotalItems = count($arItems);
         
        $iNumOfPages = intval($iTotalItems/$iItemsPerPage);
        $iResto = $iTotalItems % $iItemsPerPage;
        //Si el resto es mayor que cero es porque se necesita
        //una pagina mas
        if($iResto>0)
        {
            //Con esto indico que la ultima pagina no tendra
            //un listado respetando "itemps/pagina" sino que sera menor
            $this->isExact = false;
            $iNumOfPages++;
        }

        // bug($iNumOfPages);
        $this->iNumOfPages = $iNumOfPages;        
    }
    
    /**
    * Devuelve la lista de todos los botones !< << i, ii, ... n >> >| 
    * en html
    */
    private function get_navigation_array()
    {
        $arPageButtons = array();
        $iNumOfPages = $this->iNumOfPages;
        $iReqNumPage = $this->iNumRequestPage;
        
        //Hay al menos una pagina
        if($iNumOfPages>0)
        {
            //En caso que se pase una pagina 0 o negativa (Fuera de rango)
            if($iReqNumPage<1)
            {
                //$arButtons = "Error: Page out of range";
                $arPageButtons = null;
                $this->add_error("Error: Page out of range pagina actual:$iReqNumPage, total:$iNumOfPages");
                $this->isError404 = true;
                //$this->send_header(404);
            }
            //Si solo existe una unica pagina
            elseif($iReqNumPage==1 && $iNumOfPages==1)
            {
                $arPageButtons = null;
            }
            //Si estamos en la primera y hay mas de una
            elseif($iReqNumPage==1 && $iNumOfPages>1)
            {
                $arPageButtons["nav_numbers"] = $this->get_buttons_numbers();
                $arPageButtons["nav_next"] = $this->get_buttons_next();
            }
            //Si no es ni la primera ni la ultima                        
            elseif($iReqNumPage>1 && $iReqNumPage<$iNumOfPages)
            {
                $arPageButtons["nav_previous"] = $this->get_buttons_previous();
                $arPageButtons["nav_numbers"] = $this->get_buttons_numbers();
                $arPageButtons["nav_next"] = $this->get_buttons_next();                
            }
            //Si es la ultima                        
            elseif($iReqNumPage>1 && $iReqNumPage==$iNumOfPages)
            {
                $arPageButtons["nav_previous"] = $this->get_buttons_previous();
                $arPageButtons["nav_numbers"] = $this->get_buttons_numbers(); 
            }
            //Si es mayor a la ultima (fuera de rango)                        
            elseif($iReqNumPage>$iNumOfPages)
            {
                $arPageButtons = null;
                $this->add_error("Error: Page out of range pagina actual:$iReqNumPage, total:$iNumOfPages");
                //hacer redirect 404
                //$this->send_header(404);
                $this->isError404=true;
            }
        }
        return $arPageButtons;         
    }
    
    /**
    * Crea un array con todos los botones que llevan un numero de pagina
    * El boton de la pagina actual se crea sin link
    */
    private function get_buttons_numbers()
    {
        $arButton = array();
        $iNumPageNoButton = $this->iNumRequestPage; 
        $iNumOfPages = $this->iNumOfPages;
        $sUrl = $this->sUriPagePattern;
        
        for($i=1; $i<=$iNumOfPages; $i++)
        {
            if($i!=$iNumPageNoButton)
            {
                //bug($sUrl,"url en get_botones numero");
                //$sTmpUrl = $sUrl . $i ."/";
                $sTmpUrl = $sUrl . $i;
                $sButtonAnchor = "<li class=\"\"><a href=\"$sTmpUrl\" page=\"$iNumPage\">$i</a></li>"; 
            }
            else //La pagina con el numero que corresponde al boton
                $sButtonAnchor = "<li class=\"active\"><a href=\"#\" class=\"$iNumPage\">$iNumPageNoButton</a></li>"; 
            $arButton[$i] = $sButtonAnchor;
        }//fin for iNumOfPages 
        
        return $arButton;        
    }
   
    private function get_buttons_previous()
    {
        $arButton = array("start"=>"","end"=>"");
        $this->iNumFirstPage = 1;
        $this->iNumPreviousPage = $this->iNumRequestPage - 1;
        //$iReqNumPage = $this->iNumRequestPage; 
        //$iNumOfPages = $this->iNumOfPages;
        $sUrl = $this->sUriPagePattern;
 
        //Pagina 1
        //$sTmpUrl = $sUrl. 1 ."/";
        $sTmpUrl = $sUrl. $this->iNumFirstPage;
        $arButton["start"] = "<li class=\"\"><a href=\"$sTmpUrl\" page=\"$this->iNumFirstPage\">|&lt;</a></li>"; 
        
        //Pagina anterior a la actual si la actual es>1
        //$sTmpUrl = $sUrl . ($iReqNumPage-1). "/";
        $sTmpUrl = $sUrl . $this->iNumPreviousPage;
        $arButton["previous"] = "<li class=\"\"><a href=\"$sTmpUrl\" page=\"$this->iNumPreviousPage\">&lt;&lt;</a></li>"; 
        
        return $arButton;  
    }
    
    /**
     * Sets iNumNextPage and iNumLastPage 
     * @return $ar["next"],$ar["end"]
     */
    private function get_buttons_next()
    {
        $arButton = array("next"=>"","end"=>"");
        //$iNumLastPage = $this->iNumOfPages;
        //$iNumRequestPage = $this->iNumRequestPage;
        $this->iNumLastPage = $this->iNumOfPages;
        $sUrl = $this->sUriPagePattern;

        //Solo hay siguiente si la pagina_actual es menor a la ultima pagina (o total de paginas)
        if($this->iNumRequestPage<$this->iNumLastPage)
        {
            $this->iNumNextPage = ($this->iNumRequestPage+1);
            $sTmpUrl = $sUrl . $this->iNumNextPage;
            $arButton["next"] = "<li class=\"\"><a href=\"$sTmpUrl\" page=\"$this->iNumNextPage\">&gt;&gt;</a></li>";         
        }
        
        //$sTmpUrl = $sUrl . $iNumLastPage . "/";
        $sTmpUrl = $sUrl . $this->iNumLastPage;
        $arButton["end"] = "<li class=\"\"><a href=\"$sTmpUrl\" page=\"$this->iNumLastPage\">&gt;|</a></li>"; 
       
        return $arButton;          
    }
    
    /**
    * Devuelve un array indexado por enteros con los items que le corresponde
    * a la pagina $this->iNumRequestPage
    */
    public function get_items_to_show(){return $this->get_array_page_items();}

    /**
    * Devuelve un array tipo arBotones[anterior], arBotones[siguiente] ...
    */    
    public function get_buttons_to_show(){return $this->get_navigation_array(); }
    
    /**
    * Devuelve los botones pero en un string. Para poder pintarlos con un echo
    */
    public function get_buttons_in_html()
    {
        $sHtmlButtons = "";
        $sHtmlButtons .= "<ul class=\"\">";
        $arButtons = $this->get_navigation_array();
        //bug($arButtons,"arbotones en get_buttons_in_html");
        
        //Navegacion inicio anterior
        if(!empty($arButtons["nav_previous"]))
        {
            $sHtmlButtons .= $arButtons["nav_previous"]["start"];
            $sHtmlButtons .= $arButtons["nav_previous"]["previous"];
        }
        //Navegacion numeros paginas
        if(!empty($arButtons["nav_numbers"]))
            foreach($arButtons["nav_numbers"] as $sButton)
                $sHtmlButtons .= $sButton;    
        
        //Navegacion siguiente final
        if(!empty($arButtons["nav_next"]))
        {
            $sHtmlButtons.= $arButtons["nav_next"]["next"];
            $sHtmlButtons.= $arButtons["nav_next"]["end"];
        }        
        
        $sHtmlButtons .= "</ul>"; 
        return $sHtmlButtons;
    }
    //**********************************
    //             GETS
    //**********************************    
    /**
    * Determina si ha ocurrido un error al pasar la pagina. 
    * Error de tipo rango
    */
    public function is_error(){return $this->isError;} 
    public function is_error404(){return $this->isError404;} 
    public function get_mensaje(){return $this->sMessage;} 
    public function get_total(){return $this->iNumOfPages;}
    public function get_total_regs(){return $this->iNumTotalItems;}
    public function get_current(){return $this->iNumRequestPage;}
    public function get_next(){return $this->iNumNextPage;}
    public function get_previous(){return $this->iNumPreviousPage;}
    public function get_first(){return $this->iNumFirstPage;}
    public function get_last(){return $this->iNumLastPage;}
    public function get_items_per_page(){return $this->iNumItemsPerPage;}
    
    //**********************************
    //             SETS
    //**********************************    
    private function add_error($sMessage)
    {
        $this->isError=true;
        $this->sMessage=$sMessage;
    }
    
    public function set_request_page($iNumPage){$this->iNumRequestPage = $this->avoid_not_number($iNumPage);}
    public function set_url_pattern($value){$this->sUriPagePattern = $value;}
    public function set_items($arItems){$this->arItems = $arItems; $this->iNumTotalItems = count($arItems);}
    public function set_items_per_page($iNumItems)
    {
        if(!$iNumItems) $iNumItems = 25;
        $this->iNumItemsPerPage = $iNumItems;
        $this->load_num_of_pages();
        //Comprobacion de rangos. 
        if($this->iNumRequestPage<=0 || $this->iNumRequestPage>$this->iNumOfPages)
            $this->add_error("Error: Page out of range. Request page:$this->iNumRequestPage, total:$this->iNumOfPages");
        
    }
}
