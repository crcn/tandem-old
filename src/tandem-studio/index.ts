import "reflect-metadata";
import { app } from "electron";
import { isMaster } from "cluster";
import { initializeMaster } from "./master";
import { initializeWorker } from "./worker";

process.on("unhandledRejection", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Unhandled Rejection ${error.stack}`);
});

process.on("uncaughtException", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Uncaught Exception ${error.stack}`);
});

if (isMaster) {
  app.once("ready", initializeMaster);
} else {
  initializeWorker();
}
