import * as path from "path";
import { fork } from "cluster";
import { InitOptions, ProjectConfig } from "./back-end/state";
import { start } from "./index";
import { CONFIG_NAME, CONFIG_NAMESPACE } from "./back-end/constants"

const cwd = process.cwd();
const port = Number(process.env.PORT || 8082);
const projectConfig: ProjectConfig = {
  sourceFilePattern: "{,!(node_modules)/**/}*.{css,pc}"
};

try {
  Object.assign(projectConfig, require(path.join(cwd, CONFIG_NAME)));
} catch(e) {


}

start({ projectConfig, cwd, port });
