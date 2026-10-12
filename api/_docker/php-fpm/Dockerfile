FROM php:7.2-fpm

######
# You can install php extensions using docker-php-ext-install
######

#RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
RUN apt-get update \
    && apt-get install -y \
        libfreetype6-dev \
        libmagickwand-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        jpegoptim \
        optipng \
        gifsicle \
        libmemcached-dev \
        zlib1g-dev \
        cron \
        gnumeric \
        ffmpeg \
    && pecl install xdebug-2.6.0 \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-install mbstring \
    && docker-php-ext-install gettext \
    && docker-php-ext-install bcmath \
    && docker-php-ext-install pdo_mysql \
    && apt-get install -y zlib1g-dev libicu-dev g++ \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-enable xdebug \
    && pecl install memcached \
    && docker-php-ext-enable memcached

COPY crontab /etc/cron.d/cool-task
RUN chmod 0644 /etc/cron.d/cool-task
RUN service cron start
RUN docker-php-ext-install exif \
    && docker-php-ext-enable exif
RUN apt-get update && apt-get install -y libc-client-dev libkrb5-dev && rm -r /var/lib/apt/lists/*
RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl && docker-php-ext-install imap

RUN apt-get update -y && \
    apt-get install -y wget && \
    wget https://squizlabs.github.io/PHP_CodeSniffer/phpcs.phar && \
    chmod +x phpcs.phar && \
    mv phpcs.phar /usr/local/bin/phpcs && \
    wget https://squizlabs.github.io/PHP_CodeSniffer/phpcbf.phar && \
    chmod +x phpcbf.phar && \
    mv phpcbf.phar /usr/local/bin/phpcbf && \
    phpcs --config-set default_standard PSR2 && \
    apt-get remove -y wget

#ENTRYPOINT ["phpcs app/Http/Middleware/Authenticate.php -a"]
