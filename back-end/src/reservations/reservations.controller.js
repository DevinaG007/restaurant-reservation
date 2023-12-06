/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const today = new Date().toJSON().slice(0, 10);
const currentDate = new Date();
const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();

//Middleware input validation functions

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

const timeIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  const time = data.reservation_time;
  const regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  if (regexp.test(time)) {
    next();
  } else {
    next({
      status: 400,
      message: `Invalid. reservation_time must be in correct format.`,
    });
  }
};

const peopleIsValid = (req, res, next) => {
  const {data = {} } = req.body;
  if (hasProperties("people")) {
    if (typeof data.people !== "number") {
      next({ status: 400, message: `Must have a number of people greater than 0.` });
    }
    next();
  }
};

const futureWorkingTimeIsValid = (req, res, next) => {
  const {data = {}} = req.body;
  // let reservationHour = data.reservation_time.splice(":")
  const reservationTime = data.reservation_time;
  const reservationDate = data.reservation_date;
  if (reservationTime < "10:30"){
    next({status:400, message:`Restaurant is closed before 10:30AM. Please select a later time.`})
  } else if (reservationTime > "21:30"){
    next({status:400, message: `Restaurant closes at 10:30PM. Please select a time before 9:30PM to accommodate reservation.`})
  } else if (reservationTime < currentTime && reservationDate === today){
    next({status:400, message: `Please select a reservation time that is in the future.`})
  }
  next();
}

const futureWorkingDateIsValid = (req, res, next) => {
  //implement solution to display multiple error messages. Concatenate error messages before using next
  const {data = {}} = req.body;
  let reservationDate = new Date(data.reservation_date);
  if (data.reservation_date < today){
    next({status: 400, message: `Reservation date must be set in the future.`})
  } else if(reservationDate.getDay() === 1){
    next({status: 400, message: `Restaurant closed. Reservation date cannot be a Tuesday.`})
  } 
  next();
}

const dateIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  const date = new Date(data.reservation_date);

  if (Object.prototype.toString.call(date) === "[object Date]") {
    if (isNaN(date.getTime())) {
      next({
        status: 400,
        message: `Invalid. reservation_date must be in date format.`,
      });
    } else {
      return next();
    }
  }
};

async function reservationExists (req, res, next){
const reservation = await service.read(req.params.reservationId);
if (reservation){
  res.locals.reservation = reservation;
  return next();
} 
next({status:404, message:`Reservation cannot be found.`})
}

//Functions that handle HTTP Request Methods and send requests to database

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);
  res.json({ data });
}

async function read( res ){
const {reservation: data} = res.locals;
res.json({data})
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsValid,
    dateIsValid,
    timeIsValid,
    futureWorkingDateIsValid,
    futureWorkingTimeIsValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)]
};
