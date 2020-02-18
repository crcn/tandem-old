import * as crc32 from "crc32";
import { Options } from "./utils";

export type TranslateContext = {
  filePath: string;
  buffer: string;
  lineNumber: number;
  isNewLine: boolean;
  scope: string;
  indent: string;
  importIds: string[];
  args: Options;
  omitParts: string[];
};

export const createTranslateContext = (
  filePath: string,
  importIds: string[],
  args: Options,
  indent: string = "  "
): TranslateContext => ({
  buffer: "",
  filePath,
  importIds,
  scope: crc32(filePath),
  isNewLine: true,
  lineNumber: 0,
  indent,
  args,
  omitParts:
    (args.omitParts &&
      !Array.isArray(args.omitParts) &&
      Array.from(args.omitParts.split(/\s*,\s*/))) ||
    []
});

export const addBuffer = (buffer: string, context: TranslateContext) => ({
  ...context,
  buffer:
    context.buffer +
    (context.isNewLine ? context.indent.repeat(context.lineNumber) : "") +
    buffer,
  isNewLine: buffer.indexOf("\n") === buffer.length - 1
});

export const startBlock = (context: TranslateContext) => ({
  ...context,
  lineNumber: context.lineNumber + 1
});

export const endBlock = (context: TranslateContext) => ({
  ...context,
  lineNumber: context.lineNumber - 1
});
