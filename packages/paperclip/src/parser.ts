// Note that JS, and styles are parsed so that we can do analysis on the
// AST and provide warnings, hints, and errors.

/*

TODOS:
- [ ] Strong types
*/

import { PCExpression, PCTextNode, PCExpressionType, PCElement, PCSelfClosingElement, PCStartTag, PCAttribute, Token, PCEndTag, PCComment, PCString, PCStringBlock, PCBlock, BKBind, BKReservedKeyword, BKExpressionType, BKPropertyReference, BKRepeat, BKIf, BKNot, BKOperation, BKExpression, BKGroup, BKObject, BKProperty, BKNumber, BKKeyValuePair, BKArray, BKString, BKVarReference, CSSExpression, CSSExpressionType, CSSStyleRule, CSSRule, CSSGroupingRule, CSSAtRule, CSSDeclarationProperty, CSSSheet, ExpressionLocation } from "./ast";
import { ParseResult, ParseContext, DiagnosticType } from "./parser-utils";
import { getLocation, getPosition, getTokenLocation } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";

const _memos: any = {};

export const parseModuleSource = (source: string, filePath?: string): ParseResult => {
  if (_memos[source]) return _memos[source]; // result should be immutable, so this is okay 

  const context = {
    source,
    filePath,
    scanner: tokenizePaperclipSource(source),
    diagnostics: []
  };

  const root = createFragment(context);
  return _memos[source] = {
    root,
    diagnostics: context.diagnostics
  };
};

export const parseStyleSource = (source: string, filePath?: string): ParseResult => {
  if (_memos[source]) return _memos[source];
  const context = {
    source,
    scanner:  tokenizePaperclipSource(source),
    filePath,
    diagnostics: []
  };
  const root = createStyleSheet(context);
  return _memos[source] = {
    root,
    diagnostics: context.diagnostics
  };
};

const createFragment = (context: ParseContext) => {
  const {scanner} = context;

  const childNodes = [];

  while(!scanner.ended()) {
    const child = createNodeExpression(context);
    if (!child) {
      return null;
    }
    childNodes.push(child);
  }
  
  return childNodes.length === 1 ? childNodes[0] : ({
    type: PCExpressionType.FRAGMENT,
    location: getLocation(0, scanner.source.length, scanner.source),
    childNodes,
  })
}

// const createExpression = (context: ParseContext) => {
//   if (!testCurrTokenExists(context)) {
//     return null;
//   }
//   const {scanner} = context;
//   switch(scanner.curr().type) {
//     case PCTokenType.WHITESPACE: return createTextNode(context);
//     case PCTokenType.SINGLE_QUOTE: 
//     case PCTokenType.DOUBLE_QUOTE: return createAttributeString(context);
//     case PCTokenType.LESS_THAN: return createTag(context);
//     case PCTokenType.CLOSE_TAG: return createCloseTag(context);
//     case PCTokenType.COMMENT: return createComment(context);
//     default: {
//       if (isBlockStarting(scanner)) {
//         return createBlock(context);
//       }
//       return createTextNode(context);
//     }
//   }
// };

const createNodeExpression = (context: ParseContext) => {
  if (!testCurrTokenExists(context)) {
    return null;
  }
  const {scanner} = context;
  switch(scanner.curr().type) {
    case PCTokenType.WHITESPACE: return createTextNode(context);
    case PCTokenType.LESS_THAN: return createTag(context);
    case PCTokenType.CLOSE_TAG: return createCloseTag(context);
    case PCTokenType.COMMENT: return createComment(context);
    default: {
      if (isBlockStarting(scanner)) {
        return createBlock(context, createTextBlockStatement);
      }
      return createTextNode(context);
    }
  }
};

const createBlock = (context: ParseContext, createStatement: (context: ParseContext) => BKExpression): PCBlock => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat [
  scanner.next(); // eat [
  eatWhitespace(context);
  const value = createStatement(context);

  if (!value) {
    return null;
  }

  eatWhitespace(context);

  if (!testCurrTokenType(context, [PCTokenType.BRACKET_CLOSE], null,getLocation(start, scanner.curr(), context.source))) {
    return null;
  }

  scanner.next(); // eat ]

  if (!testCurrTokenType(context, [PCTokenType.BRACKET_CLOSE], "Missing closing ] character.", getTokenLocation(start, context.source))) {
    return null;
  }
  scanner.next(); // eat ]

  return ({
    type: PCExpressionType.BLOCK,
    location: getLocation(start, scanner.curr(), scanner.source),
    value,
  })
}

const createElementBlockStatement = (context: ParseContext) => {
  const {scanner} = context;
  switch(scanner.curr().value) {
    case "bind": return createBindBlock(context);
    case "repeat": return createRepeatBlock(context);
    case "if": return createConditionBlock(context, BKExpressionType.IF);
    case "elseif": return createConditionBlock(context, BKExpressionType.ELSEIF);
    case "else": return createConditionBlock(context, BKExpressionType.ELSE);
    case "property": return createPropertyBlock(context, BKExpressionType.PROPERTY);
    default: {
      addUnexpectedToken(context, `Unexpected block type ${scanner.curr().value}.`);
      return null;
    }
  }
};

const createTextBlockStatement = (context: ParseContext) => {
  const {scanner} = context;
  switch(scanner.curr().value) {
    case "bind": return createBindBlock(context);
    
    case "elseif":
    case "else":
    case "if": {
      addUnexpectedToken(context, `Condition blocks can only be added to elements, for example: <div [[if condition]]></div>.`);
      return null;
    }

    case "repeat": {
      addUnexpectedToken(context, `Repeat blocks can only be added to elements, for example: <div [[repeat items in item, i]]></div>.`);
      return null;
    }
    default: {
      addUnexpectedToken(context, `Unexpected block type ${scanner.curr().value}.`);
      return null;
    }
  }
};

const createTextAttributeBlockStatement = (context: ParseContext) => {
  const {scanner} = context;
  switch(scanner.curr().value) {
    case "bind": return createBindBlock(context);
    case "elseif":
    case "else":
    case "if": {
      addUnexpectedToken(context, `Condition blocks cannot be assigned to attributes.`);
      return null;
    }

    case "repeat": {
      addUnexpectedToken(context, `Repeat blocks cannot be assigned to attributes.`);
      return null;
    }
    default: {
      addUnexpectedToken(context, `Unexpected block type ${scanner.curr().value}.`);
      return null;
    }
  }
}

const createBKExpressionStatement = (context: ParseContext) => createBKOperation(context);

const createBKOperation = (context: ParseContext): BKExpression => {
  if (!testCurrTokenExists(context)) {
    return null;
  }

  const {scanner} = context;
  const lhs = createBKExpression(context);
  eatWhitespace(context);

  const operator = scanner.curr();
  const otype = operator ? operator.type : -1;

  const isOperator = otype === PCTokenType.AND || otype === PCTokenType.OR || otype == PCTokenType.PLUS || otype === PCTokenType.MINUS || otype === PCTokenType.STAR || otype === PCTokenType.BACKSLASH || otype === PCTokenType.DOUBLE_EQUALS || otype === PCTokenType.TRIPPLE_EQUELS || otype === PCTokenType.GREATER_THAN || otype === PCTokenType.LESS_THAN || otype === PCTokenType.LESS_THAN_OR_EQUAL || otype === PCTokenType.GREATER_THAN_OR_EQUAL || otype === PCTokenType.NOT_EQUALS || otype === PCTokenType.NOT_DOUBLE_EQUALS;

  if (!isOperator) {
    return lhs;
  }

  scanner.next(); // eat operator
  eatWhitespace(context);

  const rhs = createBKOperation(context);

  if (!rhs) {
    return null;
  }
  
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

const createBKExpression = (context: ParseContext) => {
  const {scanner} = context;
  eatWhitespace(context);
  switch(scanner.curr().type) {
    case PCTokenType.BANG: return createNotExpression(context);
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: return createString(context);
    case PCTokenType.NUMBER: return createNumber(context);
    case PCTokenType.CURLY_BRACKET_OPEN: return createObject(context);
    case PCTokenType.BRACKET_OPEN: return createArray(context);
    case PCTokenType.PAREN_OPEN: return createGroup(context);
    case PCTokenType.TEXT: return createPropReference(context);
    case PCTokenType.RESERVED_KEYWORD: return createReservedKeyword(context);
    default: {
      addUnexpectedToken(context);
      return null;
    }
  }
};

export const createString = (context: ParseContext): BKString => {
  const {scanner} = context;
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

  if (!testClosingToken(context, start)) {
    return null;
  }

  scanner.next(); // eat quote


  return {
    type: BKExpressionType.STRING,
    location: getLocation(start, scanner.curr(), scanner.source),
    value,
  };
};

const createNumber = (context: ParseContext): BKNumber => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next();
  return ({
    type: BKExpressionType.NUMBER,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createObject = (context: ParseContext): BKObject => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat {

  const properties: BKKeyValuePair[] = [];

  while(!scanner.ended()) {
    eatWhitespace(context);
    if (scanner.curr().type === PCTokenType.CURLY_BRACKET_CLOSE) {
      break;
    }
    
    const pair = createKeyValuePair(context);
    if (!pair) {
      return null;
    }
    properties.push(pair);
    eatWhitespace(context);

    const curr = scanner.curr();

    // will break in next loop
    if (curr.type === PCTokenType.CURLY_BRACKET_CLOSE) {
      continue;
    }

    if (curr.type !== PCTokenType.COMMA && curr) {
      addUnexpectedToken(context);
      return null;
    }

    scanner.next(); 
  }


  scanner.next(); // eat }. Assertion happens in while loop

  return {
    type: BKExpressionType.OBJECT,
    location: getLocation(start, scanner.curr(), scanner.source),
    properties,
  };
};

const createArray = (context: ParseContext): BKArray => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); 
  eatWhitespace(context);
  const values: BKExpression[] = [];
  const curr = scanner.curr();
  if (curr.type !== PCTokenType.BRACKET_CLOSE) {
    while(1) {
      values.push(createBKExpression(context));
      eatWhitespace(context);
      const curr = scanner.curr();
      if (curr.type === PCTokenType.BRACKET_CLOSE) {
        break;
      }
      
      if (!testCurrTokenType(context, [PCTokenType.COMMA], "Missing , delimiter in array.", getLocation(start, scanner.curr(), context.source))) {
        return null;
      }

      scanner.next();
    }
  }


  scanner.next();

  return {
    type: BKExpressionType.ARRAY,
    location: getLocation(start, scanner.curr(), scanner.source),
    values,
  }
}

const createKeyValuePair = (context: ParseContext): BKKeyValuePair => {
  const {scanner} = context;
  let key;
  switch(scanner.curr().type) {
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: {
      key = createString(context);
      break;
    }
    default: {
      key = createVarReference(context);
    }
  }
  eatWhitespace(context);
  if (!testCurrTokenType(context, [PCTokenType.COLON], "Missing : for object.")) {
    return null;
  }
  scanner.next(); // eat :
  eatWhitespace(context);
  const value = createBKExpressionStatement(context);

  return {
    type: BKExpressionType.KEY_VALUE_PAIR,
    location: getLocation(key.location.start, value.location.end, scanner.source),
    key: key.name,
    value,
  }
}

const createGroup = (context: ParseContext): BKGroup => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat )
  const value = createBKExpressionStatement(context);
  scanner.next(); // eat )
  return {
    type: BKExpressionType.GROUP,
    value,
    location: getLocation(start, scanner.curr(), scanner.source),
  }
}

const createReservedKeyword = (context: ParseContext): BKReservedKeyword => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next();
  return {
    type: BKExpressionType.RESERVED_KEYWORD,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source),
  };
};

const createBindBlock = (context: ParseContext): BKBind => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat bind
  // if (!testCurrTokenType(context, [PCTokenType.WHITESPACE], `Missing whitespace after bind keyword.`, getTokenLocation(start, context.source))) {
  //   return null;
  // }
  scanner.next(); // eat WS
  const value = createBKExpressionStatement(context);
  if (!value) {
    return null;
  }
  return ({
    type: BKExpressionType.BIND,
    value,
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createPropertyBlock = (context: ParseContext, type: BKExpressionType): BKProperty => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat property
  scanner.next(); // eat ws
  const ref = createVarReference(context);
  return ({
    type,
    name: ref.name,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
}

const createConditionBlock = (context: ParseContext, type: BKExpressionType): BKIf  => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat name
  eatWhitespace(context);
  return ({
    type,

    // only support references for now
    condition: scanner.curr().type !== PCTokenType.BRACKET_CLOSE ? createBKExpressionStatement(context) : null,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createRepeatBlock = (context: ParseContext): BKRepeat => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat repeat

  eatWhitespace(context);

  if (!testCurrTokenType(context, [PCTokenType.TEXT], "Repeat block missing collection parameter.", getTokenLocation(start, context.source))) {
    return null;
  }

  const each = createBKExpressionStatement(context);

  eatWhitespace(context);

  if (!testCurrTokenType(context, [PCTokenType.TEXT], null, getLocation(start, scanner.curr(), context.source))) {
    return null;
  }

  if (scanner.curr().value !== "as") {
    addUnexpectedToken(context, `Repeat block missing "as" keyword.`, getLocation(start, scanner.curr(), context.source));
    return null;
  }

  scanner.next(); // eat as

  eatWhitespace(context);

  if (!testCurrTokenType(context, [PCTokenType.TEXT], null, getLocation(start, scanner.curr(), context.source))) {
    return null;
  }

  const asValue = createVarReference(context);  // eat WS
  let asKey: BKVarReference;
  eatWhitespace(context);
  if (scanner.curr().value === ",") {
    scanner.next(); // eat
    eatWhitespace(context);
    if (!testCurrTokenType(context, [PCTokenType.TEXT], "Unexpected token. Repeat index parameter should only contain characters a-zA-Z.", getLocation(start, scanner.curr(), context.source))) {
      return null;
    }

    asKey = createVarReference(context);
  }

  return ({
    type: BKExpressionType.REPEAT,
    location: getLocation(start, scanner.curr(), scanner.source),
    each,
    asKey,
    asValue
  });
};

const createPropReference = (context: ParseContext): BKVarReference|BKPropertyReference => {
  const {scanner} = context;
  const start = createVarReference(context);
  const path = [start];
  while(!scanner.ended() && scanner.curr().type === PCTokenType.PERIOD) {
    scanner.next(); // eat .
    if (!testCurrTokenType(context, [PCTokenType.TEXT])) {
      return null;
    }
    path.push(createVarReference(context));
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

const createVarReference = (context: ParseContext): BKVarReference => {
  const {scanner} = context;
  eatWhitespace(context);
  const start = scanner.curr();
  scanner.next(); // eat name
  return ({
    type: BKExpressionType.VAR_REFERENCE,
    name: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createNotExpression = (context: ParseContext): BKNot => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next();
  return ({
    type: BKExpressionType.NOT,
    value: createBKExpression(context),
    location: getLocation(start, scanner.curr(), scanner.source),
  });
}

const createComment = (context: ParseContext): PCComment => {
  const {scanner} = context;
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

const createStyleSheet = (context: ParseContext): CSSSheet => {
  const {scanner} = context;
  const start = scanner.curr();
  const children = [];
  while(1) {
    eatWhitespace(context);
    if (scanner.ended() || scanner.curr().type === PCTokenType.CLOSE_TAG) {
      break;
    }
    const child = createCSSRule(context);
    if (!child) {
      return null;
    }
    children.push(child);    
  }
  // while(!scanner.ended() && scanner.curr().type !== PCTokenType.CLOSE_TAG) {
  //   eatWhitespace(scanner);
  // }
  return {
    type: CSSExpressionType.SHEET,
    children,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
};

const createCSSRule = (context: ParseContext) => {
  const {scanner} = context;
  switch(scanner.curr().type) {
    case PCTokenType.AT: return createCSSAtRule(context);
    default: return createCSSStyleRuleOrDeclarationProperty(context);
  }
};

const createCSSAtRule = (context: ParseContext): CSSAtRule => {
  const {scanner} = context;
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
  eatWhitespace(context);
  while(!scanner.ended()) {
    eatWhitespace(context);
    if (scanner.curr().type === PCTokenType.CURLY_BRACKET_OPEN || scanner.curr().type === PCTokenType.SEMICOLON) {
      break;
    }
    if (scanner.curr().type === PCTokenType.SINGLE_QUOTE || scanner.curr().type === PCTokenType.DOUBLE_QUOTE) {
      params.push(createString(context).value);
    } else {
      params.push(scanner.curr().value);
      scanner.next();
    }
  }

  const curr = scanner.curr();
  scanner.next(); // eat ; or {

  if (curr.type === PCTokenType.CURLY_BRACKET_OPEN) {
    while(!scanner.ended()) {
      eatWhitespace(context);
      if (scanner.curr().type === PCTokenType.CURLY_BRACKET_CLOSE) {
        break;
      }
      const child = createCSSRule(context);
      if (!child) {
        return null;
      }
      children.push(child);
    }

    if (!testCurrTokenType(context, [PCTokenType.CURLY_BRACKET_CLOSE], "Missing closing } character.", getTokenLocation(start, context.source))) {
      return null;
    }

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


const createCSSStyleRuleOrDeclarationProperty = (context: ParseContext): CSSStyleRule|CSSDeclarationProperty => {
  const {scanner} = context;
  const start = scanner.curr();
  let selectorText = "";
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type == PCTokenType.CURLY_BRACKET_OPEN || curr.type === PCTokenType.SEMICOLON || curr.type === PCTokenType.CURLY_BRACKET_CLOSE || curr.type === PCTokenType.CLOSE_TAG) {
      break;
    }

    // need to check for strings because something such as content: "; "; needs to be possible.
    if (curr.type === PCTokenType.SINGLE_QUOTE || curr.type === PCTokenType.DOUBLE_QUOTE)  {
      selectorText += curr.value + createString(context).value + curr.value;
    } else {
      selectorText += curr.value;
      scanner.next();
    }
  }

  if (!testCurrTokenType(context, [PCTokenType.SEMICOLON, PCTokenType.CURLY_BRACKET_OPEN, PCTokenType.CURLY_BRACKET_CLOSE])) {
    return null;
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

  scanner.next(); // eat {

  const children: CSSExpression[] = [];
  eatWhitespace(context);
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.CURLY_BRACKET_CLOSE) {

    const child = createCSSStyleRuleOrDeclarationProperty(context) as CSSDeclarationProperty;

    if (!child) {
      return null;
    }

    // todo - allow for nesteded
    children.push(child);
    eatWhitespace(context);
  }

  if (!testCurrTokenType(context, [PCTokenType.CURLY_BRACKET_CLOSE], "Missing closing } character.", getTokenLocation(start,context.source))) {
    return null;
  }

  scanner.next();

  selectorText = selectorText.trim();

  return {
    type: CSSExpressionType.STYLE_RULE,
    children,
    selectorText,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
}

const createCloseTag = (context: ParseContext) => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next();
  const name = getTagName(context);
  if (!name) {
    addUnexpectedToken(context, "Missing close tag name.", getTokenLocation(start, context.source));
    return null;
  }
  if (!testCurrTokenType(context, [PCTokenType.GREATER_THAN], `Missing > character.`, getLocation(start, scanner.curr(), context.source))) {
    return null;
  }

  scanner.next(); // eat >
  return ({
    type: PCExpressionType.END_TAG,
    name: name,
    location: getLocation(start, scanner.curr(), scanner.source),    
  })
};

const createTag = (context: ParseContext) => {
  const {scanner} = context;
  const start = scanner.curr();
  scanner.next(); // eat <
  const tagName = getTagName(context);

  if (!tagName) {
    addUnexpectedToken(context, "Missing open tag name.", getTokenLocation(start, context.source));
    return null;
  }
  
  if (!scanner.ended() && !testCurrTokenType(context, [PCTokenType.WHITESPACE, PCTokenType.GREATER_THAN], `Tag name contains a character where " " or > is expected.`, getTokenLocation(start, context.source))) {
    return null;
  }

  const attributes = [];
  const modifiers = [];

  while(!scanner.ended()) {
    eatWhitespace(context);
    const curr = scanner.curr();
    if (curr.type === PCTokenType.BACKSLASH || curr.type == PCTokenType.GREATER_THAN) {
      break;
    }
    if (isBlockStarting(scanner)) {
      const block = createBlock(context, createElementBlockStatement);
      if (!block) {
        return null;
      }
      modifiers.push(block);
    } else if (curr.type === PCTokenType.TEXT) {
      const attr = createAttribute(context);
      if (!attr) {
        return null;
      }
      attributes.push(attr);
    } else {
      addUnexpectedToken(context);
      return null;
    }
  }

  if (!testCurrTokenExists(context)) {
    return null;
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
    const info = getElementChildNodes(tagName, context);

    // err break
    if (!info) {
      return null;
    }
    const [childNodes, endTag] = info;

    if (!endTag) {
      addUnexpectedToken(context, `Close tag is missing.`, getLocation(start, endStart, context.source));
      return null;
    }
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

const getElementChildNodes = (tagName: string, context: ParseContext): [any[], PCEndTag]  => {
  const {scanner} = context;
  const childNodes = [];

  // special tags
  if (tagName === "style") {
    const styleSheet = createStyleSheet(context);
    if (!styleSheet) {
      return null;
    }
    eatWhitespace(context);

    if (!testCurrTokenType(context, [PCTokenType.CLOSE_TAG])) {
      return null;
    }
    const endTag = createCloseTag(context);
    if (!endTag) {
      return null;
    }

    return [[styleSheet], endTag];
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
      createNodeExpression(context) as PCEndTag
    ]
  }

  let endTag: PCExpression;
  while(!scanner.ended()) {
    const child = createNodeExpression(context);

    // error.
    if (!child) {
      return null;
    }
    if (child.type === PCExpressionType.END_TAG) {
      endTag = child;
      // TODO - assert name is the same
      break;
    }
    childNodes.push(child);
  }

  return [childNodes, endTag as PCEndTag];
};

const createAttribute = (context: ParseContext): PCAttribute  => {
  const {scanner} = context;
  const start = scanner.curr();
  const name = getTagName(context);
  let value: PCExpression;
  if (scanner.curr().type === PCTokenType.EQUALS) {
    scanner.next(); // eat =
    value = createAttributeExpression(context);
    if (!value) {
      return null;
    }
  }

  return {
    type: PCExpressionType.ATTRIBUTE,
    name: name,
    value,
    location: getLocation(start, scanner.curr(), scanner.source),
  }
};
const createAttributeExpression = (context: ParseContext) => {
  if (!testCurrTokenExists(context)) {
    return null;
  }
  const {scanner} = context;
  switch(scanner.curr().type) {
    case PCTokenType.SINGLE_QUOTE: 
    case PCTokenType.DOUBLE_QUOTE: return createAttributeString(context);
    default: {
      if (isBlockStarting(scanner)) {
        return createBlock(context, createTextAttributeBlockStatement);
      }
      addUnexpectedToken(context);
      return null;
    }
  }
};

const testClosingToken = (context: ParseContext, start: Token) => testCurrTokenType(context, [start.type], `Missing closing ${start.value} character.`, getTokenLocation(start, context.source));

const createAttributeString = (context: ParseContext): PCString|PCStringBlock => {
  const {scanner} = context;
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
      const block = createBlock(context, createTextAttributeBlockStatement);
      if (!block) {
        return null;
      }
      values.push(block);
    } else {
      scanner.next();
      values.push(({
        type: PCExpressionType.STRING,
        value: curr.value,
        location: getLocation(curr.pos, scanner.curr(), scanner.source)
      }));
    }
  }

  if (!testClosingToken(context, start)) {
    return null;
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

const createTextNode = (context: ParseContext): PCTextNode => {
  const {scanner} = context;
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

export const eatWhitespace = (context: ParseContext) => {
  const {scanner} = context;
  while(!scanner.ended() && scanner.curr().type === PCTokenType.WHITESPACE) {
    scanner.next();
  }
};

const getTagName = (context: ParseContext) => {
  const {scanner} = context;
  let name = "";

  while(!scanner.ended() && /[a-zA-Z-][a-zA-Z0-9-]*/.test(scanner.curr().value)) {
    name += scanner.curr().value;
    scanner.next();
  }

  if (!name) {
    return null;
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

export const addUnexpectedToken = (context: ParseContext, message?: string, refLocation?: ExpressionLocation) => {
  const token =  context.scanner.curr();
  const location = refLocation || {
    start: getPosition(token || context.scanner.source.length - 1, context.scanner.source),
    end: getPosition(token ? token.pos + token.value.length : context.scanner.source.length, context.scanner.source)
  };
  context.diagnostics.push({
    type: DiagnosticType.ERROR,
    location,
    message: message || (token ? `Unexpected token.` : `Unexpected end of file.`),
    source: context.source,
    filePath: context.filePath,
  });
  return true;
};

export const testCurrTokenExists = (context: ParseContext, message?: string, refLocation?: ExpressionLocation) => {
  const token = context.scanner.curr();
  if (!token) {
    addUnexpectedToken(context, message, refLocation);
    return false;
  }
  return true;
};

export const testCurrTokenType = (context: ParseContext, types: number[], message?: string, refLocation?: ExpressionLocation) => {
  const token = context.scanner.curr();
  if (!token || types.indexOf(token.type) === -1) {
    addUnexpectedToken(context, message, refLocation);
    return false;
  }
  return true;
};