import fs = require("fs");
import { BaseStudioMasterCommand } from "./base";
import { dialog } from "electron";

export class InstallShellCommandsCommand extends BaseStudioMasterCommand {
  execute() {
    this.logger.info("Installing shell commands");

    const binPath = "/usr/local/bin/tandem";

    if (fs.existsSync(binPath)) fs.unlinkSync(binPath);
    console.log(this.config.appDirectory + "/bin/tandem.sh");
    
    fs.linkSync(this.config.appDirectory + "/bin/tandem.sh", binPath);

    dialog.showMessageBox({
      buttons: ["ok"],
      message: "The shell command \`tandem\` is installed."
    });
  }
}