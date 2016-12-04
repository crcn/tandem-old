import { IHelpOption } from "tandem-studio/master/stores";
import { BaseStudioMasterCommand } from "./base";
import { SyntheticWindow, SyntheticDOMElement } from "@tandem/synthetic-browser";

import * as glob from "glob";
import * as fs from "fs";

export class GetHelpOptionsCommand extends  BaseStudioMasterCommand {
  execute() {
    return  glob.sync(this.config.help.directory + "/**/*.tandem").map((filePath) => {
      const { document } = new SyntheticWindow();
      document.body.innerHTML = fs.readFileSync(filePath, "utf8");
      const root =  document.body.firstChild as SyntheticDOMElement;
      root.$source = { filePath };
      return {
        id: root.uid,
        page: root.getAttribute("page"),
        label: root.getAttribute("label"),
        filePath: filePath
      }
    });
  }
} 