
import "reflect-metadata";
import * as path from "path";

const isMaster = !process.env.WORKER;

process.on("unhandledRejection", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Unhandled Rejection ${error.stack}`);
});

process.on("uncaughtException", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Uncaught Exception ${error.stack}`);
});


// very important here to have require statements inside these conditional blocks since the electron node_modules
// package does not exist in production
if (isMaster) {
  const { initializeMaster } = require("./master");
  const { app } = require("electron");
  app.once("ready", initializeMaster);
} else {
  const { initializeWorker } = require("./worker");
  initializeWorker();
}
