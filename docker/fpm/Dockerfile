#docker/fpm/Dockerfile
FROM php:7.4.16-fpm

RUN echo "alias ll='ls -l'" >> /root/.bashrc

RUN apt-get update \
    && apt-get -y install --no-install-recommends \
    && apt-get install -y git acl openssl openssh-client wget curl \
    && apt-get install -y librabbitmq-dev libssh-dev libpng-dev zlib1g-dev libzip-dev libxml2-dev libicu-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip gd soap \
    && pecl install xdebug \
    && docker-php-ext-enable --ini-name 05-opcache.ini opcache xdebug \
    && apt-get -y install cron vim

RUN curl --insecure https://getcomposer.org/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

RUN mkdir -p /appdata/www

WORKDIR /appdata/www