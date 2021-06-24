export PATHBASH="/appdata/bash"
export PATH=$PATH:$PATHBASH

export PATHWEB="/appdata/www/backend_web"

alias ioin="cd /appdata/io/in"
alias ioout="cd /appdata/io/out"
alias appdata="cd /appdata"
alias home="cd $HOME"
alias ll="ls -la"

alias be-console="cd $PATHWEB/console"
#alias log-consumer="run --class=App.Services.Kafka.LogConsumerService"

run() {
    php $PATHWEB/console/run.php "$@"
}