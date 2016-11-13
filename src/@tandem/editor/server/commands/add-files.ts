import {
  loggable,
  Logger,
  Action,
  IActor
} from "@tandem/common";

import { AddFilesAction } from "@tandem/editor/common/actions";

@loggable()
export class AddFilesCommand implements IActor {
  protected logger: Logger;
  execute({ filePaths, options }: AddFilesAction) {
    this.logger.info(`Adding new file ${filePaths.join(" ")}`);
  }
}