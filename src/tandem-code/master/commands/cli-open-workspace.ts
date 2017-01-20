import path =  require("path");
import glob =  require("glob");
import fs = require("fs");
import { TransformStream } from "@tandem/mesh";
import { URIProtocolProvider } from "@tandem/sandbox";
import { inject, hasURIProtocol } from "@tandem/common";
import { CreateNewProjectRequest } from "@tandem/editor/common";
import {  BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest, OpenBrowserWindowRequest } from "tandem-code/common";

// TODO - change this name to something more generic such as CLIOpen command
export class CLIOpenWorkspaceCommand extends  BaseStudioMasterCommand {

  async execute() {
    let uri = this.config.argv._[0];

    const protocol = uri && URIProtocolProvider.lookup(uri, this.kernel);

    // scan the CWD for any tandem files
    if (uri != null && !(await protocol.fileExists(uri))) {

      if (uri.charAt(0) === "~") {
        uri = uri.sustr(1) + (process.env.HOME || process.env.USERPROFILE);
      } else if (uri.charAt(0) !== "/") {
        uri = path.join(this.config.cwd, uri);
      }

      if (!(await protocol.fileExists(uri))) {
        uri = glob.sync(path.join(uri, `{${this.config.projectFileExtensions.map(ext => `*.${ext}`).join(",")}}`)).find((uri) => {
          return true;
        });
      }
    }

    // open new workspace anyways -- the user will be prompted to open a file from there
    if (uri) {
      if (uri.substr(0, 1) !== "/" && !/\w+:\/\//.test(uri)) {
        uri = path.join(this.config.cwd, uri);
      }

      if (!(await protocol.fileExists(uri))) {
        this.logger.error(`Cannot open ${uri}: File does not exist.`);
        return;
      }

      if (!hasURIProtocol(uri)) {
        uri = "file://" + uri;
      }
    }

    if (!uri) {
      if (!(await this.masterStore.userSettings.exists())) {
        return this.bus.dispatch(new OpenBrowserWindowRequest("#/get-started"));
      }
    }

    return this.bus.dispatch(new OpenNewWorkspaceRequest(await CreateNewProjectRequest.dispatch(null, uri, this.bus)));
  }
} 

