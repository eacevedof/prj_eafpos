export PATHBASH="/appdata/bash"
export PATH=$PATH:$PATHBASH

export PATHWEB="/appdata/www/backend_web"

alias be-console="cd $PATHWEB/console"
alias log-consumer="run --class=App.Services.Kafka.LogConsumerService"

run() {
    php $PATHWEB/console/run.php "$@"
}