FROM nginx:1.21.4-alpine

ARG BUILD_NGINX_DOMAIN
ARG PROJECT_NAME
ARG PORT
COPY default.conf /etc/nginx/conf.d/default.conf
RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo \
    &&pip3 install pip --upgrade \
    &&pip3 install certbot-nginx \
    &&mkdir /etc/letsencrypt \
    &&sed -i -e "s|server_name .*;|server_name $BUILD_NGINX_DOMAIN;|" /etc/nginx/conf.d/default.conf \
    &&sed -i -e "s|proxy_pass .*;|proxy_pass http://$PROJECT_NAME-backend:$PORT;|" /etc/nginx/conf.d/default.conf
