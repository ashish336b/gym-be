#!/usr/bin/env node

/**
 * Module dependencies !
 */
var app = require("../app");

let config = undefined;

config = require("../config.js");

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("mongo db sucessfully connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("mongo db not connected");
  });

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || config.port);

/**
 * Listen on provided port, on all network interfaces.
 */
server = app.listen(port, () => {
  console.log(
    `App is running sucessfully in address: ${
      server.address().address
    }  port: ${port}`
  );
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
