const knex = require("../db/connection");

async function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ "reservation_date": date })
    .orderBy("reservation_time");
}

module.exports = {
  list,
  create,
};
