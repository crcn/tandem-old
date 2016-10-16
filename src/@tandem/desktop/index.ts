import ServerApplication from "@tandem/back-end/application";
import { OpenProjectAction } from "@tandem/common";
import * as getPort from "get-port";
const electron = require("electron");

let backend: ServerApplication

async function getBackend() {
  if (backend) return backend;
  backend = new ServerApplication({
    port: await getPort()
  });

  backend.initialize();

  // temporray
  backend.bus.execute(new  OpenProjectAction(__dirname + "/../../../tdproject/index.tdm"));

  return backend;
};


const app = electron.app;
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({width: 800, height: 600})
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
