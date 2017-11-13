import { PCExpression, PCTextNode, PCExpressionType, PCElement, PCSelfClosingElement, PCStartTag, PCAttribute, Token, PCEndTag, PCComment, PCString, PCStringBlock, PCBlock, BKBind, BKReservedKeyword, BKExpressionType, BKReference, BKRepeat, BKIf, BKNot, BKOperation, BKExpression, BKGroup } from "./ast";
import { getLocation } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";

const _memos: any = {};

export const parseModule = (source: string) => {

  // should be fine since returned value is immutable
  if (_memos[source]) return _memos[source];

  const tokenScanner = tokenizePaperclipSource(source);

  return creatreFragment(tokenScanner);
}

const creatreFragment = (scanner: TokenScanner) => {
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
    case PCTokenType.SINGLE_QUOTE: return createString(scanner);
    case PCTokenType.DOUBLE_QUOTE: return createString(scanner);
    case PCTokenType.LESS_THAN: return createTag(scanner);
    case PCTokenType.CLOSE_TAG: return createCloseTag(scanner);
    case PCTokenType.COMMENT_START: return createComment(scanner);
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
  scanner.next(); // eat ]
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
    default: {
      throw new Error(`Unknown block type ${scanner.curr().value}`);
    }
  }
};

const createBKExpressionStatement = (scanner: TokenScanner) => createBKOperation(scanner);

const createBKOperation = (scanner: TokenScanner): BKExpression => {
  const lhs = createBKExpression(scanner);
  eatWhitespace(scanner);
  const operator = scanner.curr();
  const otype = operator.type;

  const isOperator = otype === PCTokenType.AND || otype === PCTokenType.OR || otype == PCTokenType.PLUS || otype === PCTokenType.MINUS || otype === PCTokenType.STAR || otype === PCTokenType.BACKSLASH || otype === PCTokenType.DOUBLE_EQUALS || otype === PCTokenType.TRIPPLE_EQUELS || otype === PCTokenType.GREATER_THAN || otype === PCTokenType.LESS_THAN || otype === PCTokenType.LESS_THAN_OR_EQUAL || otype === PCTokenType.GREATER_THAN_OR_EQUAL;

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
  switch(scanner.curr().type) {
    case PCTokenType.BANG: return createNotExpression(scanner);
    case PCTokenType.PAREN_OPEN: return createGroup(scanner);
    case PCTokenType.TEXT: return createReference(scanner);
    case PCTokenType.RESERVED_KEYWORD: return createReservedKeyword(scanner);
    default: {
      throw new Error(`Unknown block type ${scanner.curr().value}`);
    }
  }
};

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
    type: BKExpressionType.ECHO,
    value: createBKExpressionStatement(scanner),
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createConditionBlock = (scanner: TokenScanner, type: BKExpressionType): BKIf => {
  const start = scanner.curr();
  scanner.next(); // eat name
  scanner.next(); // eat ws
  return ({
    type,

    // only support references for now
    condition: createBKExpressionStatement(scanner),
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createRepeatBlock = (scanner: TokenScanner): BKRepeat => {
  const start = scanner.curr();
  scanner.next(); // eat repeat
  const each = createReference(scanner);
  scanner.next(); // eat as
  const asValue = createReference(scanner);  // eat WS
  let asKey: BKReference;
  if (scanner.curr().value === ",") {
    scanner.next(); // eat
    asKey = createReference(scanner);
  }

  return ({
    type: BKExpressionType.REPEAT,
    location: getLocation(start, scanner.curr(), scanner.source),
    each,
    asKey,
    asValue
  })
};

const createAnd = (scanner: TokenScanner): BKReference => {
  eatWhitespace(scanner);
  const start = scanner.curr();
  scanner.next(); // ref
  eatWhitespace(scanner);
  return ({
    type: BKExpressionType.REFERENCE,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

const createReference = (scanner: TokenScanner): BKReference => {
  eatWhitespace(scanner);
  const start = scanner.curr();
  scanner.next(); // ref
  eatWhitespace(scanner);
  return ({
    type: BKExpressionType.REFERENCE,
    value: start.value,
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
  let curr: Token;
  let value = '';
  scanner.next(); // eat <!-- 
  while(!scanner.ended()) {
    curr = scanner.curr();
    scanner.next(); // eat -->
    if (curr.type === PCTokenType.COMMENT_END) {
      break;
    }
    value += curr.value;
  }

  return {
    type: PCExpressionType.COMMENT,
    value: value,
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

const createCloseTag = (scanner: TokenScanner) => {
  const start = scanner.curr();
  const nameToken = scanner.next();
  scanner.next(); // eat name
  scanner.next(); // eat >
  return ({
    type: PCExpressionType.END_TAG,
    name: nameToken.value,
    location: getLocation(start, scanner.curr(), scanner.source),    
  })
};

const createTag = (scanner: TokenScanner) => {
  const start = scanner.curr();
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

const createString = (scanner: TokenScanner): PCString|PCStringBlock => {
  const start = scanner.curr();
  const values: Array<PCString|PCBlock> = [];
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
    if (curr.type === PCTokenType.LESS_THAN || curr.type == PCTokenType.CLOSE_TAG || isBlockStarting(scanner)) {
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
