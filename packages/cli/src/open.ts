import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { spawn } from "child_process";
import { DEFAULT_PROJECT_FILE_NAME, TMP_APP_BIN_PATH } from "./constants";
import { start as install } from "./install";

export const start = (cwd: string) => async () => {
  await install(cwd)({ force: false });

  const projectFileName = DEFAULT_PROJECT_FILE_NAME;
  const projectFilePath = path.join(cwd, projectFileName);
  if (!fs.existsSync(projectFilePath)) {
    return console.error(
      chalk.red(
        `No project found. You can create one by running "${chalk.bold(
          "tandem init"
        )}".`
      )
    );
  }

  const proc = spawn(
    `open`,
    [
      TMP_APP_BIN_PATH,
      "--args",
      "filler-this-doesnt-really-matter-here",
      projectFilePath
    ],
    {
      cwd: cwd,
      env: process.env
    }
  );

  // TODO - look for binary
};
