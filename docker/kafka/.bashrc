export PATHKAFKACONFIG="/opt/kafka/config"

#kafka-console-consumer.sh --topic ${KAFKA_CREATE_TOPICS} --from-beginning --bootstrap-server prj_eafpos_kafka_1:9092

alias show-version="find /opt/ -name \*kafka_\* | head -1 | grep -o '\kafka[^\n]*'"
alias consumer-test="kafka-console-consumer.sh --topic ${KAFKA_TOPIC_1} --from-beginning --bootstrap-server prj_eafpos_kafka_1:9092"
alias producer-test="kafka-console-producer.sh --topic ${KAFKA_TOPIC_1} --broker-list prj_eafpos_kafka_1:9092"
alias show-config="more $PATHKAFKACONFIG/server.properties"
alias topics="kafka-topics.sh --zookeeper prj_eafpos_zookeeper_1:2181 --list"
alias enable-delete="$PATHBASH/enable-delete.sh"

alias show-profile="cat /root/.bashrc"
alias edit-profile="vi /root/.bashrc"
alias env-kafka="env | grep KAFKA_"
