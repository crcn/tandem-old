import { Token } from "./ast";
import { createToken } from "./ast-utils";
import { StringScanner, TokenScanner } from "./scanners";

export enum PCTokenType {
  LESS_THAN,
  LESS_THAN_OR_EQUAL,
  CLOSE_TAG,
  COMMA,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL,
  COMMENT,
  BACKSLASH,
  PERIOD,
  BANG,
  AND,
  OR,
  PLUS,
  COLON,
  MINUS,
  NUMBER,
  STAR,
  PERCENT,
  PAREN_OPEN,
  PAREN_CLOSE,
  DOUBLE_EQUALS,
  TRIPPLE_EQUELS,
  BRACKET_OPEN,
  BRACKET_CLOSE,
  CURLY_BRACKET_OPEN,
  CURLY_BRACKET_CLOSE,
  EQUALS,
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  TEXT,
  RESERVED_KEYWORD,
  WHITESPACE
};

export const tokenizePaperclipSource = (source: string) => {
  const scanner = new StringScanner(source);
  const tokens: Token[] = [];
  while(!scanner.ended()) {
    const cchar = scanner.curr();

    let token: Token;

    if (cchar === "<") {
      if (scanner.peek(2) === "</") {
        token = createToken(PCTokenType.CLOSE_TAG, scanner.pos, scanner.take(2));
      } else if (scanner.peek(4) === "<!--") {
        let buffer = scanner.take(4);
        while(!scanner.ended()) {
          const cchar = scanner.curr();
          if (cchar === "-" && scanner.peek(3) === "-->") {
            buffer += scanner.take(3);
            break;
          }
          scanner.next();
          buffer += cchar;
        }

        token = createToken(PCTokenType.COMMENT, scanner.pos, buffer);
      } else if (scanner.peek(2) === "<=") {
        token = createToken(PCTokenType.LESS_THAN_OR_EQUAL, scanner.pos, scanner.take(2));
      } else {
        token = createToken(PCTokenType.LESS_THAN, scanner.pos, scanner.shift());
      }
    } else if (cchar === "&" && scanner.peek(2) === "&&") {
      token = createToken(PCTokenType.AND, scanner.pos, scanner.take(2));
    } else if (cchar === "|" && scanner.peek(2) === "||") {
      token = createToken(PCTokenType.OR, scanner.pos, scanner.take(2));
    } else if (cchar === ">") {
      if (scanner.peek(2) === ">=") {
        token = createToken(PCTokenType.GREATER_THAN_OR_EQUAL, scanner.pos, scanner.take(2));
      } else {
        token = createToken(PCTokenType.GREATER_THAN, scanner.pos, scanner.shift());
      }
    } else if (cchar === "=") {
      if (scanner.peek(3) === "===") {
        token = createToken(PCTokenType.TRIPPLE_EQUELS, scanner.pos, scanner.take(3));
      } else if (scanner.peek(2) === "==") {
        token = createToken(PCTokenType.DOUBLE_EQUALS, scanner.pos, scanner.take(2));
      } else {
        token = createToken(PCTokenType.EQUALS, scanner.pos, scanner.shift());
      }
    } else if (cchar === ":") {
      token = createToken(PCTokenType.COLON, scanner.pos, scanner.shift());
    } else if (cchar === ",") {
      token = createToken(PCTokenType.COMMA, scanner.pos, scanner.shift());
    } else if (cchar === "'") {
      token = createToken(PCTokenType.SINGLE_QUOTE, scanner.pos, scanner.shift());
    } else if (cchar === "!") {
      token = createToken(PCTokenType.BANG, scanner.pos, scanner.shift());
    } else if (cchar === "/") {
      token = createToken(PCTokenType.BACKSLASH, scanner.pos, scanner.shift());
    } else if (cchar === ".") {
      if (/\.\d/.test(scanner.peek(2))) {
        token = getNumberToken(scanner);
      } else {
        token = createToken(PCTokenType.PERIOD, scanner.pos, scanner.shift());
      }
    } else if (cchar === "\"") {
      token = createToken(PCTokenType.DOUBLE_QUOTE, scanner.pos, scanner.shift());
    } else if (cchar === "+") {
      token = createToken(PCTokenType.PLUS, scanner.pos, scanner.shift());
    } else if (cchar === "-") {
      if (/\-\d/.test(scanner.peek(2))) {
        token = getNumberToken(scanner);
      } else {
        token = createToken(PCTokenType.MINUS, scanner.pos, scanner.shift());
      }
    } else if (cchar === "*") {
      token = createToken(PCTokenType.STAR, scanner.pos, scanner.shift());
    } else if (cchar === "%") {
      token = createToken(PCTokenType.PERCENT, scanner.pos, scanner.shift());
    } else if (cchar === "[") {
      token = createToken(PCTokenType.BRACKET_OPEN, scanner.pos, scanner.shift());
    } else if (cchar === "]") {
      token = createToken(PCTokenType.BRACKET_CLOSE, scanner.pos, scanner.shift());
    }  else if (cchar === "(") {
      token = createToken(PCTokenType.PAREN_OPEN, scanner.pos, scanner.shift());
    } else if (cchar === ")") {
      token = createToken(PCTokenType.PAREN_CLOSE, scanner.pos, scanner.shift());
    } else if (cchar === "{") {
      token = createToken(PCTokenType.CURLY_BRACKET_OPEN, scanner.pos, scanner.shift());
    } else if (cchar === "}") {
      token = createToken(PCTokenType.CURLY_BRACKET_CLOSE, scanner.pos, scanner.shift());
    } else if (/\d/.test(cchar)) {
      token = getNumberToken(scanner);
    } else if (/[\s\r\n\t]/.test(cchar)) {
      token = createToken(PCTokenType.WHITESPACE, scanner.pos, scanner.scan(/[\s\r\n\t]/));
    } else {
      
      const text = scanner.scan(/[^-<>,='":\./\\(){}\[\]\s\r\n\t]/) || scanner.shift();

      // null intentionally left out
      token = createToken(text === "undefined" ? PCTokenType.RESERVED_KEYWORD : PCTokenType.TEXT, scanner.pos, text);
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
};

const getNumberToken = (scanner: StringScanner) => {
  return createToken(PCTokenType.NUMBER, scanner.pos, scanner.match(/^\-?(\d+(\.\d+)?|\.\d+)/));
};
