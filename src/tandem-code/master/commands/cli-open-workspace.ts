import path =  require("path");
import glob =  require("glob");
import { inject } from "@tandem/common";
import { URIProtocolProvider } from "@tandem/sandbox";
import {  BaseStudioMasterCommand } from "./base";
import { OpenNewWorkspaceRequest } from "tandem-code/common";


export class CLIOpenWorkspaceCommand extends  BaseStudioMasterCommand {

  
  async execute() {
    let uri = this.config.argv._[0];
    const protocol = URIProtocolProvider.lookup(uri, this.injector);

    // scan the CWD for any tandem files
    if (uri != null && !(await protocol.exists(uri))) {

      uri = uri.replace(/^\./, process.cwd()).replace(/^~/, process.env.HOME);

      if (!(await protocol.exists(uri))) {
        uri = glob.sync(path.join(uri, `{${this.config.projectFileExtensions.map(ext => `*.${ext}`).join(",")}}`)).find((uri) => {
          return true;
        });
      }
    }

    // open new workspace anyways -- the user will be prompted to open a file from there
    if (!uri) {
      return this.bus.dispatch(new  OpenNewWorkspaceRequest(undefined));
    }
      
    if (uri.substr(0, 1) !== "/" && !/\w+:\/\//.test(uri)) {
      uri = path.join(process.cwd(), uri);
    }

    if (!(await protocol.exists(uri))) {
      this.logger.error(`Cannot open ${uri}: File does not exist.`);
      return;
    }

    return this.bus.dispatch(new OpenNewWorkspaceRequest(uri));
  }
} 

