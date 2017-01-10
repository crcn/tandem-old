import { spawn } from "child_process";
import { GetTunnelUrlRequest } from "@tandem/editor/common";
import { BaseStudioMasterCommand } from "./base";
import ngrok = require("ngrok");

export class GetTunnelUrlCommand extends BaseStudioMasterCommand {
  execute() {
    return this.masterStore.tunnelUrl || new Promise((resolve, reject) => {
      ngrok.connect({ proto: "http", addr: this.config.server.port }, (err, url) => {
        if (err) return reject(err);
        return resolve(this.masterStore.tunnelUrl = url.replace("https", "http"));
      });
    })
  }
}