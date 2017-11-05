import { 
  Token,
  PCElement, 
  PCString, 
  PCStartTag,
  PCEndTag,
  PCComment,
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
import { throwUnexpectedToken, assertCurrTokenType, assertCurrTokenExists } from "./utils";
import { StringScanner, Scanner, TokenScanner, createToken, eatUntil } from "./scanners";

enum TokenType {
  LESS_THAN,
  CLOSE_TAG,
  GREATER_THAN,
  COMMENT_START,
  COMMENT_END,
  BACKSLASH,
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

const tokenize = (source: string) => {
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

// TODO - change to parsePC
export const parse = weakMemo((source: string) => {
  return createFragment(tokenize(source));
});

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
  if (token.type === TokenType.COMMENT_START) {
    return createComment(scanner);
  } else if (token.type === TokenType.LESS_THAN) {
    return createTag(scanner);
  } else if (token.type === TokenType.CLOSE_TAG) {
    return createEndTag(scanner);
  } else if (blockIsStarting(scanner)) {
    return createBlock(scanner);
  } else {
    return createText(scanner);
  }
}

function createComment(scanner: TokenScanner): PCComment {
  let buffer = "";
  const startToken = scanner.curr();
  scanner.next(); // eat <!--
  let endToken: Token;
  while(1) {
    const currToken = scanner.curr();
    if (!currToken) {
      break;
    }
    endToken = currToken;
    if (!currToken || currToken.type === TokenType.COMMENT_END) {
      break;
    }
    buffer += currToken.value;
    scanner.next();
  }

  scanner.next(); // eat -->

  return {
    type: PCExpressionType.COMMENT,
    location: getLocation(startToken, endToken, scanner.source),
    value: buffer
  };
}

function createTag(scanner: TokenScanner): PCElement | PCEndTag | PCSelfClosingElement {
  const startTag = createStartTag(scanner);
  if (startTag.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return startTag;
  }

  const children: PCExpression[] = [];
  let endTag: PCEndTag; 

  // TODO - special tags here -- speed it up
  if (/^(script|style)$/.test(startTag.name)) {

    let textContent = "";

    const start = scanner.curr();

    while(!scanner.ended()) {
      const token = scanner.curr();
      if (token.type === TokenType.CLOSE_TAG && scanner.hasNext() && scanner.peek(1).type === TokenType.STRING && scanner.peek(1).value === startTag.name) {
        endTag = createNode(scanner) as PCEndTag;
        break;
      }
      textContent += token.value;
      scanner.next();
    }

    children.push({
      type: PCExpressionType.STRING,
      location: getLocation(start, start.pos + textContent.length, scanner.source),
      value: textContent
    } as PCString);

  } else {
    while(!scanner.ended()) {

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
  }

  // tag does not exist
  if (!endTag) {  
    throw new Error(`Unclosed tag ${startTag.name} found at pos ${startTag.location.start}`);
  }

  if (endTag.name !== startTag.name) {
    throw new Error(`Closing tag found without an open tag.`);
  }

  return {
    type: PCExpressionType.ELEMENT,
    location: getLocation(startTag.location.start, endTag.location.end, scanner.source),
    startTag,
    children,
    endTag
  } as PCElement;
}

function getTagName(scanner: TokenScanner) {
  let name = "";

  while(scanner.curr().type !== TokenType.WHITESPACE && scanner.curr().type !== TokenType.GREATER_THAN && scanner.curr().type !== TokenType.EQUALS) {
    name += scanner.curr().value;
    scanner.next();
  }
  return name;
}

function createStartTag(scanner: TokenScanner): PCStartTag | PCSelfClosingElement {
  const startToken = scanner.curr(); // <
  scanner.next(); // eat <
  let name = getTagName(scanner);
  const attributes = createAttributes(scanner);

  const curr = scanner.curr();
  let type: PCExpressionType;
  let endToken: Token;

  assertCurrTokenExists(scanner);

  if (curr.type === TokenType.BACKSLASH) {
    endToken = scanner.next(); // take >
    scanner.next(); // eat >
    type = PCExpressionType.SELF_CLOSING_ELEMENT;
  } else {
    endToken = scanner.curr();
    assertCurrTokenType(scanner, TokenType.GREATER_THAN);
    scanner.next(); // eat >
    type = PCExpressionType.START_TAG;
  }

  return {
    type,
    location: getLocation(startToken, endToken, scanner.source),
    name,
    attributes,
  };
}

const eatWhitespace = (scanner: TokenScanner) => eatUntil(scanner, TokenType.WHITESPACE);

function createAttribute(scanner: TokenScanner): PCAttribute {
  const start = scanner.curr();
  const name = getTagName(scanner);

  // only attribute name is present
  if(scanner.curr().value !== "=") {
    return {
      type: PCExpressionType.ATTRIBUTE,
      location: getLocation(start, start.pos + name.length, scanner.source),
      name,
    };
  }

  assertCurrTokenType(scanner, TokenType.EQUALS);
  scanner.next(); // eat =
  const value = createAttributeValue(scanner);
  return {
    type: PCExpressionType.ATTRIBUTE,
    location: getLocation(start, value.location.end, scanner.source),
    name,
    value,
  }
}

function createAttributes(scanner: TokenScanner): PCAttribute[] {
  assertCurrTokenExists(scanner);

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

  while(!scanner.ended()) {
    curr = scanner.curr();
    if (curr.type === start.type) {
      break;
    }

    buffer += curr.value;
    scanner.next();
  }

  assertCurrTokenType(scanner, start.type);

  scanner.next(); // eat ' ""

  return {
    type: PCExpressionType.STRING,
    location: getLocation(start, curr.pos + 1, scanner.source),
    value: buffer
  };
}

function createBlock(scanner: TokenScanner): PCString {
  const start = scanner.curr(); // eat {
  scanner.next(); // eat {
  scanner.next(); // eat {
  let buffer: string = "";
  let curr: Token;

  while(1) {
    curr = scanner.curr();
    if (!curr) {
      break;
    }

    // nested block
    if (curr.type === TokenType.CURLY_BRACKET_OPEN) {
      
      buffer += curr.value;
      scanner.next();
      while(!scanner.ended()) {
        curr = scanner.curr();
        buffer += curr.value;
        if (curr.type === TokenType.CURLY_BRACKET_CLOSE) {
          break;
        }
        scanner.next();
      }
      
      curr = scanner.next();
    }

    if (!curr || curr.type === TokenType.CURLY_BRACKET_CLOSE && scanner.peek(1).type === TokenType.CURLY_BRACKET_CLOSE) {
      scanner.next(); // eat }
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
  } else if (blockIsStarting(scanner)) {
    return createBlock(scanner);
  } else {
    throwUnexpectedToken(scanner.source, scanner.curr());
  }
}

function createEndTag(scanner: TokenScanner): PCEndTag {
  const start = scanner.curr(); // </
  scanner.next(); // eat </
  const name = getTagName(scanner);
  const closeToken = scanner.curr();
  assertCurrTokenType(scanner, TokenType.GREATER_THAN);
  scanner.next(); // eat >
  return {
    type: PCExpressionType.END_TAG,
    location: getLocation(start, closeToken, scanner.source),
    name,
  };
}

const blockIsStarting = (scanner: TokenScanner) => {
  return scanner.curr().type === TokenType.CURLY_BRACKET_OPEN && scanner.peek(1).type === TokenType.CURLY_BRACKET_OPEN;
}

function createText(scanner: TokenScanner): PCString {

  let buffer = "";
  const startToken = scanner.curr();
  let endToken: Token;
  while(1) {
    const currToken = scanner.curr();
    if (!currToken || currToken.type === TokenType.LESS_THAN || currToken.type === TokenType.CLOSE_TAG || blockIsStarting(scanner) || currToken.type === TokenType.COMMENT_START) {
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