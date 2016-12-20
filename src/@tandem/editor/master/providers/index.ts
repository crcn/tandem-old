import http = require("http");
import express = require("express");
import {
  Kernel, 
  ICommand,
  IProvider, 
  ClassFactoryProvider,
} from "@tandem/common";

import { IHTTPRouteHandler } from "../routes/base";

export class ExpressServerProvider implements IProvider {
  static readonly ID = "expressServer";
  public owner: Kernel;
  readonly overridable = true;
  readonly id = ExpressServerProvider.ID;
  constructor(readonly value: express.Express, readonly target: http.Server) {

  }
  clone() {
    return new ExpressServerProvider(this.value, this.target);
  }
}

export class HTTPRouteProvider extends ClassFactoryProvider {
  static readonly NS = "httpRoutes";
  public owner: Kernel;
  readonly overridable = true;
  constructor(readonly method: "get"|"delete"|"post"|"put", readonly path: string, readonly clazz: { new(): IHTTPRouteHandler }) {
    super(HTTPRouteProvider.getId(method, path), clazz);
  }
  static getId(method: string, path: string) {
    return [this.NS, method + encodeURIComponent(path)].join("/");
  }
  clone() {
    return new HTTPRouteProvider(this.method, this.path, this.clazz);
  }

  static findAll(kernel: Kernel): HTTPRouteProvider[] {
    return kernel.queryAll<HTTPRouteProvider>([this.NS, "**"].join("/"));
  }
}