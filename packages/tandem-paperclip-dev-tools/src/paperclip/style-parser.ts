import { PCSheet } from "./style-ast";
import { Token } from "./ast";
import { createToken, TokenScanner, StringScanner } from "./scanners";

enum TokenType {
  AMP,
  OPEN_CURLY_BRACKET,
  CLOSE_CURLY_BRACKET,
  NAME,
  SELECTOR,
  CHAR,
  WHITESPACE,
  VARIABLE,
  COLON,
  SEMICOLON,
  STAR,
  BACKSLASH,
  RIGHT_PAREN,
  LEFT_PAREN,
  PLUS,
  MINUS,
  NUMBER
}

const throwUnexpectedToken = (source: string, token: Token, expected: string[]) => {
  throw new Error(`Unexpected token "${token.value}" at ${token.pos}, expected ${expected.join(", ")}`);
};

const tokenize = (source: string) => {
  const scanner = new StringScanner(source);
  const tokens = [];
  while(!scanner.ended()) {
    const char = scanner.curr();
    let token: Token;

    if (char === "&") {
      token = createToken(TokenType.AMP, scanner.pos, scanner.shift());
    } else if (char === "{") {
      token = createToken(TokenType.OPEN_CURLY_BRACKET, scanner.pos, scanner.shift());
    } else if (char === "}") {
      token = createToken(TokenType.CLOSE_CURLY_BRACKET, scanner.pos, scanner.shift());
    } else if (char === ":") {
      token = createToken(TokenType.COLON, scanner.pos, scanner.shift()); 
    } else if (char === "*") {
      token = createToken(TokenType.STAR, scanner.pos, scanner.shift());
    } else if (char === "(") {
      token = createToken(TokenType.LEFT_PAREN, scanner.pos, scanner.shift());
    } else if (char === ")") {
      token = createToken(TokenType.RIGHT_PAREN, scanner.pos, scanner.shift());
    } else if (char === "/") {
      token = createToken(TokenType.BACKSLASH, scanner.pos, scanner.shift());
    } else if (char === "+") {
      token = createToken(TokenType.PLUS, scanner.pos, scanner.shift());
    } else if (char === "-") {
      token = createToken(TokenType.MINUS, scanner.pos, scanner.shift());
    } else if (char === ";") {
      token = createToken(TokenType.SEMICOLON, scanner.pos, scanner.shift());
    } else if (char === "$") {
      token = createToken(TokenType.VARIABLE, scanner.pos, scanner.scan(/[$\w]+/));
    } else if (/[\s\r\n\t]/.test(char)) {
      token = createToken(TokenType.CLOSE_CURLY_BRACKET, scanner.pos, scanner.scan(/[\s\r\n\t]/));
    } else if (/\d/.test(char)) {
      token = createToken(TokenType.NUMBER, scanner.pos, scanner.scan(/[\d.]/));
    } else {
      token = createToken(TokenType.NAME, scanner.pos, scanner.scan(/[^\s\t\{\}:;+\-*/()]/) || scanner.next());
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
}

export const parsePCStyle = (style: string) => {
  console.log(tokenize(style));
}