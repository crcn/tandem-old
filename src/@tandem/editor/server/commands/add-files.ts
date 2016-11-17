import {
  loggable,
  Logger,
  Action,
  ICommand
} from "@tandem/common";

import { AddFilesRequest } from "@tandem/editor/common";

@loggable()
export class AddFilesCommand implements ICommand {
  protected logger: Logger;
  execute({ filePaths, options }: AddFilesRequest) {
    this.logger.info(`Adding new file ${filePaths.join(" ")}`);
  }
}