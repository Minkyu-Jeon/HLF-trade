'use strict'

module.exports = {
  use_env_variable: false,
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DBNAME,
  dialect: 'postgres'
}