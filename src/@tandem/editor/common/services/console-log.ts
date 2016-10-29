import * as chalk from "chalk";
import { CoreApplicationService } from "@tandem/core";
import { titleize } from "inflection";
import {
  Logger,
  LogLevel,
  serializable,
  serialize,
  ENV_IS_NODE,
  Action,
  LogAction,
  definePrivateAction
} from "@tandem/common";

export class ConsoleLogServiceAction extends Action {
  static readonly HIGHLIGHT_LOG = "hlog"; // abbreviated to make
  constructor(type: string, readonly match: string) {
    super(type);
  }
}

export class ConsoleLogService extends CoreApplicationService<any> {

  [LogAction.LOG]({ level, text }: LogAction) {

    const hlog = String(this.config && this.config.argv && this.config.argv.hlog);

    // TODO - hlog from argv

    const log = {
      [LogLevel.VERBOSE]: console.log.bind(console),
      [LogLevel.LOG]: console.log.bind(console),
      [LogLevel.INFO]: console.info.bind(console),
      [LogLevel.WARN]: console.warn.bind(console),
      [LogLevel.ERROR]: console.error.bind(console)
    }[level];

    const color = {
      [LogLevel.VERBOSE]: "grey",
      [LogLevel.LOG]: ENV_IS_NODE ? "white" : "black",
      [LogLevel.INFO]: ENV_IS_NODE ? "cyan": "blue",
      [LogLevel.WARN]: "yellow",
      [LogLevel.ERROR]: "red",
    }[level];


    if (typeof window !== "undefined") {
      log("%c: %s", `color: ${color}`, text);
    } else {

      let ccolor: any = chalk;

      if (hlog) {
        if (text.toLowerCase().indexOf(hlog.toLowerCase()) !== -1) {
          ccolor = chalk.bgMagenta;
        } else {
          ccolor = ccolor[color];
        }
      } else {
        ccolor = chalk[color];
      }

      log(ccolor(": %s"), text);
    }
  }
}