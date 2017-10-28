import { 
  Token,
  PCElement, 
  PCString, 
  PCStartTag,
  PCEndTag,
  PCBlock, 
  PCAttribute, 
  PCFragment,
  ExpressionPosition,
  PCExpressionType, 
  ExpressionLocation,
  getLocation,
  PCExpression,
  PCSelfClosingElement
} from "./ast";

import { weakMemo } from "../utils";
import { StringScanner, Scanner, TokenScanner, createToken } from "./scanners";

enum TokenType {
  LESS_THAN,
  GREATER_THAN,
  BLOCK_START,
  BLOCK_END,
  BACKSLASH,
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

const tokenize = (source: string) => {
  const scanner = new StringScanner(source);
  const tokens: Token[] = [];
  while(!scanner.ended()) {
    const cchar = scanner.curr();

    let token: Token;

    if (cchar === "<") {
      token = createToken(TokenType.LESS_THAN, scanner.pos, scanner.shift());
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
    } else if (scanner.peek(2) === "{{") {
      token = createToken(TokenType.BLOCK_START, scanner.pos, scanner.take(2));
    } else if (scanner.peek(2) === "}}") {
      token = createToken(TokenType.BLOCK_END, scanner.pos, scanner.take(2));
    } else if (/[\s\r\n\t]/.test(cchar)) {
      token = createToken(TokenType.WHITESPACE, scanner.pos, scanner.scan(/[\s\r\n\t]/));
    } else {
      token = createToken(TokenType.STRING, scanner.pos, scanner.scan(/[^<>='"{}\s\r\n\t]/) || scanner.next());
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
}


export const parse = weakMemo((source: string) => {
  return createFragment(tokenize(source));
});

const throwUnexpectedToken = (source: string, token: Token, expected: string[]) => {
  throw new Error(`Unexpected token "${token.value}" at ${token.pos}, expected ${expected.join(", ")}`);
};

function assertCurrTokenType(scanner: TokenScanner, type: TokenType, expected: string[]) {
  const token = scanner.curr();
  if (!token || token.type !== type) {
    throwUnexpectedToken(scanner.source, scanner.curr(), expected);
  }
}
  
function createFragment(scanner: TokenScanner): PCFragment  {
  const children = [];
  while(!scanner.ended()) {
    children.push(createNode(scanner));
  }
  return {
    type: PCExpressionType.FRAGMENT,
    location: children.length ? getLocation(children[0].location.start, children[children.length - 1].location.end, scanner.source) : NO_LOCATION,
    children,
  }
}

function createNode(scanner: TokenScanner): PCExpression  {
  const token = scanner.curr();
  if (token.type === TokenType.LESS_THAN) {
    return createTag(scanner);
  } else if (token.type === TokenType.BLOCK_START) {
    return createBlock(scanner);
  } else {
    return createText(scanner);
  }
}

function createTag(scanner: TokenScanner): PCElement | PCEndTag | PCSelfClosingElement {
  if (scanner.peekNext().type === TokenType.BACKSLASH) {
    return createEndTag(scanner);
  }
  const startTag = createStartTag(scanner);
  if (startTag.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return startTag;
  }

  const children: PCExpression[] = [];
  let endTag: PCEndTag;

  while(1) {

    const childOrEndTag = createNode(scanner);

    // eof
    if (!childOrEndTag) {
      break;
    }
    if (childOrEndTag.type === PCExpressionType.END_TAG) {
      // TODO -- assert that the name is the same
      endTag = childOrEndTag as PCEndTag;
      break;
    } else {
      children.push(childOrEndTag);
    }
  }

  // tag does not exist
  if (!endTag) {  
    throw new Error(`Unclosed tag ${startTag.name} found at pos ${startTag.location.start}`);
  }

  return {
    type: PCExpressionType.ELEMENT,
    location: getLocation(startTag.location.start, endTag.location.end, scanner.source),
    startTag,
    children,
    endTag
  } as PCElement;
}

function createStartTag(scanner: TokenScanner): PCStartTag | PCSelfClosingElement {
  const startToken = scanner.curr(); // <
  const nameToken = scanner.next();
  assertCurrTokenType(scanner, TokenType.STRING, []);
  
  scanner.next();
  const attributes = createAttributes(scanner);

  const curr = scanner.curr();
  let type: PCExpressionType;
  let endToken: Token;

  if (curr.type === TokenType.BACKSLASH) {
    endToken = scanner.next(); // take >
    scanner.next(); // eat >
    type = PCExpressionType.SELF_CLOSING_ELEMENT;
  } else {
    endToken = scanner.next(); // eat >
    type = PCExpressionType.START_TAG;
  }

  return {
    type,
    location: getLocation(startToken, endToken, scanner.source),
    name: nameToken.value,
    attributes,
  };
}

function eatWhitespace(scanner: TokenScanner) {
  while(1) {
    const curr = scanner.curr();
    if (curr.type !== TokenType.WHITESPACE) {
      break;
    }
    scanner.next();
  }
}

function createAttribute(scanner: TokenScanner): PCAttribute {
  const name = scanner.curr();
  assertCurrTokenType(scanner, TokenType.STRING, ["string"]);
  scanner.next(); // eat name

  // only attribute name is present
  if(scanner.curr().value !== "=") {
    return {
      type: PCExpressionType.ATTRIBUTE,
      location: getLocation(name, name.pos + name.value.length, scanner.source),
      name: name.value
    };
  }

  assertCurrTokenType(scanner, TokenType.EQUALS, ["="]);
  scanner.next(); // eat =
  const value = createAttributeValue(scanner);
  return {
    type: PCExpressionType.ATTRIBUTE,
    location: getLocation(name, value.location.end, scanner.source),
    name: name.value,
    value,
  }
}

function createAttributes(scanner: TokenScanner): PCAttribute[] {

  const attributes: PCAttribute[] = [];
  
  while(1) {
    eatWhitespace(scanner);
    const currType = scanner.curr().type;
    if (currType === TokenType.BACKSLASH || currType === TokenType.GREATER_THAN) break;
    attributes.push(createAttribute(scanner));
  }

  return attributes;
}

function createString(scanner: TokenScanner): PCString {
  const start = scanner.curr(); 
  scanner.next(); // eat ' "
  let buffer: string = "";
  let curr: Token;

  while(1) {
    curr = scanner.curr();
    if (curr.type === start.type) {
      break;
    }

    buffer += curr.value;
    scanner.next();
  }

  scanner.next(); // eat ' ""

  return {
    type: PCExpressionType.STRING,
    location: getLocation(start, curr.pos + 1, scanner.source),
    value: buffer
  };
}

function createBlock(scanner: TokenScanner): PCString {
  const start = scanner.next(); // eat {{
  let buffer: string = "";
  let curr: Token;

  while(1) {
    curr = scanner.curr();
    if (!curr || curr.type === TokenType.BLOCK_END) {
      break;
    }

    buffer += curr.value;
    scanner.next();
  }

  scanner.next();

  return {
    type: PCExpressionType.BLOCK,
    location: getLocation(start, curr, scanner.source),
    value: buffer
  };
}

function createAttributeValue(scanner: TokenScanner): PCString | PCBlock {
  const curr = scanner.curr();
  if (curr.type === TokenType.SINGLE_QUOTE || curr.type === TokenType.DOUBLE_QUOTE) {
    return createString(scanner);
  } else {
    return createBlock(scanner);
  }
}

function createEndTag(scanner: TokenScanner): PCEndTag {
  const start = scanner.curr();
  scanner.next(); 
  const nameToken = scanner.next();
  const closeToken = scanner.next();
  assertCurrTokenType(scanner, TokenType.GREATER_THAN, [">"]);
  scanner.next(); // eat >
  return {
    type: PCExpressionType.END_TAG,
    location: getLocation(start, closeToken, scanner.source),
    name: nameToken.value
  };
}

function createText(scanner: TokenScanner): PCString {

  let buffer = "";
  const startToken = scanner.curr();
  let endToken: Token;
  while(1) {
    const currToken = scanner.curr();
    if (!currToken || currToken.type === TokenType.LESS_THAN || currToken.type === TokenType.BLOCK_START) {
      break;
    }
    endToken = currToken;
    buffer += currToken.value;
    scanner.next();
  }

  return {
    type: PCExpressionType.STRING,
    location: getLocation(startToken, endToken, scanner.source),
    value: buffer,
  };
}