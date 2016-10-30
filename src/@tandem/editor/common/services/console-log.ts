import * as chalk from "chalk";
import { CoreApplicationService } from "@tandem/core";
import { titleize } from "inflection";
import * as moment from "moment";
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


function createLogColorizer(tester: RegExp, replaceValue: any) {
  return function(input: string) {
    if (!tester.test(input)) return input;
    return input.replace(tester, replaceValue);
  }
}

const highlighters = [

  // *de emphasis*
  createLogColorizer(/\*(.*?)\*/g, (match, word) => chalk.grey(word)),

  // _emphasis_
  createLogColorizer(/_(.*?)_/g, (match, word) => chalk.un(word)),

  // __big emphasis__
  createLogColorizer(/__(.*?)__/g, (match, word) => chalk.bold(word)),

  // !success
  createLogColorizer(/!([^\s]+)/g, (match, word) => chalk.green(word)),

  // >>input - magenta (from audio)
  createLogColorizer(/>>(.*)/g, (match, word) => chalk.magenta(word)),

  // <<output - green (from audio again)
  createLogColorizer(/<<(.*)/g, (match, word) => chalk.green(word)),

  // strings
  createLogColorizer(/"(.*?)"/g, (match, inner) => `"${chalk.blue(inner)}"`),

  // tokens
  createLogColorizer(/(\b[\:\{\}]\b|->|null|undefined|Infinity)/g, (match) => chalk.grey(match)),

  // URL
  createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s"']+)?\/)([^\/\s"']+\/?)+/g, (match, word) => chalk.yellow(match)),

  // duration
  createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)/g, (match) => chalk.magenta(match)),

  // timestamp
  createLogColorizer(/\[\d+\.\d+\.\d+\]/, (match, inner) => `[${chalk.grey(inner)}]`),

  createLogColorizer(/INFO/, (match) => chalk.bgCyan(match)),
  createLogColorizer(/ERR(OR)?/i, (match) => chalk.bgRed(match)),
  createLogColorizer(/WARN(ING)?/i, (match) => chalk.bgYellow(match))

];

function colorize(input: string) {
  let output = input; //.replace(/'/g, "‘");
  for (let i = highlighters.length; i--;) output = highlighters[i](output);
  return output;
}

const PREFIXES = {
  [LogLevel.VERBOSE]: "",
  [LogLevel.INFO]: "INFO: ",
  [LogLevel.WARN]: "WARN: ",
  [LogLevel.ERROR]: "ERROR: ",
}

export class ConsoleLogService extends CoreApplicationService<any> {

  [LogAction.LOG]({ level, text }: LogAction) {

    const hlog = String(this.config && this.config.argv && this.config.argv.hlog || "");

    // TODO - hlog from argv

    const log = {
      [LogLevel.VERBOSE]: console.log.bind(console),
      [LogLevel.LOG]: console.log.bind(console),
      [LogLevel.INFO]: console.info.bind(console),
      [LogLevel.WARN]: console.warn.bind(console),
      [LogLevel.ERROR]: console.error.bind(console)
    }[level];


    text = colorize(PREFIXES[level] + text);

    if (hlog) {
      if (text.toLowerCase().indexOf(hlog.toLowerCase()) !== -1) {
        text = chalk.bgMagenta(text);
      }
    }

    log(text);
  }
}