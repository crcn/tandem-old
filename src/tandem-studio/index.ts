import "reflect-metadata";
import { initialize } from "./server";
import * as getPort from "get-port";
const electron = require("electron");
const argv = require('yargs').argv;


const app = electron.app;
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow (port) {
  mainWindow = new BrowserWindow({width: 1024, height: 768 });
  mainWindow.loadURL(`file://${__dirname}/browser/index.html?backendPort=${port}`)
  mainWindow.webContents.openDevTools()
}

app.on('ready', async () => {
  const port = await getPort();
  await initialize(port);
  createWindow(port);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    // createWindow(
  }
})
