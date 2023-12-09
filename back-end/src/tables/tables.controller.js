const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");

//Middleware functions

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} does not exist.`,
  });
}

async function validCapacity(req, res, next) {
  const { data = {} } = req.body;
  const reservationId = data.reservation_id;
  const reservation = await reservationService.read(reservationId);
  const { table } = res.locals;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Table capacity cannot accommodate reservation.`,
    });
  }
  next();
}

async function checkTableStatus(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table.reservation_id) {
    return next({ status: 400, message: `Table is already occupied.` });
  }
  next();
}

function capacityIsANumber(req, res, next) {
  const { data = {} } = req.body;
  if (typeof data.capacity !== "number") {
    return next({ status: 400, message: `capacity must be a number.` });
  }
  next();
}

function tableNameIsValid(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `Data is missing. Please complete all fields.`,
    });
  }
  if (!data.table_name || data.table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name must be at least two characters.`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { data = {} } = req.body;
  const reservationId = data.reservation_id;
  if (!reservationId) {
    return next({ status: 400, message: `reservation_id or data is missing.` });
  }
  const reservation = await reservationService.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
  }
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation_id ${reservationId} does not exist.`,
    });
  }
  next();
}

async function checkIfTableIsOccupied(req, res, next) {
  const { table } = res.locals;
  if (!table.reservation_id) {
    return next({ status: 400, message: `Table is not occupied.` });
  }
  next();
}

async function checkReservationStatus(req, res, next){
  const {reservation} = res.locals;
  if (reservation.status === "seated"){
    return next({status:400, message:`Reservation has already been seated.`})
  }
  next();
}

const hasRequiredProperties = hasProperties(["table_name", "capacity"]);

//GET, POST, and PUT HTTP Request handling functions

async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { table } = res.locals;
  const { reservation } = res.locals;
  const reservationId = req.body.data.reservation_id;
  const updatedTable = {
    ...table,
    reservation_id: reservationId,
  };
  const data = await service.update(updatedTable);
  await reservationService.update({...reservation, status: "seated"});

  res.status(200).json({ data });
}

async function deleteReservation(req, res, next) {
  const { table } = res.locals;
  const reservation = await reservationService.read(table.reservation_id);
  const updatedTable = {
    ...table,
    reservation_id: null,
  };
  await reservationService.update({...reservation, status: "finished"})
  const data = await service.update(updatedTable);
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    tableNameIsValid,
    asyncErrorBoundary(hasRequiredProperties),
    capacityIsANumber,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    checkReservationStatus,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validCapacity),
    checkTableStatus,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    checkIfTableIsOccupied,
    asyncErrorBoundary(deleteReservation),
  ],
};
