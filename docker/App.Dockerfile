FROM node:18 AS development

WORKDIR /app

RUN npm i -g @nestjs/cli@9.0.0