const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");

let config = undefined;
config = require("./config.js");

const logger = require("morgan");
// helpers

app.locals.baseURL = config.baseUrl;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");

  next();
});

/**
 * Routes
 */
app.use(require("./routes/api"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
