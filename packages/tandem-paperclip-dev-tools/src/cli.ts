import * as path from "path";
import { fork } from "cluster";
import { InitOptions, ProjectConfig } from "./back-end/state";
import { start } from "./index";
import { CONFIG_NAME, CONFIG_NAMESPACE } from "./back-end/constants"

const cwd = process.cwd();
const port = Number(process.env.PORT || 8082);
let projectConfig: ProjectConfig;

try {
  projectConfig = require(path.join(cwd, CONFIG_NAME))[CONFIG_NAMESPACE] || {
    componentsDirectory: path.join(cwd, "paperclip")
  };  
} catch(e) {
  console.log(e);
  throw new Error(`tandem.config not found`);
}

start({ projectConfig, cwd, port });