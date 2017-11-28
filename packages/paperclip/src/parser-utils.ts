import { PCExpression, Token, ExpressionLocation } from "./ast";
import { getPosition } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { repeat } from "./str-utils";
import { Diagnostic } from "./parser-utils";

export type Diagnostic = {
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
  source: string;
  scanner: TokenScanner;
  diagnostics: Diagnostic[];
};

// TODO - possibly colorize
// export const generatePrettyErrorMessage = ({ location, filePath = "", message, source }:  Diagnostic) => {
//   let prettyMessage = `${filePath}:${location.start.line}:${location.start.} Error: ${message}\n`;
//   const lineStr = source.split("\n")[line - 1];

//   const prefix = `${filePath}:${line}: `;
//   prettyMessage += prefix + lineStr + "\n";
//   prettyMessage += `${repeat(" ", prefix.length + column)}^\n`;

//   return prettyMessage
// }