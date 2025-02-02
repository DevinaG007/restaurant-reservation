//File that defines request handling functions and middleware validation functions

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const today = new Date().toJSON().slice(0, 10);
const currentDate = new Date();
// const currentTime = currentDate.slice(12);
const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();

//Middleware POST/PUT validation functions

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

//validate that form field inputs are valid

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

const peopleIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  if (hasProperties("people")) {
    if (typeof data.people !== "number") {
      next({
        status: 400,
        message: `Must have a number of people greater than 0.`,
      });
    }
    next();
  }
};

function statusIsValid(req, res, next) {
  const { data = {} } = req.body;
  if (data.status === "finished" || data.status === "seated") {
    return next({ status: 400, message: `Invalid status ${data.status}.` });
  }
  next();
}

function updatedStatusIsValid(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: `Reservation status cannot be finished.`,
    });
  } else if (
    reservation.status === "seated" &&
    req.body.data.status === "seated"
  ) {
    return next({
      status: 400,
      message: `Reservation status is already ${reservation.status}`,
    });
  } else if (
    !["booked", "seated", "finished", "cancelled"].includes(
      req.body.data.status
    )
  ) {
    return next({
      status: 400,
      message: `Invalid status ${req.body.data.status}`,
    });
  }
  next();
}

//Validate that inputs do not violate restaurants business rules

const futureWorkingTimeIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  const reservationTime = data.reservation_time;
  const reservationDate = data.reservation_date;
  if (reservationTime < "10:30") {
    next({
      status: 400,
      message: `Restaurant is closed before 10:30AM. Please select a later time.`,
    });
  } else if (reservationTime > "21:30") {
    next({
      status: 400,
      message: `Restaurant closes at 10:30PM. Please select a time before 9:30PM to accommodate reservation.`,
    });
  } else if (reservationDate === today) {
    if (reservationTime < currentTime) {
      next({
        status: 400,
        message: `Please select a reservation time that is in the future.`,
      });
    }
  }
  next();
};

const futureWorkingDateIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  let reservationDate = new Date(data.reservation_date);
  if (data.reservation_date < today) {
    next({
      status: 400,
      message: `Reservation date must be set in the future.`,
    });
  } else if (reservationDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: `Restaurant closed. Reservation date cannot be a Tuesday.`,
    });
  }
  next();
};

const mobileNumberIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  const mobile = data.mobile_number;
  const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
  if (regex.test(mobile)){
    return next();
  } else {
    return next({status:400, message: `Incorrect mobile number format. Only numbers are allowed.`})
  }
};

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

//Functions that handle HTTP Request Methods and send requests to database

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const date = req.query.date;
  const mobileNumber = req.query.mobile_number;
  if (date) {
    const data = await service.list(date);
    res.json({ data });
  }
  if (mobileNumber) {
    const data = await service.search(mobileNumber);
    res.json({ data });
  }
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.status(200).json({ data });
}

async function update(req, res, next) {
  const { reservation } = res.locals;
  const updatedReservation = {
    ...reservation,
    ...req.body.data,
  };
  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}

async function edit(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
  };
  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}

/*Async and await functions are wrapped in an async Error Boundary
in exports */

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsValid,
    dateIsValid,
    timeIsValid,
    mobileNumberIsValid,
    futureWorkingDateIsValid,
    futureWorkingTimeIsValid,
    statusIsValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    updatedStatusIsValid,
    asyncErrorBoundary(update),
  ],
  edit: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsValid,
    dateIsValid,
    timeIsValid,
    mobileNumberIsValid,
    futureWorkingDateIsValid,
    futureWorkingTimeIsValid,
    statusIsValid,
    asyncErrorBoundary(edit),
  ],
};
