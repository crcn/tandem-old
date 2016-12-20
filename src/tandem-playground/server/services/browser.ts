import { HTTPServerProvider } from "tandem-playground/server/providers";
import { IPlaygroundServerConfig } from "tandem-playground/server/config";
import { IOService } from "@tandem/editor/common";
import socketio = require("socket.io");
import { inject, injectProvider, CoreApplicationService, InitializeApplicationRequest } from "@tandem/common";
import express = require("express");

export class BrowserService extends CoreApplicationService<IPlaygroundServerConfig> {

  @injectProvider(HTTPServerProvider.ID)
  private _serverProvider: HTTPServerProvider;

  [InitializeApplicationRequest.INITIALIZE]() {
    const server = this._serverProvider.value;
    server.use(express.static(this.config.browserDirectory));
    this._startSocketIO();
  } 

  private _startSocketIO() {
    const io = socketio();
    io["set"]("origins", "*:*");
    const service = this.kernel.inject(new IOService());
    this.bus.register(service);
    io.on("connection", (connection) => {
      service.addConnection(connection);
    });
    
    io.listen(this._serverProvider.target);
  }
}