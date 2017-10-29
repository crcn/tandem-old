import { PCSheet, PCStyleDeclarationProperty, PCAtRule, PCStyleExpressionType, PCStyleRule, PCGroupingRule } from "./style-ast";
import { Token, getLocation } from "./ast";
import { createToken, TokenScanner, StringScanner } from "./scanners";
import { weakMemo } from "aerial-common2";

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
  PERCENT,
  MINUS,
  NUMBER,
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  COMMA
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
    } else if (char === "{") {
      token = createToken(TokenType.PERCENT, scanner.pos, scanner.shift());
    } else if (char === ":") {
      token = createToken(TokenType.COLON, scanner.pos, scanner.shift()); 
    } else if (char === "*") {
      token = createToken(TokenType.STAR, scanner.pos, scanner.shift());
    } else if (char === ",") {
      token = createToken(TokenType.COMMA, scanner.pos, scanner.shift());
    } else if (char === "'") {
      token = createToken(TokenType.SINGLE_QUOTE, scanner.pos, scanner.shift());
    } else if (char === "\"") {
      token = createToken(TokenType.DOUBLE_QUOTE, scanner.pos, scanner.shift());
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
      token = createToken(TokenType.WHITESPACE, scanner.pos, scanner.scan(/[\s\r\n\t]/));
    } else if (/\d/.test(char)) {
      token = createToken(TokenType.NUMBER, scanner.pos, scanner.scan(/[\d.]/));
    } else {
      token = createToken(TokenType.NAME, scanner.pos, scanner.scan(/[^\s\t\{\}:;+*/()"',]/) || scanner.next());
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
}

function eatWhitespace(scanner: TokenScanner) {
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type !== TokenType.WHITESPACE) {
      break;
    }
    scanner.next();
  }
  return !scanner.ended();
}

export const parsePCStyle = weakMemo((style: string) => {
  return createSheet(tokenize(style));
});

const createSheet = (scanner: TokenScanner): PCSheet => {
  return {
    type: PCStyleExpressionType.STYLE_SHEET,
    location: getLocation(0, scanner.source.length - 1, scanner.source),
    children: getRuleChildren(scanner)
  }
};

const getRuleChildren = (scanner: TokenScanner, until = () => false): Array<PCGroupingRule|PCStyleRule> => {

  const children = [];
  while(eatWhitespace(scanner) && !until()) {
    const child = getRuleChild(scanner);
    children.push(child);
  }

  return children;
};

const getRuleChild = (scanner: TokenScanner) => {

  const curr = scanner.curr();

  if (scanner.hasNext() && (scanner.peekNext().type === TokenType.COLON || scanner.peekNext().type === TokenType.MINUS)) {
    return getDeclaration(scanner);
  } else if (curr.type === TokenType.NAME || curr.type == TokenType.NUMBER || curr.type === TokenType.COLON) {
    return getRule(scanner);
  }

  throw new Error(`Unexpected token ${curr.value} (${curr.type}) at ${curr.pos}`);
};

const getRule = (scanner: TokenScanner) => {
  if (scanner.curr().value.charAt(0) === "@") {
    return getAtRule(scanner);
  } else {
    return getStyleRule(scanner);
  }
};

const getAtRule = (scanner: TokenScanner): PCAtRule => {
  const startToken = scanner.curr();
  const [name, ...params] = getBuffer(scanner);
  scanner.next(); // eat {
  const children = getGroupingRuleChildren(scanner);
  const closeBracket = scanner.curr();
  scanner.next(); // eat }
  return {
    type: PCStyleExpressionType.AT_RULE,
    location: getLocation(startToken, closeBracket, scanner.source),
    params,
    name: name.substr(1),
    children,
  };
};

const getGroupingRuleChildren = (scanner: TokenScanner) => getRuleChildren(scanner, () => {
  return scanner.curr().type === TokenType.CLOSE_CURLY_BRACKET;
});

const getStyleRule = (scanner: TokenScanner): PCStyleRule => {
  const startToken = scanner.curr();
  const selectorTextBuffer = getBuffer(scanner);
  eatWhitespace(scanner); 
  scanner.next(); // eat {
  const childrenAndDeclarations = getGroupingRuleChildren(scanner);
  const closeBracket = scanner.curr();
  scanner.next(); // eat }
  return {
    type: PCStyleExpressionType.STYLE_RULE,
    location: getLocation(startToken, closeBracket, scanner.source),
    selectorText: selectorTextBuffer.join(" "),
    children: childrenAndDeclarations.filter((child) => child.type !== PCStyleExpressionType.DECLARATION),
    declarationProperties: childrenAndDeclarations.filter((child) => child.type === PCStyleExpressionType.DECLARATION) as any as  PCStyleDeclarationProperty[]
    
  }
}

const getDeclaration = (scanner: TokenScanner): PCStyleDeclarationProperty => {
  const startToken = scanner.curr();
  eatWhitespace(scanner);
  const nameBuffer = getBuffer(scanner, () => scanner.next().type === TokenType.COLON);
  scanner.next(); // eat :
  eatWhitespace(scanner);
  const valueBuffer = getBuffer(scanner, () => scanner.next().type === TokenType.SEMICOLON);
  const endToken = scanner.curr();
  scanner.next(); // eat ;

  return {
    type: PCStyleExpressionType.DECLARATION,
    location: getLocation(startToken, endToken, scanner.source),
    name: nameBuffer.join(""),
    value: valueBuffer.join("")
  };
}

const getBuffer = (scanner: TokenScanner, until = () => scanner.next().type === TokenType.OPEN_CURLY_BRACKET) => { 

  const buffer = [scanner.curr().value];
  
  while(!scanner.ended() && !until()) {
    buffer.push(scanner.curr().value);
  }   

  return buffer;
};

