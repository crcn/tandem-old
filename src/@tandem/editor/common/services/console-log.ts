import * as chalk from "chalk";
import { CoreApplicationService } from "@tandem/core";
import { titleize } from "inflection";
import * as moment from "moment";
import {
  Logger,
  Action,
  LogLevel,
  serialize,
  LogAction,
  serializable,
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

  // ~de emphasis~
  createLogColorizer(/~(.*?)~/g, (match, word) => chalk.grey(word)),

  // *emphasis*
  createLogColorizer(/\*(.*?)\*/g, (match, word) => chalk.bold(word)),

  // __big emphasis__
  createLogColorizer(/__(.*?)__/g, (match, word) => chalk.underline(word)),

  // !success
  createLogColorizer(/!([^\s]+)/g, (match, word) => chalk.green(word)),

  // >>input - magenta (from audio)
  createLogColorizer(/>>(.*)/g, (match, word) => chalk.magenta(word)),

  // <<output - green (from audio again)
  createLogColorizer(/<<(.*)/g, (match, word) => chalk.green(word)),

  // tokens
  createLogColorizer(/([\:\{\}",\(\)]|->|null|undefined|Infinity)/g, (match) => chalk.grey(match)),

  // strings
  createLogColorizer(/"(.*?)"/g, (match, inner) => `"${chalk.blue(inner)}"`),

  // numbers
  createLogColorizer(/\b\d+(\.\d+)?\b/g, (match, inner) => `${chalk.cyan(match)}`),

  // URL
  createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s\("']+)?\/)([^\/\)\s"']+\/?)+/g, (match, word) => chalk.yellow(match)),

  // duration
  createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)/g, (match) => chalk.bold.cyan(match)),

  // timestamp
  createLogColorizer(/\[\d+\.\d+\.\d+\]/, (match, inner) => `[${chalk.grey(inner)}]`),

  createLogColorizer(/\s?INFO\s*/, (match) => chalk.bgCyan(match)),
  createLogColorizer(/\s?ERR(OR)?\s?/i, (match) => chalk.bgRed(match)),
  createLogColorizer(/\s?DEBUG\s?/i, (match) => chalk.grey.bgBlack(match)),
  createLogColorizer(/\s?WARN(ING)?\s?/i, (match) => chalk.bgYellow(match))
];

function colorize(input: string) {
  let output = input; //.replace(/'/g, "‘");
  for (let i = highlighters.length; i--;) output = highlighters[i](output);
  return output;
}

const PREFIXES = {
  [LogLevel.VERBOSE]: "DEBUG: ",
  [LogLevel.INFO]: "INFO : ",
  [LogLevel.WARN]: "WARN : ",
  [LogLevel.ERROR]: "ERROR: ",
}

export class ConsoleLogService extends CoreApplicationService<any> {

  [LogAction.LOG]({ level, text }: LogAction) {

    // highlight log function from argv -- --hlog="something to highlight"
    const hlog = String(this.config && this.config.argv && this.config.argv.hlog || "");

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
        text = text.replace(new RegExp(hlog, "ig"), match => chalk.bold.bgMagenta(match));
      }
    }

    log(text);
  }
}