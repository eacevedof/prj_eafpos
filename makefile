#!/bin/bash
help: ## Show this help message
	@echo "usage: make [target]"
	@echo
	@echo "targets:"
	@egrep "^(.+)\:\ ##\ (.+)" ${MAKEFILE_LIST} | column -t -c 2 -s ":#"

restart: ## Restart the containers
	docker-compose stop
	docker-compose start

stop: ## stop containers
	docker-compose stop

logs-web: ## Logs web
	docker logs php-eafpos-web

logs-be: ## Logs be
	docker logs php-eafpos-be

ssh-be: ## fpm
	docker exec -it --user root php-eafpos-be bash

ssh-web: ## web
	docker exec -it --user root php-eafpos-web bash

ssh-db: ## ssh's into mysql
	docker exec -it --user root cont-mariadb-univ bash

cp-db: ## copy into database container
	docker cp ./db/prod.sql cont-mariadb-univ:/tmp

deploy-test: ## deploy codeonly in test
	py.sh deploy.codeonly eduardoaf

deploy-prod: ## deploy codeonly in prod
	py.sh deploy.codeonly eduardoaf-prod

remlogs: ## remove logs
	rm -fr ./backend_web/logs/*



compile: ## npm run dev
	npm run dev

rebuild: ## rebuild containers
	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.yml up -d --build --remove-orphans
