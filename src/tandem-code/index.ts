
import "reflect-metadata";
import * as path from "path";
import { app } from "electron";
import { isMaster } from "cluster";
import { initializeMaster } from "./master";
import { initializeWorker } from "./worker";
import { LogLevel } from "@tandem/common";

process.on("unhandledRejection", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Unhandled Rejection ${error.stack}`);
});

process.on("uncaughtException", function(error) {
  console.error(`(${isMaster ? "master" : "worker"}) Uncaught Exception ${error.stack}`);
});



if (isMaster && app) {
  app.once("ready", initializeMaster);
} else {
  initializeWorker();
}
