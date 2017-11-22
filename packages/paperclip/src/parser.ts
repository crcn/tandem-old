// Note that JS, and styles are parsed so that we can do analysis on the
// AST and provide warnings, hints, and errors.

/*

TODOS:
- [ ] Strong types
*/

import { PCExpression, PCTextNode, PCExpressionType, PCElement, PCSelfClosingElement, PCStartTag, PCAttribute, Token, PCEndTag, PCComment, PCString, PCStringBlock, PCBlock, BKBind, BKReservedKeyword, BKExpressionType, BKPropertyReference, BKRepeat, BKIf, BKNot, BKOperation, BKExpression, BKGroup, BKObject, BKProperty, BKNumber, BKKeyValuePair, BKArray, BKString, BKVarReference, CSSExpression, CSSExpressionType, CSSStyleRule, CSSRule, CSSGroupingRule, CSSAtRule, CSSDeclarationProperty, CSSSheet } from "./ast";
import { getLocation, getPosition } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";

const _memos: any = {};

export const parseModuleSource = (source: string) => {
  if (_memos[source]) return _memos[source]; // result should be immutable, so this is okay 

  const tokenScanner = tokenizePaperclipSource(source);
  return _memos[source] = createFragment(tokenScanner);
};

export const parseStyleSource = (source: string) => {
  if (_memos[source]) return _memos[source];

  const tokenScanner = tokenizePaperclipSource(source);
  return _memos[source] = createStyleSheet(tokenScanner);
};

const createFragment = (scanner: TokenScanner) => {

  const childNodes = [];
  while(!scanner.ended()) {
    childNodes.push(createExpression(scanner));
  }
  
  return childNodes.length === 1 ? childNodes[0] : ({
    type: PCExpressionType.FRAGMENT,
    location: getLocation(0, scanner.source.length, scanner.source),
    childNodes,
  })
}

const createExpression = (scanner: TokenScanner) => {
  switch(scanner.curr().type) {
    case PCTokenType.WHITESPACE: return createTextNode(scanner);
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: return createAttributeString(scanner);
    case PCTokenType.LESS_THAN: return createTag(scanner);
    case PCTokenType.CLOSE_TAG: return createCloseTag(scanner);
    case PCTokenType.COMMENT: return createComment(scanner);
    default: {
      if (isBlockStarting(scanner)) {
        return createBlock(scanner);
      }
      return createTextNode(scanner);
    }
  }
};

const createBlock = (scanner: TokenScanner): PCBlock => {
  const start = scanner.curr();
  scanner.next(); // eat [
  scanner.next(); // eat [
  eatWhitespace(scanner);
  const value = createBKStatement(scanner);
  eatWhitespace(scanner);
  assertCurrTokenType(scanner, PCTokenType.BRACKET_CLOSE);
  scanner.next(); // eat ]
  assertCurrTokenType(scanner, PCTokenType.BRACKET_CLOSE);
  scanner.next(); // eat ]

  return ({
    type: PCExpressionType.BLOCK,
    location: getLocation(start, scanner.curr(), scanner.source),
    value,
  })
}

const createBKStatement = (scanner: TokenScanner) => {
  switch(scanner.curr().value) {
    case "bind": return createBindBlock(scanner);
    case "repeat": return createRepeatBlock(scanner);
    case "if": return createConditionBlock(scanner, BKExpressionType.IF);
    case "elseif": return createConditionBlock(scanner, BKExpressionType.ELSEIF);
    case "else": return createConditionBlock(scanner, BKExpressionType.ELSE);
    case "property": return createPropertyBlock(scanner, BKExpressionType.PROPERTY);
    default: {
      throwUnexpectedToken(scanner.source, scanner.curr());
    }
  }
};

const createBKExpressionStatement = (scanner: TokenScanner) => createBKOperation(scanner);

const createBKOperation = (scanner: TokenScanner): BKExpression => {
  const lhs = createBKExpression(scanner);
  eatWhitespace(scanner);
  const operator = scanner.curr();
  const otype = operator.type;

  const isOperator = otype === PCTokenType.AND || otype === PCTokenType.OR || otype == PCTokenType.PLUS || otype === PCTokenType.MINUS || otype === PCTokenType.STAR || otype === PCTokenType.BACKSLASH || otype === PCTokenType.DOUBLE_EQUALS || otype === PCTokenType.TRIPPLE_EQUELS || otype === PCTokenType.GREATER_THAN || otype === PCTokenType.LESS_THAN || otype === PCTokenType.LESS_THAN_OR_EQUAL || otype === PCTokenType.GREATER_THAN_OR_EQUAL || otype === PCTokenType.NOT_EQUALS || otype === PCTokenType.NOT_DOUBLE_EQUALS;

  if (!isOperator) {
    return lhs;
  }

  scanner.next(); // eat operator
  eatWhitespace(scanner);

  const rhs = createBKOperation(scanner);
  
  // NOTE that we don't need to worry about operation weights since paperclip
  // is compiled
  return {
    type: BKExpressionType.OPERATION,
    left: lhs,
    right: rhs,
    operator: operator.value,
    location: getLocation(lhs.location.start, rhs.location.end, scanner.source),
  } as BKOperation;
};

const createBKExpression = (scanner: TokenScanner) => {
  eatWhitespace(scanner);
  switch(scanner.curr().type) {
    case PCTokenType.BANG: return createNotExpression(scanner);
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: return createString(scanner);
    case PCTokenType.NUMBER: return createNumber(scanner);
    case PCTokenType.CURLY_BRACKET_OPEN: return createObject(scanner);
    case PCTokenType.BRACKET_OPEN: return createArray(scanner);
    case PCTokenType.PAREN_OPEN: return createGroup(scanner);
    case PCTokenType.TEXT: return createPropReference(scanner);
    case PCTokenType.RESERVED_KEYWORD: return createReservedKeyword(scanner);
    default: {
      throwUnexpectedToken(scanner.source, scanner.curr());
    }
  }
};

const createString = (scanner: TokenScanner): BKString => {
  const start = scanner.curr();
  scanner.next(); // eat '
  let value = "";
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.value === start.value) {
      break;
    }

    // escape
    if (curr.value === "\\") {
      value += scanner.next().value;
      scanner.next();
      continue;
    }

    value += curr.value;

    scanner.next();
  }

  assertCurrTokenType(scanner, start.type);

  scanner.next(); // eat quote


  return {
    type: BKExpressionType.STRING,
    location: getLocation(start, scanner.curr(), scanner.source),
    value,
  };
};

const createNumber = (scanner: TokenScanner): BKNumber => {
  const start = scanner.curr();
  scanner.next();
  return ({
    type: BKExpressionType.NUMBER,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createObject = (scanner: TokenScanner): BKObject => {
  const start = scanner.curr();
  scanner.next(); // eat {

  const properties: BKKeyValuePair[] = [];

  while(!scanner.ended()) {
    eatWhitespace(scanner);
    if (scanner.curr().type === PCTokenType.CURLY_BRACKET_CLOSE) {
      break;
    }

    properties.push(createKeyValuePair(scanner));
    eatWhitespace(scanner);

    const curr = scanner.curr();

    // will break in next loop
    if (curr.type === PCTokenType.CURLY_BRACKET_CLOSE) {
      continue;
    }

    if (curr.type !== PCTokenType.COMMA && curr) {
      throwUnexpectedToken(scanner.source, curr);
    }

    scanner.next(); 
  }

  assertCurrTokenType(scanner, PCTokenType.CURLY_BRACKET_CLOSE);

  scanner.next(); // eat }

  return {
    type: BKExpressionType.OBJECT,
    location: getLocation(start, scanner.curr(), scanner.source),
    properties,
  };
};

const createArray = (scanner: TokenScanner): BKArray => {
  const start = scanner.curr();
  scanner.next(); 
  eatWhitespace(scanner);
  const values: BKExpression[] = [];
  const curr = scanner.curr();
  if (curr.type !== PCTokenType.BRACKET_CLOSE) {
    while(1) {
      values.push(createBKExpression(scanner));
      eatWhitespace(scanner);
      const curr = scanner.curr();
      if (curr.type === PCTokenType.BRACKET_CLOSE) {
        break;
      }
      assertCurrTokenType(scanner, PCTokenType.COMMA);
      scanner.next();
    }
  }

  assertCurrTokenType(scanner, PCTokenType.BRACKET_CLOSE);
  scanner.next();

  return {
    type: BKExpressionType.ARRAY,
    location: getLocation(start, scanner.curr(), scanner.source),
    values,
  }
}

const createKeyValuePair = (scanner: TokenScanner): BKKeyValuePair => {
  let key;
  switch(scanner.curr().type) {
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: {
      key = createString(scanner);
      break;
    }
    default: {
      key = createVarReference(scanner);
    }
  }
  eatWhitespace(scanner);
  assertCurrTokenType(scanner, PCTokenType.COLON);
  scanner.next(); // eat :
  eatWhitespace(scanner);
  const value = createBKExpressionStatement(scanner);

  return {
    type: BKExpressionType.KEY_VALUE_PAIR,
    location: getLocation(key.location.start, value.location.end, scanner.source),
    key: key.name,
    value,
  }
}

const createGroup = (scanner: TokenScanner): BKGroup => {
  const start = scanner.curr();
  scanner.next(); // eat )
  const value = createBKExpressionStatement(scanner);
  scanner.next(); // eat )
  return {
    type: BKExpressionType.GROUP,
    value,
    location: getLocation(start, scanner.curr(), scanner.source),
  }
}

const createReservedKeyword = (scanner: TokenScanner): BKReservedKeyword => {
  const start = scanner.curr();
  scanner.next();
  return {
    type: BKExpressionType.RESERVED_KEYWORD,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source),
  };
};

const createBindBlock = (scanner: TokenScanner): BKBind => {
  const start = scanner.curr();
  scanner.next(); // eat bind
  scanner.next(); // eat WS
  return ({
    type: BKExpressionType.BIND,
    value: createBKExpressionStatement(scanner),
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createPropertyBlock = (scanner: TokenScanner, type: BKExpressionType): BKProperty => {
  const start = scanner.curr();
  scanner.next(); // eat property
  scanner.next(); // eat ws
  const ref = createVarReference(scanner);
  return ({
    type,
    name: ref.name,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
}

const createConditionBlock = (scanner: TokenScanner, type: BKExpressionType): BKIf  => {
  const start = scanner.curr();
  scanner.next(); // eat name
  eatWhitespace(scanner);
  return ({
    type,

    // only support references for now
    condition: scanner.curr().type !== PCTokenType.BRACKET_CLOSE ? createBKExpressionStatement(scanner) : null,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createRepeatBlock = (scanner: TokenScanner): BKRepeat => {
  const start = scanner.curr();
  scanner.next(); // eat repeat
  const each = createBKExpressionStatement(scanner);
  eatWhitespace(scanner);
  scanner.next(); // eat as
  const asValue = createVarReference(scanner);  // eat WS
  let asKey: BKVarReference;
  if (scanner.curr().value === ",") {
    scanner.next(); // eat
    asKey = createVarReference(scanner);
  }

  return ({
    type: BKExpressionType.REPEAT,
    location: getLocation(start, scanner.curr(), scanner.source),
    each,
    asKey,
    asValue
  });
};

const createPropReference = (scanner: TokenScanner): BKVarReference|BKPropertyReference => {
  const start = createVarReference(scanner);
  const path = [start];
  while(!scanner.ended() && scanner.curr().type === PCTokenType.PERIOD) {
    scanner.next(); // eat .
    assertCurrTokenType(scanner, PCTokenType.TEXT);
    path.push(createVarReference(scanner));
  }

  if (path.length === 1) {
    return path[0];
  }

  return ({
    type: BKExpressionType.PROP_REFERENCE,
    path,
    location: getLocation(start.location.start, scanner.curr(), scanner.source)
  });
};

const createVarReference = (scanner: TokenScanner): BKVarReference => {
  eatWhitespace(scanner);
  const start = scanner.curr();
  scanner.next(); // eat name
  return ({
    type: BKExpressionType.VAR_REFERENCE,
    name: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createNotExpression = (scanner: TokenScanner): BKNot => {
  const start = scanner.curr();
  scanner.next();
  return ({
    type: BKExpressionType.NOT,
    value: createBKExpression(scanner),
    location: getLocation(start, scanner.curr(), scanner.source),
  });
}

const createComment = (scanner: TokenScanner): PCComment => {
  const start = scanner.curr();
  scanner.next();
  let curr: Token;
  let value = '';

  return {
    type: PCExpressionType.COMMENT,
    value: start.value.substr(4, start.value.length - 7),
    location: getLocation(start, scanner.curr(), scanner.source)
  };
};

// look for [[
const isBlockStarting = (scanner: TokenScanner) => {
  return scanner.curr().type === PCTokenType.BRACKET_OPEN && scanner.peek(1).type === PCTokenType.BRACKET_OPEN;
};

// look for [[
const isBlockEnding = (scanner: TokenScanner) => {
  return scanner.curr().type === PCTokenType.BRACKET_CLOSE && scanner.peek(1).type === PCTokenType.BRACKET_CLOSE;
};

const createStyleSheet = (scanner: TokenScanner): CSSSheet => {
  const start = scanner.curr();
  const children = [];
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.CLOSE_TAG) {
    children.push(createCSSRule(scanner));
    eatWhitespace(scanner);
  }
  return {
    type: CSSExpressionType.SHEET,
    children,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
};

const createCSSRule = (scanner: TokenScanner) => {
  eatWhitespace(scanner);
  switch(scanner.curr().type) {
    case PCTokenType.AT: return createCSSAtRule(scanner);
    default: return createCSSStyleRuleOrDeclarationProperty(scanner);
  }
};

const createCSSAtRule = (scanner: TokenScanner): CSSAtRule => {
  const start = scanner.curr();
  scanner.next();
  let name: string = "";

  while(scanner.curr().type !== PCTokenType.WHITESPACE && scanner.curr().type !== PCTokenType.CURLY_BRACKET_OPEN) {
    name += scanner.curr().value;
    scanner.next();
  }
  scanner.next(); // eat name
  const params: string[] = [];
  const children: CSSRule[] = [];
  eatWhitespace(scanner);
  while(!scanner.ended()) {
    eatWhitespace(scanner);
    if (scanner.curr().type === PCTokenType.CURLY_BRACKET_OPEN || scanner.curr().type === PCTokenType.SEMICOLON) {
      break;
    }
    if (scanner.curr().type === PCTokenType.SINGLE_QUOTE || scanner.curr().type === PCTokenType.DOUBLE_QUOTE) {
      params.push(createString(scanner).value);
    } else {
      params.push(scanner.curr().value);
      scanner.next();
    }
  }

  const curr = scanner.curr();
  scanner.next(); // eat ; or {

  if (curr.type === PCTokenType.CURLY_BRACKET_OPEN) {
    while(!scanner.ended()) {
      eatWhitespace(scanner);
      if (scanner.curr().type === PCTokenType.CURLY_BRACKET_CLOSE) {
        break;
      }
      children.push(createCSSRule(scanner));
    }

    assertCurrTokenType(scanner, PCTokenType.CURLY_BRACKET_CLOSE);

    scanner.next();
  }

  return {
    type: CSSExpressionType.AT_RULE,
    name,
    params,
    children,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
}


const createCSSStyleRuleOrDeclarationProperty = (scanner: TokenScanner): CSSStyleRule|CSSDeclarationProperty => {
  const start = scanner.curr();
  let selectorText = "";
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type == PCTokenType.CURLY_BRACKET_OPEN || curr.type === PCTokenType.SEMICOLON || curr.type === PCTokenType.CURLY_BRACKET_CLOSE) {
      break;
    }

    // need to check for strings because something such as content: "; "; needs to be possible.
    if (curr.type === PCTokenType.SINGLE_QUOTE || curr.type === PCTokenType.DOUBLE_QUOTE)  {
      selectorText += curr.value + createString(scanner).value + curr.value;
    } else {
      selectorText += curr.value;
      scanner.next();
    }
  }

  // it's a declaration
  if (scanner.curr().type === PCTokenType.SEMICOLON || scanner.curr().type === PCTokenType.CURLY_BRACKET_CLOSE) {

    // something like this also needs to work: 
    const [match, name, value] = selectorText.match(/(.+?):(.+)/);

    if (scanner.curr().type === PCTokenType.SEMICOLON) {
      scanner.next(); // eat ;
    }
    return {
      type: CSSExpressionType.DECLARATION_PROPERTY,
      location: getLocation(start, scanner.curr(), scanner.source),
      name,
      value,
    } as CSSDeclarationProperty;
  }

  assertCurrTokenType(scanner, PCTokenType.CURLY_BRACKET_OPEN);
  scanner.next(); 

  const children: CSSExpression[] = [];
  eatWhitespace(scanner);
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.CURLY_BRACKET_CLOSE) {

    // todo - allow for nesteded
    children.push(createCSSStyleRuleOrDeclarationProperty(scanner) as CSSDeclarationProperty);
    eatWhitespace(scanner);
  }

  assertCurrTokenType(scanner, PCTokenType.CURLY_BRACKET_CLOSE);
  scanner.next();

  selectorText = selectorText.trim();

  return {
    type: CSSExpressionType.STYLE_RULE,
    children,
    selectorText,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
}

const createCloseTag = (scanner: TokenScanner) => {
  const start = scanner.curr();
  scanner.next();
  const name = getTagName(scanner);
  assertCurrTokenType(scanner, PCTokenType.GREATER_THAN);
  scanner.next(); // eat >
  return ({
    type: PCExpressionType.END_TAG,
    name: name,
    location: getLocation(start, scanner.curr(), scanner.source),    
  })
};

const createTag = (scanner: TokenScanner) => {
  const start = scanner.curr();
  assertCurrTokenType(scanner, PCTokenType.LESS_THAN);
  scanner.next(); // eat <
  const tagName = getTagName(scanner);
  const attributes = [];
  const modifiers = [];

  while(!scanner.ended()) {
    eatWhitespace(scanner);
    const curr = scanner.curr();
    if (curr.type === PCTokenType.BACKSLASH || curr.type == PCTokenType.GREATER_THAN) {
      break;
    }
    if (isBlockStarting(scanner)) {
      modifiers.push(createBlock(scanner));
    } else {
      attributes.push(createAttribute(scanner));
    }
  }

  if (scanner.curr().type === PCTokenType.BACKSLASH) {
    scanner.next(); // eat /
    scanner.next(); // eat >
    return ({
      type: PCExpressionType.SELF_CLOSING_ELEMENT,
      name: tagName,
      attributes,
      modifiers,
      location: getLocation(start, scanner.curr(), scanner.source),
    }) as PCSelfClosingElement
  } else {
    scanner.next(); // eat >
    const endStart = scanner.curr();
    const [childNodes, endTag] = getElementChildNodes(tagName, scanner);
    return ({
      type: PCExpressionType.ELEMENT,
      startTag: {
        name: tagName,
        type: PCExpressionType.START_TAG,
        location: getLocation(start, endStart, scanner.source),
        modifiers,
        attributes,
      },
      childNodes,
      location: getLocation(start, scanner.curr(), scanner.source),
      endTag,
    }) as PCElement;
  }
};

const getElementChildNodes = (tagName: string, scanner: TokenScanner): [any[], PCEndTag]  => {
  const childNodes = [];

  // special tags
  if (tagName === "style") {
    const styleSheet = createStyleSheet(scanner);
    eatWhitespace(scanner);
    assertCurrTokenType(scanner, PCTokenType.CLOSE_TAG);
    return [[styleSheet], createCloseTag(scanner)];
  }

  if (tagName === "style" || tagName === "script") {

    let buffer = "";
    const start = scanner.curr();
    while(!scanner.ended()) {
      const token = scanner.curr();
      if (token.type === PCTokenType.CLOSE_TAG) {
        break;
      }
      buffer += scanner.curr().value;
      scanner.next();
    }

    return [
      [
        {
          type: PCExpressionType.TEXT_NODE,
          value: buffer,
          location: getLocation(start, scanner.curr(), scanner.source),
        } as PCTextNode
      ],
      createExpression(scanner) as PCEndTag
    ]
  }

  let endTag: PCExpression;
  while(!scanner.ended()) {
    const child = createExpression(scanner);
    if (child.type === PCExpressionType.END_TAG) {
      endTag = child;
      // TODO - assert name is the same
      break;
    }
    childNodes.push(child);
  }

  return [childNodes, endTag as PCEndTag];
};

const createAttribute = (scanner: TokenScanner): PCAttribute  => {
  const start = scanner.curr();
  const name = getTagName(scanner);
  let value: PCExpression;
  if (scanner.curr().type === PCTokenType.EQUALS) {
    scanner.next(); // eat =
    value = createExpression(scanner);
  }

  return {
    type: PCExpressionType.ATTRIBUTE,
    name: name,
    value,
    location: getLocation(start, scanner.curr(), scanner.source),
  }
};

const createAttributeString = (scanner: TokenScanner): PCString|PCStringBlock => {
  const start = scanner.curr();
  const values: Array<PCString|PCBlock> = [];
  let buffer = "";
  let hasBlocks = false;
  scanner.next(); // eat "

  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type === start.type) {
      break;
    }
    if (isBlockStarting(scanner)) {
      hasBlocks = true;
      values.push(createBlock(scanner));
    } else {
      scanner.next();
      values.push(({
        type: PCExpressionType.STRING,
        value: curr.value,
        location: getLocation(curr.pos, scanner.curr(), scanner.source)
      }));
    }
  }

  scanner.next(); // eat '
  const location = getLocation(start, scanner.curr(), scanner.source);
  
  if (hasBlocks) {
    return ({
      type: PCExpressionType.STRING_BLOCK,
      location,
      values,
    }) as PCStringBlock;
  } else {
    return ({
      type: PCExpressionType.STRING,
      location,
      value: values.map(({value}) => value).join("")
    });
  }
}

const createTextNode = (scanner: TokenScanner): PCTextNode => {
  const start = scanner.curr();
  scanner.next(); // char
  let value = start.value;
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type === PCTokenType.COMMENT || curr.type === PCTokenType.LESS_THAN || curr.type == PCTokenType.CLOSE_TAG || isBlockStarting(scanner)) {
      break;
    }
    scanner.next();
    value += curr.value;
  }

  return ({
    type: PCExpressionType.TEXT_NODE,
    value,
    location: getLocation(start, scanner.curr(), scanner.source),
  });
};

const eatWhitespace = (scanner: TokenScanner) => {
  while(scanner.curr().type === PCTokenType.WHITESPACE) {
    scanner.next();
  }
};

const getTagName = (scanner: TokenScanner) => {
  let name = "";

  while(scanner.curr().type !== PCTokenType.WHITESPACE && scanner.curr().type !== PCTokenType.GREATER_THAN && scanner.curr().type !== PCTokenType.EQUALS) {
    name += scanner.curr().value;
    scanner.next();
  }
  return name;
};

export const throwUnexpectedToken = (source: string, token: Token) => {
  if (!token) {
    throw new Error(`Unexpected end of file (missing closing expression).`);
  }

  const location = getPosition(token, source);
  throw new Error(`Unexpected token "${token.value}" at ${location.line}:${location.column}`);
};

export const assertCurrTokenType = (scanner: TokenScanner, type: number) => {
  const token = scanner.curr();
  if (!token || token.type !== type) {
    throwUnexpectedToken(scanner.source, scanner.curr());
  }
};

export const assertCurrTokenExists = (scanner: TokenScanner) => {
  if (!scanner.curr()) {
    throwUnexpectedToken(scanner.source, scanner.curr());
  }
}