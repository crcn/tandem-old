import * as chalk from "chalk";
import * as path from "path";
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

const cwd = process.cwd();

const highlighters = [

  createLogColorizer(/^INF/, (match) => chalk.bgCyan(match)),
  createLogColorizer(/^ERR/, (match) => chalk.bgRed(match)),
  createLogColorizer(/^DBG/, (match) => chalk.grey.bgBlack(match)),
  createLogColorizer(/^WRN/, (match) => chalk.bgYellow(match)),

  // timestamp
  createLogColorizer(/\[\d+\.\d+\.\d+\]/, (match, inner) => `[${chalk.grey(inner)}]`),

  // URL
  createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s\("':]+)?\/)([^\/\)\s"':]+\/?)+/g, (match) => {
    return chalk.yellow(/\w+:\/\//.test(match) ? match : match.replace(cwd + "/", ""))
  }),

  // duration
  createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)(\s|$)/g, (match) => chalk.bold.cyan(match)),

  // numbers
  createLogColorizer(/\b\d+(\.\d+)?\b/g, (match, inner) => `${chalk.cyan(match)}`),

  // strings
  createLogColorizer(/"(.*?)"/g, (match, inner) => `"${chalk.blue(inner)}"`),

  // tokens
  createLogColorizer(/([\:\{\}",\(\)]|->|null|undefined|Infinity)/g, (match) => chalk.grey(match)),

 // <<output - green (from audio again)
  createLogColorizer(/<<(.*)/g, (match, word) => chalk.green(word)),

 // >>input - magenta (from audio)
  createLogColorizer(/>>(.*)/g, (match, word) => chalk.magenta(word)),

  // **BIG EMPHASIS**
  createLogColorizer(/\*\*(.*?)\*\*/, (match, word) => chalk.bgBlue(word)),

  // *emphasis*
  createLogColorizer(/\*(.*?)\*/g, (match, word) => chalk.bold(word)),

  // ___underline___
  createLogColorizer(/___(.*?)___/g, (match, word) => chalk.underline(word)),

  // ~de emphasis~
  createLogColorizer(/~(.*?)~/g, (match, word) => chalk.grey(word)),
];

function colorize(input: string) {
  let output = input;
  for (let i = 0, n = highlighters.length; i < n; i++) output = highlighters[i](output);
  return output;
}


// I'm against abbreviations, but it's happening here
// since all of these are the same length -- saves space in stdout, and makes
// logs easier to read.
const PREFIXES = {
  [LogLevel.VERBOSE]: "DBG ",
  [LogLevel.INFO]: "INF ",
  [LogLevel.WARN]: "WRN ",
  [LogLevel.ERROR]: "ERR ",
}

export class ConsoleLogService extends CoreApplicationService<any> {

  [LogAction.LOG]({ level, text, filterable }: LogAction) {

    const logLevel = this.config.logLevel || LogLevel.ALL;

    if (!(level & logLevel) && filterable !== false) return;

    // highlight log function from argv -- --hlog="something to highlight"
    const hlog = String(this.config && this.config.argv && this.config.argv.hlog || "");

    const log = {
      [LogLevel.VERBOSE]: console.log.bind(console),
      [LogLevel.LOG]: console.log.bind(console),
      [LogLevel.INFO]: console.info.bind(console),
      [LogLevel.WARN]: console.warn.bind(console),
      [LogLevel.ERROR]: console.error.bind(console)
    }[level];

    if (this.config.argv && this.config.argv.color !== false) {
      text = colorize(PREFIXES[level] + text);
    }

    if (hlog) {
      if (text.toLowerCase().indexOf(hlog.toLowerCase()) !== -1) {
        text = text.replace(new RegExp(hlog, "ig"), match => chalk.bold.bgMagenta(match));
      }
    }

    log(text);
  }
}