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
    .whereNot({"status": "finished"})
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

async function update(updatedReservation){
  return knex("reservations")
  .where({"reservation_id": updatedReservation.reservation_id})
  .update(updatedReservation, "*")
  .then((updatedRecords) => updatedRecords[0])
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  delete: destroy,
  update,
  search
};
