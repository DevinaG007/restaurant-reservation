const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");
const reservationsService = require("../reservations/reservations.service");

//Middleware functions

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table does not exist.` });
}

async function validCapacity(req, res, next) {
    const {data = {}} = req.body;
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

function capacityIsANumber(req, res, next){
    const {data = {}} = req.body;
    if(typeof data.capacity !== "number"){
        return next({status:400, message:`capacity must be a number.`})
    }
    next();
}

 function tableNameIsValid(req, res, next){
    const {data = {}} = req.body;
    if (!data){
        return next({status:400, message:`Data is missing. Please complete all fields.`})
    }
    if (!data.table_name || data.table_name.length < 2){
        return next({status:400, message: `table_name must be at least two characters.`})
    }
    next();
}

async function reservationExists(req, res, next){
    const {data = {}} = req.body;
    const reservationId = data.reservation_id;
    if (!data || !reservationId){
        return next({status:400, message:`reservation_id or data is missing.`})
    }
    const reservation = await reservationService.read(reservationId);
    if(!reservation){
        return next({status:404, message:`Reservation_id ${reservationId} does not exist.`})
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
  const reservationId = req.body.data.reservation_id;
  const updatedTable = {
    ...table, 
    reservation_id: reservationId
  };
    const data = await service.update(updatedTable);
    console.log(data)
 
    res.json({ data });
}

async function deleteReservation(req, res, next){
  const {table} = res.locals;
  const deleted = await reservationsService.delete(table.reservation_id);
  const updatedTable = {
    ...table, 
    reservation_id: null
  }

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
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(validCapacity),
    checkTableStatus,
    asyncErrorBoundary(update),
  ],
};
