import { PCExpression } from "./ast";
import { TokenScanner } from "./scanners";
import { tokenizePaperclipSource } from "./tokenizer";


const _memos: any = {};

export const parsePaperclipSource = (source: string) => {

  // should be fine since returned value is immutable
  if (_memos[source]) return _memos[source];

  const tokenScanner = tokenizePaperclipSource(source);

  return createRootExpression(tokenScanner);
}

const createRootExpression = (scanner: TokenScanner) => {

}