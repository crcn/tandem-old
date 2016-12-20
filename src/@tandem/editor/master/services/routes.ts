import express = require("express");
import { ExpressServerProvider, HTTPRouteProvider } from "../providers";
import { BaseEditorMasterService } from "./base";
import { inject, LoadApplicationRequest } from "@tandem/common";

export class HTTPRouteService extends BaseEditorMasterService {
  @inject(ExpressServerProvider.ID)
  private _server: express.Express;

  [LoadApplicationRequest.LOAD]() {
    for (const provider of HTTPRouteProvider.findAll(this.kernel)) {
      const handler = provider.create();
      const handle = handler.handle.bind(handler);
      if (provider.method === "get") {
        this._server.get(provider.path, handle);
      } else if (provider.method === "put") {
        this._server.put(provider.path, handle);
      } else if (provider.method === "delete") {
        this._server.delete(provider.path, handle);
      } else if (provider.method === "post") {
        this._server.post(provider.path, handle);
      }
    }
  }
}
