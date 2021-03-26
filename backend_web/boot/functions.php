<?php
//functions.php 20200721
function appboot_loadenv()
{
    $arpaths = [
        "%PATH_PUBLIC%" => PATH_PUBLIC, "%PATH_ROOT%" => PATH_ROOT,
        "%PATH_SRC%" => PATH_SRC, "%PATH_SRC_CONFIG%" => PATH_SRC_CONFIG
    ];
    
    $arEnvs = ["local" => ".env.local", "dev" => ".env.dev","test" => ".env.test","prod" => ".env", ];

    foreach ($arEnvs as $envtype => $envfile) {
        $pathenv = PATH_ROOT . DS . $envfile;
        if (is_file($pathenv)) {
            $content = file_get_contents($pathenv);
            $lines = explode("\n", $content);

            foreach ($lines as $strline) {
                if (strstr($strline, "=")) {
                    $keyval = explode("=", $strline);
                    $key = trim($keyval[0]);
                    if ($key) {
                        $value = trim($keyval[1] ?? "");
                        $value = str_replace(array_keys($arpaths), array_values($arpaths), $value);
                        $_ENV[$key] = $value;
                    }
                }//if line has =
            }//foreach lines
            return;
        }//if is file
    }//foreach envs

    $_SERVER += $_ENV;
}