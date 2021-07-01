<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @version 1.1.0
 * @name TheFramework\Helpers\HelperJson
 * @date 29-06-2019 15:12 (SPAIN)
 * @file helper_json.php
 * @observations
 *  https://restfulapi.net/http-status-codes/
 */
namespace TheFramework\Helpers;

final class HelperJson
{
    const CODE_CONTINUE = 100;  
    const CODE_SWITCHING_PROTOCOLS = 101;  
    const CODE_PROCESSING = 102;  

    const CODE_OK = 200;  
    const CODE_CREATED = 201;  
    const CODE_ACCEPTED = 202;  //para procesos en background
    const CODE_NON_AUTHORITATIVE_INFORMATION = 203;  
    const CODE_NO_CONTENT = 204;  
    const CODE_RESET_CONTENT = 205;  
    const CODE_PARTIAL_CONTENT = 206;  
    const CODE_MULTI_STATUS = 207;  
    const CODE_ALREADY_REPORTED = 208;  
    const CODE_IM_USED = 226;  

    const CODE_MULTIPLE_CHOICES = 300;  
    const CODE_MOVED_PERMANENTLY = 301;  
    const CODE_FOUND = 302;  
    const CODE_SEE_OTHER = 303;  
    const CODE_NOT_MODIFIED = 304;  
    const CODE_USE_PROXY = 305;  
    const CODE_SWITCH_PROXY = 306;  
    const CODE_TEMPORARY_REDIRECT = 307;  
    const CODE_PERMANENT_REDIRECT = 308;  

    const CODE_BAD_REQUEST = 400;  
    const CODE_UNAUTHORIZED = 401;  
    const CODE_PAYMENT_REQUIRED = 402;  
    const CODE_FORBIDDEN = 403;  
    const CODE_NOT_FOUND = 404;  
    const CODE_METHOD_NOT_ALLOWED = 405;  
    const CODE_NOT_ACCEPTABLE = 406;  
    const CODE_PROXY_AUTHENTICATION_REQUIRED = 407;  
    const CODE_REQUEST_TIMEOUT = 408;  
    const CODE_CONFLICT = 409;  
    const CODE_GONE = 410;  
    const CODE_LENGTH_REQUIRED = 411;  
    const CODE_PRECONDITION_FAILED = 412;  
    const CODE_REQUEST_ENTITY_TOO_LARGE = 413;  
    const CODE_REQUEST_URI_TOO_LONG = 414;  
    const CODE_UNSUPPORTED_MEDIA_TYPE = 415;  
    const CODE_REQUESTED_RANGE_NOT_SATISFIABLE = 416;  
    const CODE_EXPECTATION_FAILED = 417;  
    const CODE_IM_A_TEAPOT = 418;  
    const CODE_AUTHENTICATION_TIMEOUT = 419;  
    const CODE_ENHANCE_YOUR_CALM = 420;  
    const CODE_METHOD_FAILURE = 420;  
    const CODE_UNPROCESSABLE_ENTITY = 422;  
    const CODE_LOCKED = 423;  
    const CODE_FAILED_DEPENDENCY = 424;  
    const CODE_UNORDERED_COLLECTION = 425;  
    const CODE_UPGRADE_REQUIRED = 426;  
    const CODE_PRECONDITION_REQUIRED = 428;  
    const CODE_TOO_MANY_REQUESTS = 429;  
    const CODE_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;  
    const CODE_NO_RESPONSE = 444;  
    const CODE_RETRY_WITH = 449;  
    const CODE_BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS = 450;  
    const CODE_REDIRECT = 451;  
    const CODE_UNAVAILABLE_FOR_LEGAL_REASONS = 451;  
    const CODE_REQUEST_HEADER_TOO_LARGE = 494;  
    const CODE_CERT_ERROR = 495;  
    const CODE_NO_CERT = 496;  
    const CODE_HTTP_TO_HTTPS = 497;  
    const CODE_CLIENT_CLOSED_REQUEST = 499; 

    const CODE_INTERNAL_SERVER_ERROR = 500;  
    const CODE_NOT_IMPLEMENTED = 501;  
    const CODE_BAD_GATEWAY = 502;  
    const CODE_SERVICE_UNAVAILABLE = 503;  
    const CODE_GATEWAY_TIMEOUT = 504;  
    const CODE_HTTP_VERSION_NOT_SUPPORTED = 505;  
    const CODE_VARIANT_ALSO_NEGOTIATES = 506;  
    const CODE_INSUFFICIENT_STORAGE = 507;  
    const CODE_LOOP_DETECTED = 508;  
    const CODE_BANDWIDTH_LIMIT_EXCEEDED = 509;  
    const CODE_NOT_EXTENDED = 510;  
    const CODE_NETWORK_AUTHENTICATION_REQUIRED = 511;  
    const CODE_NETWORK_READ_TIMEOUT_ERROR = 598;  
    const CODE_NETWORK_CONNECT_TIMEOUT_ERROR = 599;  

    private $arCodes;
    private $arResponse;

    public function __construct($arPayload=[])
    {
        //https://jsonapi.org/format/
        $this->arResponse["header"]["http"]["code"] = 200; 
        $this->arResponse["header"]["http"]["message"] = "200 ok"; //CODIGO MENSAJE
        //$this->arResponse["header"]["Allow"] = "GET, HEAD, OPTIONS";
        //$this->arResponse["header"]["Content-Type"] = "application/json";
        //$this->arResponse["header"]["Vary"] = "Accept";

        $this->arResponse["payload"]["status"] = 1;
        $this->arResponse["payload"]["message"] = "";
        $this->arResponse["payload"]["links"] = [];
        $this->arResponse["payload"]["errors"] = [];
        $this->arResponse["payload"]["data"] = $arPayload;
        $this->arResponse["payload"]["included"] = [];
        $this->load_codes();
        return $this;
    }

    private function _send_cors_headers()
    {
        if(isset($_SERVER["HTTP_ORIGIN"]))
        {
            //No 'Access-Control-Allow-Origin' header is present on the requested resource.
            //should do a check here to match $_SERVER["HTTP_ORIGIN"] to a
            //whitelist of safe domains
            header("Access-Control-Allow-Origin: {$_SERVER["HTTP_ORIGIN"]}");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Max-Age: 86400");// cache for 1 day
            //header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');
        }
    }

    public function show($isExit=0)
    {
        // clear the old headers
        header_remove();

        $this->_send_cors_headers();
        // set the actual code
        http_response_code($this->arResponse["header"]["http"]["code"]);
        // set the header to make sure cache is forced
        header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
        // treat this as json
        header('Content-Type: application/json');
        // ok, validation error, or failure
        header("Status: {$this->arResponse["header"]["http"]["message"]}");        

        $sJson = json_encode($this->arResponse["payload"]);
        echo $sJson;
        if($isExit) exit();
    }

    private function load_codes()
    {
        /**
         * Content from http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
         **/
        $this->arCodes = [
            100 => "Continue",
            101 => "Switching Protocols",
            102 => "Processing", // WebDAV; RFC 2518
            200 => "OK",
            201 => "Created",
            202 => "Accepted",
            203 => "Non-Authoritative Information", // since HTTP/1.1
            204 => "No Content",
            205 => "Reset Content",
            206 => "Partial Content",
            207 => "Multi-Status", // WebDAV; RFC 4918
            208 => "Already Reported", // WebDAV; RFC 5842
            226 => "IM Used", // RFC 3229
            300 => "Multiple Choices",
            301 => "Moved Permanently",
            302 => "Found",
            303 => "See Other", // since HTTP/1.1
            304 => "Not Modified",
            305 => "Use Proxy", // since HTTP/1.1
            306 => "Switch Proxy",
            307 => "Temporary Redirect", // since HTTP/1.1
            308 => "Permanent Redirect", // approved as experimental RFC
            400 => "Bad Request",
            401 => "Unauthorized",
            402 => "Payment Required",
            403 => "Forbidden",
            404 => "Not Found",
            405 => "Method Not Allowed",
            406 => "Not Acceptable",
            407 => "Proxy Authentication Required",
            408 => "Request Timeout",
            409 => "Conflict",
            410 => "Gone",
            411 => "Length Required",
            412 => "Precondition Failed",
            413 => "Request Entity Too Large",
            414 => "Request-URI Too Long",
            415 => "Unsupported Media Type",
            416 => "Requested Range Not Satisfiable",
            417 => "Expectation Failed",
            418 => "I\"m a teapot", // RFC 2324
            419 => "Authentication Timeout", // not in RFC 2616
            420 => "Enhance Your Calm", // Twitter
            420 => "Method Failure", // Spring Framework
            422 => "Unprocessable Entity", // WebDAV; RFC 4918
            423 => "Locked", // WebDAV; RFC 4918
            424 => "Failed Dependency", // WebDAV; RFC 4918
            424 => "Method Failure", // WebDAV)
            425 => "Unordered Collection", // Internet draft
            426 => "Upgrade Required", // RFC 2817
            428 => "Precondition Required", // RFC 6585
            429 => "Too Many Requests", // RFC 6585
            431 => "Request Header Fields Too Large", // RFC 6585
            444 => "No Response", // Nginx
            449 => "Retry With", // Microsoft
            450 => "Blocked by Windows Parental Controls", // Microsoft
            451 => "Redirect", // Microsoft
            451 => "Unavailable For Legal Reasons", // Internet draft
            494 => "Request Header Too Large", // Nginx
            495 => "Cert Error", // Nginx
            496 => "No Cert", // Nginx
            497 => "HTTP to HTTPS", // Nginx
            499 => "Client Closed Request", // Nginx
            500 => "Internal Server Error",
            501 => "Not Implemented",
            502 => "Bad Gateway",
            503 => "Service Unavailable",
            504 => "Gateway Timeout",
            505 => "HTTP Version Not Supported",
            506 => "Variant Also Negotiates", // RFC 2295
            507 => "Insufficient Storage", // WebDAV; RFC 4918
            508 => "Loop Detected", // WebDAV; RFC 5842
            509 => "Bandwidth Limit Exceeded", // Apache bw/limited extension
            510 => "Not Extended", // RFC 2774
            511 => "Network Authentication Required", // RFC 6585
            598 => "Network read timeout error", // Unknown
            599 => "Network connect timeout error", // Unknown
        ];        
    }
  
    //**********************************
    //             SETS
    //**********************************
    public function set_payload($arData)
    {
        $this->arResponse["payload"]["data"] = $arData;
        return $this;
    }

    public function set_links($arLinks)
    {
        $this->arResponse["payload"]["links"] = $arLinks;
        return $this;
    }

    public function set_error($arErrors)
    {
        $this->arResponse["payload"]["errors"] = $arErrors;
        return $this;
    }        

    public function set_code($iCode)
    {
        $this->arResponse["payload"]["status"] = ($iCode<300);
        $this->arResponse["header"]["http"]["code"] = $iCode;
        $this->arResponse["header"]["http"]["message"] = "$iCode {$this->arCodes[$iCode]}";
        return $this;
    }

    public function set_message($sErrMessage)
    {
        $this->arResponse["payload"]["message"] = $sErrMessage?? $this->arResponse["header"]["http"]["message"];
        return $this;        
    }

    //**********************************
    //             GETS
    //**********************************

}//HelperJson