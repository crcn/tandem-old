import { Token } from "./ast";
import { createToken } from "./ast-utils";
import { StringScanner, TokenScanner } from "./scanners";

enum TokenType {
  LESS_THAN,
  CLOSE_TAG,
  GREATER_THAN,
  COMMENT_START,
  COMMENT_END,
  BACKSLASH,
  BRACKET_OPEN,
  BRACKET_CLOSE,
  CURLY_BRACKET_OPEN,
  CURLY_BRACKET_CLOSE,
  EQUALS,
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  STRING,
  WHITESPACE
};

const NO_POSITION = {
  line: 0,
  column: 0,
  pos: 0
}

const NO_LOCATION = {
  start: NO_POSITION,
  end: NO_POSITION
}

export const tokenizePaperclipSource = (source: string) => {
  const scanner = new StringScanner(source);
  const tokens: Token[] = [];
  while(!scanner.ended()) {
    const cchar = scanner.curr();

    let token: Token;

    if (cchar === "<") {
      if (scanner.peek(2) === "</") {
        token = createToken(TokenType.CLOSE_TAG, scanner.pos, scanner.take(2));
      } else if (scanner.peek(4) === "<!--") {
        token = createToken(TokenType.COMMENT_START, scanner.pos, scanner.take(4));
      } else {
        token = createToken(TokenType.LESS_THAN, scanner.pos, scanner.shift());
      }
    } else if (cchar === "-" && scanner.peek(3) === "-->") {
      token = createToken(TokenType.COMMENT_END, scanner.pos, scanner.take(3));
    } else if (cchar === ">") {
      token = createToken(TokenType.GREATER_THAN, scanner.pos, scanner.shift());
    } else if (cchar === "=") {
      token = createToken(TokenType.EQUALS, scanner.pos, scanner.shift());
    } else if (cchar === "'") {
      token = createToken(TokenType.SINGLE_QUOTE, scanner.pos, scanner.shift());
    } else if (cchar === "/") {
      token = createToken(TokenType.BACKSLASH, scanner.pos, scanner.shift());
    } else if (cchar === "\"") {
      token = createToken(TokenType.DOUBLE_QUOTE, scanner.pos, scanner.shift());
    } else if (cchar === "[") {
      token = createToken(TokenType.BRACKET_OPEN, scanner.pos, scanner.shift());
    } else if (cchar === "]") {
      token = createToken(TokenType.BRACKET_CLOSE, scanner.pos, scanner.shift());
    } else if (cchar === "{") {
      token = createToken(TokenType.CURLY_BRACKET_OPEN, scanner.pos, scanner.shift());
    } else if (cchar === "}") {
      token = createToken(TokenType.CURLY_BRACKET_CLOSE, scanner.pos, scanner.shift());
    } else if (/[\s\r\n\t]/.test(cchar)) {
      token = createToken(TokenType.WHITESPACE, scanner.pos, scanner.scan(/[\s\r\n\t]/));
    } else {
      token = createToken(TokenType.STRING, scanner.pos, scanner.scan(/[^-<>='"{}\s\r\n\t]/) || scanner.shift());
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
}