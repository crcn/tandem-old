import fs =  require("fs");
import fsa = require("fs-extra");
import glob =  require("glob");
import path =  require("path");
import { IHelpOption } from "tandem-code/master/stores";
import { TransformStream } from "@tandem/mesh";
import { BaseStudioMasterCommand } from "./base";
import { OpenHelpOptionRequest, OpenNewWorkspaceRequest } from "tandem-code/common/messages";

export class OpenHelpOptionCommand extends  BaseStudioMasterCommand {
  execute({ option }: OpenHelpOptionRequest) {
    const filePath = option.uri.replace("file://", "");
    const basename = path.basename(filePath);
    const dir = path.dirname(filePath);
    const tmp = path.join(this.config.tmpDirectory, String(Date.now()));
    fsa.copySync(dir, tmp);
    return this.bus.dispatch(new OpenNewWorkspaceRequest(path.join(tmp, basename)));
  }
}