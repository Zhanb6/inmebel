FROM php:8.3-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
      apt-utils \
      libpq-dev \
      libpng-dev \
       libjpeg-dev \
        libfreetype6-dev \
      libzip-dev \
      zip unzip \
      git && \
      docker-php-ext-install pdo_mysql && \
      docker-php-ext-install bcmath && \
      docker-php-ext-configure gd \
             --with-freetype \
             --with-jpeg && \
      docker-php-ext-install gd && \
      docker-php-ext-install zip && \
      docker-php-ext-install exif  && \
    docker-php-ext-enable exif && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN docker-php-ext-install exif \
    && docker-php-ext-enable exif

RUN docker-php-ext-install pcntl
RUN docker-php-ext-install pdo_pgsql

COPY ./_docker/app/php.ini /usr/local/etc/php/conf.d/php.ini
COPY . /var/www
#Install composer
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- \
    --filename=composer \
    --install-dir=/usr/local/bin

RUN composer install


