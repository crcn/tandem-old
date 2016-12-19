import express = require("express");
import { Server } from "http";
import { IProvider, Kernel } from "@tandem/common";

export class HTTPServerProvider implements IProvider {
  static readonly ID = "httpServer";
  readonly id = HTTPServerProvider.ID;
  readonly overridable = false;
  public owner: Kernel;

  constructor(readonly value: express.Express, readonly target: Server) { }

  clone() {
    return new HTTPServerProvider(this.value, this.target);
  }
}