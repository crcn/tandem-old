import ServerApplication from "@tandem/back-end/application";
import { OpenProjectAction } from "@tandem/common";
import * as getPort from "get-port";
const electron = require("electron");
const argv = require('yargs').argv;

let backend: ServerApplication

async function getBackend() {
  if (backend) return backend;
  backend = new ServerApplication({
    argv: argv,
    port: await getPort()
  });

  backend.initialize();

  return backend;
};


const app = electron.app;
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1024, height: 768 });
  mainWindow.loadURL(`file://${__dirname}/index.html?backendPort=${backend.config.port}`)
  mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  getBackend().then(createWindow);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
