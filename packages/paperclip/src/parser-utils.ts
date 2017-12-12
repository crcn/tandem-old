import { PCExpression, Token, ExpressionLocation, PCRootExpression } from "./ast";
import { getPosition } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { repeat } from "./str-utils";
import { Diagnostic } from "./parser-utils";
import { DependencyGraph } from "./loader";

export enum DiagnosticType {
  WARNING = "WARNING",
  ERROR = "ERROR"
};

export type Diagnostic = {
  type: DiagnosticType;
  location: ExpressionLocation;
  message: string;
  filePath: string;
};

export type ParseResult = {
  root: PCRootExpression;
  diagnostics?: Diagnostic[];
};

export type ParseSubResult = {
  root: PCExpression;
  diagnostics?: Diagnostic[];
};

export type ParseContext = {
  filePath?: string;
  startToken?: Token;
  source: string;
  scanner: TokenScanner;
  diagnostics: Diagnostic[];
};

// TODO - possibly colorize
export const generatePrettyErrorMessage = ({ location, filePath = "", message }:  Diagnostic, graph: DependencyGraph) => {
  let prettyMessage = `${message}\n\n`;
  const source = graph[filePath].module.source.input;

  const sourceLines = source.split("\n");

  const targetLines = sourceLines.slice(location.start.line - 1, location.end.line).map(line => line + "\n");
  
  // const highlightedLines = [
  //   "\x1b[90m" + targetLines[0].substr(0, location.start.column)  + "\x1b[0m" +
  //   "\x1b[31m" + targetLines[0].substr(location.start.column) + "\x1b[0m",
  //   ...targetLines.slice(1, location.end.line - location.start.line).map(line => "\x1b[31m" + line + "\x1b[0m"),
  //   "\x1b[31m" + targetLines[targetLines.length - 1].substr(0, location.end.column) + "\x1b[0m" +
  //   "\x1b[90m" + targetLines[targetLines.length - 1].substr(location.end.column) + "\x1b[0m",
  // ];

  for (let i = 0, {length} = targetLines; i < length; i++) {
    prettyMessage += `${location.start.line + i}| ${targetLines[i]}`;
  }
  

  return prettyMessage;
}