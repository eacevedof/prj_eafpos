#!/bin/bash
help: ## Show this help message
	@echo "usage:\n\tmake [target]"
	@echo "targets:"
	@egrep "^(.+)\:\ ##\ (.+)" ${MAKEFILE_LIST} | column -t -c 2 -s ":#"

remlogs: ## elimina los logs
	rm -fr logs/*

test: ## run test
	vendor/bin/phpunit --bootstrap ./vendor/theframework/bootstrap.php ./tests/Services/Apify/Security/LoginServiceTest.php --color=auto

