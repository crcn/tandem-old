import fs =  require("fs");
import fsa = require("fs-extra");
import glob =  require("glob");
import path =  require("path");
import { IHelpOption } from "tandem-code/master/stores";
import { TransformStream } from "@tandem/mesh";
import { CreateNewProjectRequest } from "@tandem/editor/common";
import { BaseStudioMasterCommand } from "./base";
import { OpenHelpOptionRequest, OpenNewWorkspaceRequest } from "tandem-code/common/messages";

export class OpenHelpOptionCommand extends  BaseStudioMasterCommand {
  async execute({ option }: OpenHelpOptionRequest) {
    const filePath = option.uri.replace("file://", "");
    const basename = path.basename(filePath);
    const dir = path.dirname(filePath);
    const tmp = path.join(this.config.tmpDirectory, String(Date.now()));
    fsa.copySync(dir, tmp);

    // TODO - fetch project if possible
    return this.bus.dispatch(new OpenNewWorkspaceRequest(await CreateNewProjectRequest.dispatch(null, path.join(tmp, basename), this.bus)));
  }
}