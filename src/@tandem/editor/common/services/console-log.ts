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

  // ~de emphasis~
  createLogColorizer(/~(.*?)~/g, (match, word) => chalk.grey(word)),

  // *emphasis*
  createLogColorizer(/\*(.*?)\*/g, (match, word) => chalk.bold(word)),

  // ___big emphasis___
  createLogColorizer(/___(.*?)___/g, (match, word) => chalk.underline(word)),

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

  // duration
  createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)(\s|$)/g, (match) => chalk.bold.cyan(match)),

  // URL
  createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s\("':]+)?\/)([^\/\)\s"':]+\/?)+/g, (match) => {
    return chalk.yellow(/\w+:\/\//.test(match) ? match : match.replace(cwd + "/", ""))
  }),

  // timestamp
  createLogColorizer(/\[\d+\.\d+\.\d+\]/, (match, inner) => `[${chalk.grey(inner)}]`),

  createLogColorizer(/^INFO\s*/, (match) => chalk.bgCyan(match)),
  createLogColorizer(/^ERR(OR)?\b/, (match) => chalk.bgRed(match)),
  createLogColorizer(/^DEBUG\s?/, (match) => chalk.grey.bgBlack(match)),
  createLogColorizer(/^WARN(ING)?\s?/, (match) => chalk.bgYellow(match))
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

    const logLevel = this.config.logLevel || LogLevel.ALL;

    if (!(level & logLevel)) return;

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