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

function read(reservationId){
  return knex("reservations")
  .select("*")
  .where({"reservation_id": reservationId})
  .first()
}

function destroy(tableReservationId){
  return knex("reservations")
  .where({"reservation_id": tableReservationId})
  .del();  
}

module.exports = {
  list,
  create,
  read,
  delete: destroy
};
