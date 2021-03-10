FROM node:14.16.0-alpine3.12

RUN apk update && \
  apk add \
  openssl \
  tar \
  build-base \
  tzdata \
  postgresql-dev \
  postgresql-client \
  python3 \
  git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .