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

export const addLine = (line: string, context: TranslateContext) => ({
  ...addBuffer(line + "\n", context),
  isNewLine: true
});

export const addBuffer = (buffer: string, context: TranslateContext) => ({
  ...context,
  buffer:
    context.buffer +
    (context.isNewLine ? context.indent.repeat(context.lineNumber) : "") +
    buffer,
  isNewLine: false
});

export const startBlock = (line: string, context: TranslateContext) => ({
  ...addLine(line, context),
  lineNumber: context.lineNumber + 1
});

export const endBlock = (line: string, context: TranslateContext) =>
  addLine(line, {
    ...context,
    lineNumber: context.lineNumber - 1
  });
