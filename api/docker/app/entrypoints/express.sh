#!/bin/sh

set -x

echo "Waiting for postgres to become ready...."

PG_READY="pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USERNAME"

until $PG_READY
do
  sleep 2;
done

echo "Database ready to accept connections."

npm install

exec "$@"