import * as chalk from "chalk";
import { BaseApplicationService2 } from "@tandem/core";
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

export class ConsoleLogService extends BaseApplicationService2 {

  [ConsoleLogServiceAction.HIGHLIGHT_LOG](action: ConsoleLogServiceAction) {

  }

  [LogAction.LOG]({ level, text }: LogAction) {

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
      log(chalk[color](": %s"), text);
    }
  }
}