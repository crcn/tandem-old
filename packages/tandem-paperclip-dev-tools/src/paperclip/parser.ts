import { 
  PCElement, 
  PCString, 
  PCStartTag,
  PCEndTag,
  PCBlock, 
  PCAttribute, 
  PCExpressionType, 
  PCExpression,
  PCSelfClosingElement
} from "./ast";

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

type Token = {
  type: TokenType;
  pos: number;
  value?: string;
};

const createToken = (type: TokenType, pos: number, value?: string) => ({ type, pos, value });

class Scanner<T extends string|any[]> {
  public pos: number;
  readonly length: number;
  constructor(protected _target: T) {
    this.pos = 0;
    this.length = _target.length;
  }

  curr() {
    return this._target[this.pos];
  }

  shift() {
    const char = this._target[this.pos];
    this.next();  
    return char;
  }
  
  next() {
    return this._target[Math.min(this.pos = this.pos + 1, this.length)];
  }

  prev() {
    return this._target[Math.max(this.pos = this.pos - 1, 0)];
  }

  ended() {
    return this.pos >= this.length;
  }
}

class StringScanner extends Scanner<string> {
  scan(until: RegExp) {
    let buffer = "";
    while(this.pos < this.length) {
      const cchar = this._target[this.pos];
      if (!cchar.match(until)) break;
      buffer += cchar;
      this.pos++;
    }
    return buffer;
  }
  
  peek(length: number) {
    return this._target.substr(this.pos, length);
  }

  take(length: number) {
    const buffer = this._target.substr(this.pos, length);
    this.pos += length;
    return buffer;
  }
}

class TokenScanner extends Scanner<Token[]> {
  constructor(readonly source: string, tokens: Token[]) {
    super(tokens);
  } 
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
      token = createToken(TokenType.STRING, scanner.pos, scanner.scan(/[^<>='"\s\r\n\t]/));
    }

    tokens.push(token);
  }

  return new TokenScanner(source, tokens);
}

const getLocation = (start:  Token | number, end: Token | number) => ({ 
  start: typeof start === "number" ? start : start.pos, 
  end: typeof end === "number" ? end : end.pos,
});

export const parse = (source: string) => {
  return createExpression(tokenize(source));
}

const throwUnexpectedToken = (source: string, token: Token, expected: string[]) => {
  throw new Error(`Unexpected token "${token.value}" at ${token.pos}, expected ${expected.join(", ")}`);
};

function assertCurrTokenType(scanner: TokenScanner, type: TokenType, expected: string[]) {
  const token = scanner.curr();
  if (!token || token.type !== type) {
    throwUnexpectedToken(scanner.source, scanner.curr(), expected);
  }
}
  

function createExpression(scanner: TokenScanner): PCExpression  {
  while(!scanner.ended()) {
    const token = scanner.curr();
    if (token.type === TokenType.LESS_THAN) {
      return createTag(scanner);
    } else {
      return createText(scanner);
    }
  }
  return null;
}

function createTag(scanner: TokenScanner): PCElement | PCEndTag | PCSelfClosingElement {
  if (scanner.next().type === TokenType.BACKSLASH) {
    return createEndTag(scanner);
  }
  scanner.prev();
  const startTag = createStartTag(scanner);
  if (startTag.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return startTag;
  }

  const children: PCExpression[] = [];
  let endTag: PCEndTag;

  while(1) {

    const childOrEndTag = createExpression(scanner);

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
    location: getLocation(startTag.location.start, endTag.location.end),
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
    location: getLocation(startToken, endToken),
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
  assertCurrTokenType(scanner, TokenType.EQUALS, ["="]);
  scanner.next(); // eat =
  const value = createAttributeValue(scanner);
  return {
    type: PCExpressionType.ATTRIBUTE,
    location: getLocation(name, value.location.end),
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
    location: getLocation(start, curr),
    value: buffer
  };
}

function createBlock(scanner: TokenScanner): PCString {
  const start = scanner.next(); // eat {{
  let buffer: string = "";
  let curr: Token;

  while(1) {
    curr = scanner.curr();
    if (!curr || curr.type === TokenType.BLOCK_START) {
      break;
    }

    buffer += curr.value;
    scanner.next();
  }

  scanner.next();

  return {
    type: PCExpressionType.BLOCK,
    location: getLocation(start, curr),
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
  const nameToken = scanner.next();
  const closeToken = scanner.next();
  assertCurrTokenType(scanner, TokenType.GREATER_THAN, [">"]);
  scanner.next(); // eat >
  return {
    type: PCExpressionType.END_TAG,
    location: getLocation(nameToken, closeToken),
    name: nameToken.value
  };
}

function createText(scanner: TokenScanner): PCString {

  let buffer = "";
  const startToken = scanner.curr();
  let endToken: Token;
  while(1) {
    const currToken = scanner.curr();
    if (!currToken || currToken.type === TokenType.LESS_THAN) {
      break;
    }
    endToken = currToken;
    buffer += currToken.value;
    scanner.next();
  }

  return {
    type: PCExpressionType.STRING,
    location: getLocation(startToken, endToken),
    value: buffer,
  };
}