/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://kenyponl:fEeCfZhbNrvQGEiX3IqcYNClRj_KPXq_@bubble.db.elephantsql.com/kenyponl",
  DATABASE_URL_DEVELOPMENT = "postgres://knnlslui:G4WfSunZwghGB_HBiRokChe9R4mRX58E@bubble.db.elephantsql.com/knnlslui",
  DATABASE_URL_TEST = "postgres://hqllldca:MLDh3-kPTcwse_L_8zCeIo3foDAeqnal@bubble.db.elephantsql.com/hqllldca",
  DATABASE_URL_PREVIEW = "postgres://kgiktsat:uU1sQRYxab3U7R374l51IrVABQchcVfr@bubble.db.elephantsql.com/kgiktsat",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
