<?php
//falta el fichero arrays que trae funciones para tratar con arrays
/**
 * set ACL to private
 * @var string
 */
define("S3_ACL_PRIVATE","private");
/**
 * set ACL to public, just read
 * @var string
 */
define("S3_ACL_PUBLIC","public");

/**
 * Basic library to upload files to s3
 *
 * @author llafuente
 */
class ComponentS3 {
    /***
     * XXX config must me moved!!!
     */
    protected $config =null;
    protected $s3_access_key=null;
    protected $s3_secret_key=null;
    public    $credentials=null;
    protected $log=null;

    /**
     * config file [$config = array(...)] or array
     * @param mixed $config
     */
    function __construct($cfg=null) {
        include("/etc/config.php");

        include("/etc/s3cfg.php");
        if (file_exists("/etc/s3_config.php")) {
            include("/etc/s3_config.php");
        }





        $this->config = $config;
        $this->credentials = $s3_credentials;

        if (defined("DEV_PROD_CONFIG")) $this->credentials="/etc/s3cfg";

        $this->s3_access_key = $s3_access_key;
        $this->s3_secret_key = $s3_secret_key;

        if(is_array($cfg)) {
            $this->config = $cfg;
        }
    }

    public function setup_log($log) {
        $this->log=$log;
    }

    /**
     *
     * @param string $upload_file_tmp uri
     * @param string $uploaded_file_name just the filename
     * @param string $bname name of the configuration bucket
     * @param array $options overriden config, special config for the upload
     * @return int return code of s3cmd, if != 0 error!
     */
    function put($upload_file_tmp, $uploaded_file_name, $bname="default", $options=array()) {

        $config = $this->config[$bname];
        $config = array_merge_recursive_unique($config,$options);

        switch ($config["acl"]) {
            case S3_ACL_PUBLIC :
                $acl ="--acl-public";
                break;
            case  S3_ACL_PRIVATE :
            default :
                $acl="--acl-private";
                break;
        }

        $cmd = "s3cmd --config={$this->credentials} $acl put $upload_file_tmp s3://{$config["bucket"]}/$uploaded_file_name";
        $output=$retcode=null;
        exec($cmd, $output, $retcode);

        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");


        return $retcode;
    }



    /**
     * create a certified url to a private file
     * @param $bname
     * @param $relpath
     * @param $validtime
     * @return string valid uri
     */
    public function get_link ($bname, $relpath, $options=array()) {
        $config = $this->config[$bname];
        $config = array_merge_recursive_unique($config,$options);

        $bucket = $config["bucket"];
        // aqui se definen $s3_access_key $s3_secret_key

        if (isset($options["force_access_key"])) $this->s3_access_key=$options["force_access_key"];
        if (isset($options["force_secret_key"])) $this->s3_secret_key=$options["force_secret_key"];

        $timestamp = time()+$config["default_validtime"];
        $strtosign = "GET\n\n\n$timestamp\n/$bucket/$relpath";
        $signature = urlencode(base64_encode(hash_hmac("sha1", utf8_encode($strtosign), $this->s3_secret_key, true)));
        $s3uri = $config["uribase"]."$relpath?AWSAccessKeyId=$this->s3_access_key&amp;Expires=$timestamp&amp;Signature=$signature";
        return $s3uri;
    }

    function upload($upload_file_tmp, $s3_destination/*ej: s3://BUCKET/fichero.htm*/, $options=array()) {

        $command_options="";
        if (isset($options["command_options"])) $command_options=$options["command_options"];

        $cmd = "s3cmd  --config={$this->credentials} $command_options put \"$upload_file_tmp\" \"$s3_destination\"";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);

        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }

    function change_name_s3_lab($upload_file_tmp, $s3_destination/*ej: s3://BUCKET/fichero.htm*/, $options=array()) {

        $command_options="";
        if (isset($options["command_options"])) $command_options=$options["command_options"];


        $cmd = "s3cmd  --config=/etc/s3cfg-lab $command_options mv \"$upload_file_tmp\" \"$s3_destination\"";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);


        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }
    
    function upload_s3_lab($upload_file_tmp, $s3_destination/*ej: s3://BUCKET/fichero.htm*/, $options=array()) {

        $command_options="";
        if (isset($options["command_options"])) $command_options=$options["command_options"];


        $cmd = "s3cmd  --config=/etc/s3cfg-lab $command_options put \"$upload_file_tmp\" \"$s3_destination\"";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);


        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }

    function copy_s3_lab($upload_file_tmp, $s3_destination/*ej: s3://BUCKET/fichero.htm*/, $options=array()) {

        //copia (archivo/carpeta) dentro del mismo bucket
        $command_options="";
        if (isset($options["command_options"])) $command_options=$options["command_options"];


        $cmd = "s3cmd  --config=/etc/s3cfg-lab $command_options cp \"$upload_file_tmp\" \"$s3_destination\"";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);


        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }

    function delete_s3_lab($s3_destination/*ej: s3://BUCKET/fichero.htm*/, $options=array()) {

        $command_options="";
        if (isset($options["command_options"])) $command_options=$options["command_options"];


        $cmd = "s3cmd  --config=/etc/s3cfg-lab del \"s3://egt-lab-design/Batch/tmp/\"$s3_destination\"/\"  $command_options";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);


        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }

    public function s3cmd($parameters, &$retcode=0, $options="") {
        $this->debug("s3.php->s3cmd()");

        $cmd = "s3cmd  --config={$this->credentials} $parameters";
        $cmd.=" 2>&1";
        $output=$retcode=null;

        $desc=isset($options["desc"])?$options["desc"]:"DESC_NOTSET";


        $this->shell($cmd,$output,$retcode);
        $files=0;
        if (is_array($output)) {
            foreach ($output as $line) {
                if (preg_match("@^File '@", $line)) {
                    $files++;
                }
            }

        }

        $this->debug("sls: desc:[$desc]  retcode:$retcode filesuploaded:$files s3cmd $cmd ");

        return $output;
    }

   public function s3cmd_110_beta3($parameters, &$retcode=0) {
        $this->debug("s3.php->s3cmd_110_beta3()");


        $cmd = "/usr/local/bin/s3cmd-1.1.0-beta3/s3cmd  --config={$this->credentials} $parameters";
        $cmd.=" 2>&1";
        $output=$retcode=null;

        $this->debug($cmd);

        exec($cmd, $output, $retcode);

        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $output;
    }


    function debug($str, $options=false) {
        if (!isset($this->log)) return;
        $this->log->debug($str, $options);

    }

    function download($s3uri, $destination) {

        $cmd = "s3cmd  --config={$this->credentials} --force get '$s3uri' $destination";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);

        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $retcode;
    }


    function sync_gzipped($local_path, $s3path, $s3sync_options, $options) {
        $work_path=$this->create_temp_path("/tmp/TMPS3_PHP/",date("Ymd"));

        $options["s3path"]          = $s3path;
        $options["s3sync_options"]  = $s3sync_options;
        $options["local_path"]      = $work_path;

        $this->shell("rsync -av  $local_path/* $work_path", $output, $retcode);

        $this->sync_htmls_gzipped("--mime-type='text/html; charset=UTF-8'", $options);
        $this->sync_types_gzipped(".js","--mime-type='text/javascript;'"  , $options);
        $this->sync_types_gzipped(".css","--mime-type='text/css;'"        , $options);
        $this->sync_resto($options);

        $this->delete_work_path($work_path);
    }

    function sync_gzipped_types($local_path, $s3path, $s3sync_options, $options) {
        $work_path=$this->create_temp_path("/tmp/TMPS3_PHP/",date("Ymd"));

        $options["s3path"]          = $s3path;
        $options["s3sync_options"]  = $s3sync_options;
        $options["local_path"]      = $work_path;

        $this->shell("rsync -av  $local_path/* $work_path", $output, $retcode);

        if (isset($options["html"])) $this->sync_htmls_gzipped("--mime-type='text/html; charset=UTF-8'", $options);
        if (isset($options["js"]))   $this->sync_types_gzipped(".js","--mime-type='text/javascript;'"  , $options);
        if (isset($options["css"]))  $this->sync_types_gzipped(".css","--mime-type='text/css;'"        , $options);
        if (isset($options["png"]))  $this->sync_types_gzipped(".png","--mime-type='image/png;'"       , $options);
        if (isset($options["ico"]))  $this->sync_types_gzipped(".ico","--mime-type='image/x-icon;'"    , $options);
        if (isset($options["gif"]))  $this->sync_types_gzipped(".gif","--mime-type='image/gif;'"       , $options);
        if (isset($options["jpg"]))  $this->sync_types_gzipped(".jpg","--mime-type='image/jpeg;'"      , $options);
        $this->sync_resto($options);

        $this->delete_work_path($work_path);
    }


    function sync_htmls_gzipped($mime_type, $options) {

        $cmd='cd '.$options["local_path"].';/usr/bin/find . |egrep -vi "\.(png|gif|jpg|jpeg|js|css|pdf|exe|ico|xls|doc)$" |xargs file -i --separator "::::::::::"';
        $this->shell($cmd, $output, $retcode);
        $work_files=array();
        foreach ($output as $line) {
            if (!preg_match("@(.*)::::::::::(.*)$@", $line, $x)) continue;
            $file=trim($x[1]);
            $type=trim($x[2]);

            if (!preg_match("@text@i",$type)) continue;

            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $extensions[$extension]=$extension;

            $work_files[]=$file;
        }




        $options["desc"]="sync_htmls_gzipped(".implode("|",$extensions).")";

        $work_path=$this->create_temp_path("/tmp/TMPS3_PHP/",date("Ymd"));
        $this->_move_files($options["local_path"], $work_files, $work_path);

        $this->gzip_files($work_path);

        $cmd=" ".$options["s3sync_options"]." $mime_type --add-header='Content-Encoding: gzip' --guess-mime-type put --recursive $work_path/ ".$options["s3path"];


        if (isset($options["s3cmd_110_beta3"])) {
            $this->s3cmd_110_beta3($cmd);
        }
        else {
            $this->s3cmd($cmd, $retcode, $options);
        }

        $this->borrar_ficheros_ya_publicados($work_files, $options["local_path"]);

        $this->delete_work_path($work_path);



    }

    function delete_work_path($work_path) {
        if (!empty($work_path) && preg_match("@tmp@",$work_path)) {
            $this->shell("rm -Rf $work_path", $output, $retcode);
        }

    }

    function sync_types_gzipped($extension,$mime_type,$options) {

        $cmd='cd '.$options["local_path"].';/usr/bin/find . |grep "'.str_replace(".","\.",$extension).'$"';
        $this->shell($cmd, $output, $retcode);
        if($retcode != 0) {
            return;
        }

        $work_files=array();
        foreach ($output as $line) {
            $file=$line;
            $work_files[]=$file;
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $extensions[$extension]=$extension;

        }

        $options["desc"]="sync_types_gzipped(".implode("|",$extensions).")";

        $work_path=$this->create_temp_path("/tmp/TMPS3_PHP/",date("Ymd"));
        $this->_move_files($options["local_path"], $work_files, $work_path);

        $this->gzip_files($work_path);

        $cmd=" ".$options["s3sync_options"]." --add-header='Content-Encoding: gzip' ".$mime_type." put --recursive $work_path/ ".$options["s3path"];
        if (isset($options["s3cmd_110_beta3"])) {
            $this->s3cmd_110_beta3($cmd);
        }
        else {
            $this->s3cmd($cmd, $retcode, $options);
        }

        $this->borrar_ficheros_ya_publicados($work_files, $options["local_path"]);

        $this->delete_work_path($work_path);



    }

    function sync_resto($options) {

        $cmd='cd '.$options["local_path"].';/usr/bin/find . ';
        $this->shell($cmd, $output, $retcode);
        $work_files=array();
        foreach ($output as $line) {
            $file=$line;
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $extensions[$extension]=$extension;
        }

        $options["desc"]="sync_resto(".implode("|",$extensions).")";

        $cmd=" ".$options["s3sync_options"]." --no-guess-mime-type put  --recursive ".$options["local_path"]."/ ".$options["s3path"];
        if (isset($options["s3cmd_110_beta3"])) {
            $this->s3cmd_110_beta3($cmd);
        }
        else {
            $this->s3cmd($cmd, $retcode, $options);
        }


    }

    function borrar_ficheros_ya_publicados($work_files, $path) {
        foreach ($work_files as $file) {
            $file=$path."/".$file;
            $this->debug("$file");

            if (is_file($file)) {
                $this->debug("borrando $file");
                unlink($file);
            }

        }

    }

    function gzip_files($path) {
        $cmd='/usr/bin/find '.$path.' -type f | while read LINE; do  gzip $LINE;  mv $LINE.gz $LINE; done';
        $this->shell($cmd, $output, $retcode);
    }

    function _move_files ($base_path, $work_files, $path) {
        $buffer="";
        foreach ($work_files as $file) {
            $buffer.=$file."\n";
        }

        $files_rsync=$path."/files.txt";
        $this->create_file($buffer, $files_rsync);


        $cmd="rsync -av --files-from=$files_rsync $base_path $path";
        $this->shell($cmd, $output, $retcode);
        unlink($files_rsync);

    }


    function create_temp_path($dir, $prefix='', $mode=0700) {
        if (!is_dir($dir)) mkdir ($dir,0777);
        if (substr($dir, -1) != '/') $dir .= '/';

        do {
             $path = $dir.$prefix.mt_rand(0, 9999999);
        } while (!mkdir($path, $mode));

        return $path;
  }


    function create_file($buffer, $file, $create_path=true) {
        if ($create_path) {
            $path=dirname($file);
            if (!is_dir($path)) mkdir ($path, 777, true);
        }


        $fp=fopen($file, "a+");
        fwrite($fp, $buffer);
        fclose($fp);
    }



    function shell($cmd, &$output, &$retcode) {
        $this->debug("shell command: $cmd");
        exec($cmd, $output, $retcode);
        $this->debug("shell output: ".implode("\n",$output),array("skip-cut-log"=>true));
        $this->debug("shell retcode: $retcode");

    }

    public function get_object_info ($bname, $relpath, $options=array()) {

        $config = $this->config[$bname];
        $config = array_merge_recursive_unique($config,$options);

        $bucket = $config["bucket"];

        $cmd = "s3cmd  --config={$this->credentials} --force info s3://$bucket/$relpath";
        $output=$retcode=null;

        exec($cmd, $output, $retcode);

        $this->debug($cmd);
        $this->debug($output);
        $this->debug("retcode:$retcode");

        return $output;
    }





}

