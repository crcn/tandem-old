import * as fs from "fs";
import * as fsa from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { IHelpOption } from "tandem-studio/master/stores";
import { TransformStream } from "@tandem/mesh";
import { BaseStudioMasterCommand } from "./base";
import { OpenHelpOptionRequest, OpenNewWorkspaceRequest } from "tandem-studio/common/messages";

export class OpenHelpOptionCommand extends  BaseStudioMasterCommand {
  execute({ option }: OpenHelpOptionRequest) {
    const basename = path.basename(option.filePath);
    const dir = path.dirname(option.filePath);
    const tmp = path.join(this.config.tmpDirectory, String(Date.now()));
    console.log(tmp, path.join(tmp, basename));
    fsa.copySync(dir, tmp);
    return this.bus.dispatch(new OpenNewWorkspaceRequest(path.join(tmp, basename)));
  }
}