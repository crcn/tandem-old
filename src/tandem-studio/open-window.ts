
const electron = require("electron");
const argv = require('yargs').argv;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow (url) {
  mainWindow = new BrowserWindow({width: 1024, height: 768 });
  mainWindow.loadURL(url);
}


createWindow(process.argv[1]);