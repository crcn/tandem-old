export type TranslateContext = {
  filePath: string;
  buffer: string;
  lineNumber: number;
  isNewLine: boolean;
  indent: string;
};

export const createTranslateContext = (
  filePath: string,
  indent: string = "  "
): TranslateContext => ({
  buffer: "",
  filePath,
  isNewLine: true,
  lineNumber: 0,
  indent
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
