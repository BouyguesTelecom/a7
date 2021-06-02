## STEP 1: Build nginx from sources.

## Ideally, we would just have started with `FROM nginx:stable-alpine`
## But when reality checks in, we have "special needs" such as zipping asset directories on-the-fly.
## Because we're special, ain't we? ʕ♥ᴥ♥ʔ
FROM node:14-alpine AS nginx-builder

ARG NGINX_VERSION="1.20.1"
ARG NGINX_SOURCE="http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz"

ARG MOD_ZIP_VERSION="1.2.0"
ARG MOD_ZIP_SOURCE="https://github.com/evanmiller/mod_zip/archive/${MOD_ZIP_VERSION}.tar.gz"

# For latest build deps, see https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
RUN apk add --no-cache --virtual .build-deps \
  gcc \
  libc-dev \
  make \
  openssl-dev \
  pcre-dev \
  zlib-dev \
  linux-headers \
  curl \
  gnupg \
  libxslt-dev \
  gd-dev \
  geoip-dev

# Fetch sources
RUN curl -Lo nginx.tar.gz $NGINX_SOURCE
RUN curl -Lo mod_zip.tar.gz $MOD_ZIP_SOURCE

# Reuse same cli arguments as the nginx:alpine image used to build
RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
  mkdir -p /usr/src && \
	tar -zxC /usr/src -f nginx.tar.gz && \
  tar -xzvf "mod_zip.tar.gz" && \
  MOD_ZIP_DIR="$(pwd)/mod_zip-${MOD_ZIP_VERSION}" && \
  cd /usr/src/nginx-$NGINX_VERSION && \
  ./configure --with-compat $CONFARGS --add-dynamic-module=$MOD_ZIP_DIR && \
  make && make install


## STEP 2: Build the edge project.
FROM node:14-alpine AS edge-builder

WORKDIR /build/edge

# Install app dependencies
COPY edge/package*.json ./
RUN npm install --no-fund --no-audit

# Copy edge sources and build it
COPY edge /build/edge
RUN npm run build

## STEP 3: Create the final image.
FROM nginx:1.20-alpine

# Port used for the service
ENV PORT 45537

# Volume mount path used to access the assets root directory
ENV A7_VOLUME_MOUNT_PATH      /assets
ENV A7_AUTOINDEX              true
ENV A7_ZIP_DIRECTORIES        true
ENV A7_META_QUERIES           true
ENV A7_CORS_ALL               true
ENV A7_PATH_AUTO_EXPAND       true
ENV A7_PATH_AUTO_EXPAND_INIT  true
ENV A7_RUN_SCRIPTS_ONLY       false
ENV A7_GET_REQUESTS_ONLY      true
ENV A7_INTERNAL_API           true
ENV A7_TITLE                  A7
ENV A7_ICON                   📦

EXPOSE $PORT

# support running as arbitrary user which belongs to the root group
RUN chmod 777 /var/run /var/cache/nginx /var/log/nginx
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Add custom configuration and assets to the container
RUN rm /etc/nginx/conf.d/default.conf
COPY /etc/nginx /etc/nginx
COPY --from=nginx-builder /usr/local/nginx/modules/ngx_http_zip_module.so /etc/nginx/modules/
COPY --from=edge-builder /build/etc/nginx/edge/a7.js /etc/nginx/edge/a7.js
COPY html /usr/share/nginx/html

# TODO: 🤡
RUN chmod 777 -R /etc/nginx/conf.d/ /usr/share/nginx/html/

COPY scripts/template-substitution.sh /docker-entrypoint.d/30-template-substitution.sh
COPY scripts/generate-directories-metadata.sh /docker-entrypoint.d/31-generate-directories-metadata.sh
COPY scripts/test-service.sh /docker-entrypoint.d/40-test-service.sh
COPY scripts/stop-service.sh /docker-entrypoint.d/99-stop-service.sh

# Test the nginx configuration at build time
RUN /docker-entrypoint.d/40-test-service.sh
