#!/bin/bash
help: ## Show this help message
	@echo "usage: make [target]"
	@echo
	@echo "targets:"
	@egrep "^(.+)\:\ ##\ (.+)" ${MAKEFILE_LIST} | column -t -c 2 -s ":#"

rebuild: ## rebuild containers
	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.yml --env-file ./docker/.env up -d --build --remove-orphans
	docker-compose --env-file ./docker/.env up -d --no-deps --build php-eafpos-db

start: ## start
	docker-compose start

restart: ## restart the containers
	docker-compose stop
	docker-compose start

stop: ## stop containers
	docker-compose stop

logs-web: ## Logs web
	docker logs php-eafpos-web

logs-be: ## Logs be
	docker logs php-eafpos-be

logs-db: ## Logs db
	docker logs php-eafpos-db

logs-cron: ## Logs cron
	docker logs php-eafpos-cron

ssh-be: ## fpm
	docker exec -it --user root php-eafpos-be bash

ssh-web: ## web
	docker exec -it --user root php-eafpos-web bash

ssh-db: ## ssh's into mysql
	docker exec -it --user root php-eafpos-db bash

ssh-cron: ## ssh's into crontab
	docker exec -it --user root php-eafpos-cron sh

deploy-test: ## deploy codeonly in test
	py.sh deploy.codeonly eduardoaf

deploy-prod: ## deploy codeonly in prod
	py.sh deploy.codeonly eduardoaf-prod

remlogs: ## remove logs
	rm -fr ./backend_web/logs/*


compile: ## npm run dev
	npm run dev

