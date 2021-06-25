<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 2.0.0
 * @name ComponentMailing
 * @file component_mailing.php
 * @date 30-06-2018 07:58 (SPAIN)
 */

class ComponentMailing 
{
    private $sFromTitle;
    private $sEmailFrom;
    private $mxEmailsTo;
    private $arEmailsCc;
    private $arEmailsBcc;
    
    private $sSubject;
    private $sContent;
    private $sHeader;
    
    private $arHeaders;
    
    private $isSmtpUse;
    private $sSmtpHost;
    private $sSmtpPort;
    private $isSmtpAuth;
    private $sSmtpUser;
    private $sSmtpPassw;
    
    private $sPathAttachment;

    /**
     * 
     * @param string|array $mxEmailTo array tipo array(email1,email2...)
     * @param string $sSubject 
     * @param string|array $mxContent array tipo $arLines = array("line text 1","line text 2"..) or string
     */
    public function __construct($mxEmailTo="",$sSubject="",$mxContent="")
    {
        parent::__construct();
        $this->sFromTitle = "";
        if(defined("APP_MAIL_ISSMTP") && APP_MAIL_ISSMTP!=="") $this->isSmtpUse = APP_MAIL_ISSMTP;
        if(defined("APP_MAIL_SMTP_HOST") && APP_MAIL_SMTP_HOST!=="") $this->sSmtpHost = APP_MAIL_SMTP_HOST;
        if(defined("APP_MAIL_SMTP_PORT") && APP_MAIL_SMTP_PORT!=="") $this->sSmtpPort = APP_MAIL_SMTP_PORT;
        if(defined("APP_MAIL_SMTP_AUTH") && APP_MAIL_SMTP_AUTH!=="") $this->isSmtpAuth = APP_MAIL_SMTP_AUTH;
        if(defined("APP_MAIL_SMTP_USER") && APP_MAIL_SMTP_USER!=="") $this->sSmtpUser = APP_MAIL_SMTP_USER;
        if(defined("APP_MAIL_SMTP_PASSW")) $this->sSmtpPassw = APP_MAIL_SMTP_PASSW;
        if($this->sSmtpUser) $this->sEmailFrom = $this->sSmtpUser;

        $this->mxEmailsTo = array();
        $this->arHeaders = array();
        $this->arHeaders[] = "MIME-Version: 1.0";
        //$this->arHeaders[] = "Content-Type: text/html; charset=ISO-8859-1";
        $this->arHeaders[] = "Content-Type: text/html; charset=UTF-8";
        //add boundary string and mime type specification
        $this->_header[] = "Content-Transfer-Encoding: 8bit";
        if($mxEmailTo) $this->mxEmailsTo[] = $mxEmailTo;
        $this->sSubject = $sSubject;
        
        if(is_array($mxContent)) 
            $mxContent = implode(PHP_EOL,$mxContent);
        $this->sContent = $mxContent;
        
        //esto recupera datos de: AppComponentExtconfig 
        if(class_exists("AppComponentExtconfig"))
        {
            /*   ray(  "host" => "smtp.packprotecciononline.es",
                    "port" => "587",
                    "email_username" => "noreply@packprotecciononline.es",
                    "email_password" =>  "q4hHJ3R1",
                    "email_source" => "noreply@packprotecciononline.es",
                    'mailer'=>'smtp',
                    'smtppauth'=>true,
                    'smtpsecure' => 'tls'*/
            $this->sSmtpHost = AppComponentExtconfig::get_emailzurich1("host");
            $this->sSmtpUser = AppComponentExtconfig::get_emailzurich1("email_username");
            $this->sSmtpPassw = AppComponentExtconfig::get_emailzurich1("email_password");
            $this->sSmtpProtocol = AppComponentExtconfig::get_emailzurich1("mailer");
            $this->sSmtpPort = AppComponentExtconfig::get_emailzurich1("port");
            $this->isSmtpAuth = AppComponentExtconfig::get_emailzurich1("smtppauth");
            $this->sSmtpSecure = AppComponentExtconfig::get_emailzurich1("smtpsecure");
        }
    }//__construct
    
    private function send_pear()
    {
        $this->log_email("send_pear()",__CLASS__);
        //errorson();
        //necesita tener instalado:
        // PEAR https://pear.php.net/manual/en/installation.checking.php
        // Mail,Mail_Mime,Net_SMTP,Net_Socket
        // sudo pear install <pack> --alldeps
        
        //C:\xampp\php>pear list
        require_once("Mail.php");
        require_once("Mail/mime.php");
        
        $arSmtp = array();
        $arSmtp["host"] = $this->sSmtpHost;
        $arSmtp["port"] = $this->sSmtpPort;
        $arSmtp["auth"] = $this->isSmtpAuth;
        $arSmtp["username"] = $this->sSmtpUser;
        $arSmtp["password"] = $this->sSmtpPassw;
        //$arSmtp["debug"] = 1;
        //bug($arSmtp,"arSmtp");die;
        try 
        {
            $oSmtp = Mail::factory("smtp",$arSmtp);
            
            $arHeaders = array();
            $arHeaders["Content-Type"] = "text/html; charset=UTF-8";
            //$arHeaders["From"] = $this->sEmailFrom;
            if(is_array($this->mxEmailsTo)) 
                $this->mxEmailsTo = implode(", ",$this->mxEmailsTo);            
            $arHeaders["To"] = $this->mxEmailsTo;
            if($this->arEmailsCc) $arHeaders["Cc"] = implode(", ",$this->arEmailsCc);
            if($this->arEmailsBcc) $sBcc = ", ".implode(", ",$this->arEmailsBcc);
            $arHeaders["Subject"] = $this->sSubject;
            //bug($arHeaders);die;
            $arHeaders["From"] = $this->sEmailFrom;
            
            $oMime = new Mail_mime(array("eol"=>PHP_EOL));
            //$oMime->setTXTBody("texto body"); //texto sin html
            $oMime->setHTMLBody($this->sContent); //texto con html
            
            if($this->sPathAttachment)
                $oMime->addAttachment($this->sPathAttachment,"text/plain");

            $arMime = array(
              "text_encoding" => "7bit",
              "text_charset" => "UTF-8",
              "html_charset" => "UTF-8",
              "head_charset" => "UTF-8"
            );

            //do not ever try to call these lines in reverse order
            $sContent = $oMime->get($arMime);
            $arHeaders = $oMime->headers($arHeaders);
            //la única forma de enviar con copia oculta es añadirlo a los receptores
            $sEmailsTo = $arHeaders["To"].$sBcc;
            //->send es igual a: mail($recipients, $subject,$body,$text_headers);
            $oEmail = $oSmtp->send($sEmailsTo,$arHeaders,$sContent);
            
            if(PEAR::isError($oEmail))
            {
                $this->add_error($oEmail->getMessage());
            }
        } 
        catch(Exception $oEx) 
        {
            $this->add_error($oEx->getMessage());
        }
        //bug($this->arErrorMessages);die;
        return $this->isError;
    }//send_smtp
    
    /**
     * uses function mail(...)
     * @return boolean 
     */
    private function send_nosmtp()
    {  
        $this->log_email("send_nosmtp()",__CLASS__);
        $this->build_header_from();
        $this->build_header_cc();//crea header: Cc
        $this->build_header_bcc();//crea header: Bcc
        //crea los header en $this->_header
        $this->build_header();
        
        $this->log_email("mailsto:$this->mxEmailsTo,subject:$this->sSubject,header:$this->sHeader",__CLASS__."send_nosmtp()");        
        if($this->mxEmailsTo)
        {
            if(is_array($this->mxEmailsTo)) 
                $this->mxEmailsTo = implode(", ",$this->mxEmailsTo);
            
            //TRUE if success
            /*
            telnet 127.0.0.1 25
            220 eduardosvc ESMTP Sendmail 8.14.4/8.14.4/Debian-4.1ubuntu1; Thu, 25 Feb 2016 10:47:44 +0100; 
            (No UCE/UBE) logging access from: caser.loc(OK)-caser.loc [127.0.0.1]
            */
            $this->log_email("antes de llamar a funcion mail",__CLASS__);
            //$this->log_email("mailsto:$this->mxEmailsTo,subject:$this->sSubject,content:$this->sContent,header:$this->sHeader");
            $mxStatus = mail($this->mxEmailsTo,$this->sSubject,$this->sContent,$this->sHeader);
            $this->log_email($mxStatus,__CLASS__." status mail(..)");
            if($mxStatus == FALSE)
            {
                $this->add_error("Error sending email!"); 
            }
        }
        else 
        {
            $this->add_error("No target emails!");
        }
        return $this->isError;
    }//send_nosmtp
        
    
    /**
     * Utiliza la funcion mail. Se puede recuperar el error con $this->get_error_message();
     * @return boolean TRUE if error occurred
     */
    public function send()
    {
        if($this->isSmtpUse)
            return $this->send_pear();
        return $this->send_nosmtp();
    }   

    private function build_header()
    {
        $sHeader = implode(PHP_EOL,$this->arHeaders);
        $this->sHeader = $sHeader;
    }
    
    private function build_header_from()
    {
        if($this->sEmailFrom)
        {
            $this->arHeaders[] = "From: $this->sFromTitle <$this->sEmailFrom>";
            $this->arHeaders[] = "Return-Path: <$this->sEmailFrom>";
            $this->arHeaders[] = "X-Sender: $this->sEmailFrom";
        }
    }
    
    private function build_header_cc()
    {
        if($this->arEmailsCc)
            $this->arHeaders[] = "Cc: ".implode(", ",$this->arEmailsCc);
    }    
    
    private function build_header_bcc()
    {
        if($this->arEmailsBcc)
            $this->arHeaders[] = "Bcc: ".implode(", ",$this->arEmailsBcc);
    }      

    //**********************************
    //             SETS
    //**********************************
    public function set_subject($sSubject){$this->sSubject = $sSubject;}
    public function set_email_from($sEmail){$this->sEmailFrom = $sEmail;}
    public function set_emails_to($mxEmails){$this->mxEmailsTo = $mxEmails;}
    public function add_email_to($sEmail){$this->mxEmailsTo[]=$sEmail;}
    public function set_emails_cc($arEmails){$this->arEmailsCc = $arEmails;}
    public function add_email_cc($sEmail){$this->arEmailsCc[]=$sEmail;}
    public function set_emails_bcc($arEmails){$this->arEmailsBcc = $arEmails;}
    public function add_email_bcc($sEmail){$this->arEmailsBcc[]=$sEmail;}
    public function set_header($sHeader){$this->sHeader = $sHeader;}
    public function set_content($mxContent){(is_array($mxContent))? $this->sContent=implode(PHP_EOL,$mxContent): $this->sContent = $mxContent;}
    public function set_title_from($sTitle){$this->sFromTitle = $sTitle;}
    
    /**
     *  Required
        "MIME-Version: 1.0"
        "Content-type: text/html; charset=iso-8859-1"
        Optional
     *  "From: Recordatorio <cumples@example.com>"
        "To: Mary <mary@example.com>, Kelly <kelly@example.com>"
        "Cc: birthdayarchive@example.com"
        "Bcc: birthdaycheck@example.com"
     * mail($to,$subject,$message,$headers);
     * 
     * @param string $sHeader Cualquer linea anterior
     */
    public function add_header($sHeader){$this->arHeaders[] = $sHeader;}
    public function clear_headers(){$this->arHeaders=array();}
    
    public function set_smtp_use($isOn=TRUE){$this->isSmtpUse=$isOn;}
    public function set_smtp_host($sValue){$this->sSmtpHost=$sValue;}
    public function set_smtp_port($sValue){$this->sSmtpPort=$sValue;}
    public function set_smtp_auth($isOn=TRUE){$this->isSmtpAuth=$isOn;}
    public function set_smtp_user($sValue){$this->sSmtpUser=$sValue;}
    public function set_smtp_passw($sValue){$this->sSmtpPassw=$sValue;}  
    //**********************************
    //             GETS
    //**********************************

}//ComponentMailing