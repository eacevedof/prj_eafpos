#docker/fpm/Dockerfile
FROM php:7.4.16-fpm

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    && apt-get install -y git acl openssl openssh-client wget curl \
    && apt-get install -y librabbitmq-dev libssh-dev libpng-dev zlib1g-dev libzip-dev libxml2-dev libicu-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip gd soap \
    && pecl install xdebug \
    && docker-php-ext-enable --ini-name 05-opcache.ini opcache xdebug \
    # kafka
    && apt-get install -y librdkafka-dev \
    && pecl install rdkafka \
    && docker-php-ext-enable --ini-name kafka.ini rdkafka \
    #redis
    # en las pregunta todo debe ser no (no vale con n)
    && pecl install redis \
    && docker-php-ext-enable --ini-name redis.ini redis \
    # vim
    && apt-get -y install cron vim

RUN curl --insecure https://getcomposer.org/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

RUN mkdir -p /appdata/www
RUN mkdir -p /appdata/init
RUN mkdir -p /appdata/bash

COPY ./.bashrc /root/.bashrc
COPY ./bash_init/log-consumer.sh /appdata/init/log-consumer.sh
COPY ./bash_init/init.sh /appdata/init/init.sh

RUN chmod -R +x /appdata/init
RUN chmod -R +x /appdata/bash

WORKDIR /appdata/www

CMD /appdata/init/init.sh