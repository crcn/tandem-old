import * as chalk from "chalk";
import * as path from "path";
import { CoreApplicationService } from "@tandem/core";
import { titleize } from "inflection";
import * as moment from "moment";
import { ansi_to_html } from "ansi_up";

// beat TS type checking
chalk["" + "enabled"] = true;

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

    const logOptions = this.config.log || {};
    const logLevel   = logOptions.level || LogLevel.ALL;
    const logPrefix  = logOptions.prefix || "";

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

    text = PREFIXES[level] + logPrefix + text;

    if (!this.config.argv || this.config.argv.color !== false) {
      text = colorize(text);
    }

    if (typeof window !== "undefined") {
      return styledConsoleLog(ansi_to_html(text));
    }

    if (hlog) {
      if (text.toLowerCase().indexOf(hlog.toLowerCase()) !== -1) {
        text = text.replace(new RegExp(hlog, "ig"), match => chalk.bold.bgMagenta(match));
      }
    }

    log(text);
  }
}


function styledConsoleLog(...args: any[]) {
    var argArray = [];

    if (args.length) {
        var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
        var endTagRe = /<\/span>/gi;

        var reResultArray;
        argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
        while (reResultArray = startTagRe.exec(arguments[0])) {
            argArray.push(reResultArray[2]);
            argArray.push('');
        }

        // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
        for (var j = 1; j < arguments.length; j++) {
            argArray.push(arguments[j]);
        }
    }

    console.log.apply(console, argArray);
}