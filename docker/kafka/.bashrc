export PATHKAFKACONFIG="/opt/kafka/config"

kafka-console-consumer.sh --topic ${KAFKA_CREATE_TOPICS} --from-beginning --bootstrap-server kafka_kafka_1:9092

alias show-version="find /opt/ -name \*kafka_\* | head -1 | grep -o '\kafka[^\n]*'"
alias consumer-test="kafka-console-consumer.sh --topic queue-logs --from-beginning --bootstrap-server kafka_kafka_1:9092"
alias producer-test="kafka-console-producer.sh --topic queue-logs --broker-list kafka_kafka_1:9092"
alias show-config="more $PATHKAFKACONFIG/server.properties"
alias topics="kafka-topics.sh --zookeeper kafka_zookeeper_1:2181 --list"
alias enable-delete="$PATHBASH/enable-delete.sh"