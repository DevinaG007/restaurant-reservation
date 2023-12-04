/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

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

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  const date = req.query;
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsValid,
    dateIsValid,
    timeIsValid,
    asyncErrorBoundary(create),
  ],
};
