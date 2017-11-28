import { PCExpression, Token, ExpressionLocation } from "./ast";
import { getPosition } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { repeat } from "./str-utils";
import { Diagnostic } from "./parser-utils";

export enum DiagnosticType {
  WARNING = "WARNING",
  ERROR = "ERROR"
};

export type Diagnostic = {
  type: DiagnosticType;
  location: ExpressionLocation;
  message: string;
  source: string;
  filePath: string;
};

export type ParseResult = {
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
export const generatePrettyErrorMessage = ({ location, filePath = "", message, source }:  Diagnostic) => {
  let prettyMessage = `${message}\n\n`;

  const sourceLines = source.split("\n");

  const targetLines = sourceLines.slice(location.start.line - 1, location.end.line + 1).map(line => line + "\n");
  
  const highlightedLines = [
    "\x1b[90m" + targetLines[0].substr(0, location.start.column)  + "\x1b[0m" +
    "\x1b[31m" + targetLines[0].substr(location.start.column) + "\x1b[0m",
    ...targetLines.slice(1, location.end.line - location.start.line).map(line => "\x1b[31m" + line + "\x1b[0m"),
    "\x1b[31m" + targetLines[targetLines.length - 1].substr(0, location.end.column) + "\x1b[0m" +
    "\x1b[90m" + targetLines[targetLines.length - 1].substr(location.end.column) + "\x1b[0m",
  ];

  for (let i = 0, {length} = highlightedLines; i < length; i++) {
    prettyMessage += `${location.start.line + i}| ${highlightedLines[i]}`;
  }
  

  return prettyMessage;
}