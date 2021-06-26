#!/bin/bash
help: ## Show this help message
	@echo "usage: make [target]"
	@echo
	@echo "targets:"
	@egrep "^(.+)\:\ ##\ (.+)" ${MAKEFILE_LIST} | column -t -c 2 -s ":#"

ip:
	ipconfig getifaddr en0

ps:
	docker ps | egrep eafpos

rebuild: ## rebuild containers
	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.yml --env-file ./docker/.env up -d --build --remove-orphans
	docker-compose --env-file ./docker/.env up -d --no-deps --build php-eafpos-db

build-cron:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build php-eafpos-cron
	make ps

build-db-:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build php-eafpos-db
	make ps

build-web:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build php-eafpos-web
	make ps

build-be:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build php-eafpos-be
	make ps

build-zookeeper:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build zookeeper
	make ps

build-kafka:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build kafka
	make ps

build-redis:
	docker-compose --env-file ./docker/.env up -d --no-deps --force-recreate --build redis
	make ps

start: ## start
	docker-compose start

restart: ## restart the containers
	docker-compose stop
	docker-compose start

restart-be:
	docker restart php-eafpos-be

restart-web:
	docker restart php-eafpos-web

restart-cron:
	docker restart php-eafpos-web

restart-db:
	docker restart php-eafpos-db

restart-zookeeper:
	docker restart prj_eafpos_zookeeper_1

restart-kafka:
	docker restart prj_eafpos_kafka_1

restart-redis:
	docker restart php-eafpos-redis

stop: ## stop containers
	docker-compose stop

logs-web: ## logs web
	docker logs php-eafpos-web

logs-be: ## logs be
	docker logs php-eafpos-be

logs-db: ## logs db
	docker logs php-eafpos-db

logs-cron: ## logs cron
	docker logs php-eafpos-cron

logs-zookeeper: ## logs prj_eafpos_zookeeper_1
	docker logs prj_eafpos_zookeeper_1

logs-kafka: ## logs kafka
	docker logs prj_eafpos_kafka_1

logs-redis: ## logs redis
	docker logs php-eafpos-redis

ssh-be: ## fpm
	docker exec -it --user root php-eafpos-be bash

ssh-web: ## web
	docker exec -it --user root php-eafpos-web bash

ssh-db: ## ssh's into mysql
	docker exec -it --user root php-eafpos-db bash

ssh-cron: ## ssh's into crontab
	docker exec -it --user root php-eafpos-cron sh

ssh-zookeeper: ## ssh's into prj_eafpos_zookeeper_1
	docker exec -it --user root prj_eafpos_zookeeper_1 bash

ssh-kafka: ## ssh's into prj_eafpos_kafka_1
	docker exec -it --user root prj_eafpos_kafka_1 bash

ssh-redis: ## ssh's into redis
	docker exec -it --user root php-eafpos-redis bash

deploy-test: ## deploy codeonly in test
	py.sh deploy.codeonly eduardoaf

deploy-prod: ## deploy codeonly in prod
	py.sh deploy.codeonly eduardoaf-prod

remlogs: ## remove logs
	rm -fr ./backend_web/logs/*

frontstart: ## npm run start
	cd frontend/restrict; npm run start

frontbuild: ## npm run build
	cd frontend/restrict; npm run build

gen-cert: ## certs
	openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout ./io/in/localip-ca.key -out ./io/in/localip-ca.pem -subj "/CN=192.168.1.132"
	openssl x509 -outform pem -in ./io/in/localip-ca.pem -out ./io/in/localip-ca.crt

make ips: ## get ips of containers
	echo "php-eafpos-web"; docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' php-eafpos-web
	echo "php-eafpos-cron"; docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' php-eafpos-cron
	echo "php-eafpos-be"; docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' php-eafpos-be
	echo "php-eafpos-db"; docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' php-eafpos-db