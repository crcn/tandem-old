import { PCExpression, PCTextNode, PCExpressionType, PCElement, PCSelfClosingElement, PCStartTag, PCAttribute, Token, PCEndTag, PCComment, PCString, PCStringBlock, PCBlock, BKBind, BKExpressionType, BKReference } from "./ast";
import { getLocation } from "./ast-utils";
import { TokenScanner } from "./scanners";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";

const _memos: any = {};

export const parsePaperclipSource = (source: string) => {

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
    case PCTokenType.TEXT: return createTextNode(scanner);
    case PCTokenType.SINGLE_QUOTE: return createString(scanner);
    case PCTokenType.DOUBLE_QUOTE: return createString(scanner);
    case PCTokenType.LESS_THAN: return createTag(scanner);
    case PCTokenType.CLOSE_TAG: return createCloseTag(scanner);
    case PCTokenType.COMMENT_START: return createComment(scanner);
    default: {
      if (isBlockStarting(scanner)) {
        return createBlock(scanner);
      }
      throw new Error(`Unexpected token ${scanner.curr().value}`);
    }
  }
}

const createBlock = (scanner: TokenScanner): PCBlock => {
  const start = scanner.curr();
  scanner.next(); // eat [
  scanner.next(); // eat [
  const value = createBlockExpression(scanner);
  scanner.next(); // eat ]
  scanner.next(); // eat ]

  return ({
    type: PCExpressionType.BLOCK,
    location: getLocation(start, scanner.curr(), scanner.source),
    value,
  })
}

const createBlockExpression = (scanner: TokenScanner) => {
  switch(scanner.curr().value) {
    case "bind": return createBindBlock(scanner);
    default: {
      throw new Error(`Unknown block type ${scanner.curr().value}`);
    }
  }
};

const createBindBlock = (scanner: TokenScanner): BKBind => {
  const start = scanner.curr();
  scanner.next(); // eat bind
  scanner.next(); // eat WS
  return ({
    type: BKExpressionType.ECHO,
    value: createReference(scanner),
    location: getLocation(start, scanner.curr(), scanner.source)
  })
};

const createReference = (scanner: TokenScanner): BKReference => {
  const start = scanner.curr();
  scanner.next(); // eat bind
  return ({
    type: BKExpressionType.REFERENCE,
    value: start.value,
    location: getLocation(start, scanner.curr(), scanner.source)
  });
};

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
  const nameToken = scanner.next();
  const attributes = createAttributes(scanner);

  if (scanner.curr().type === PCTokenType.BACKSLASH) {
    scanner.next(); // eat /
    scanner.next(); // eat >
    return ({
      type: PCExpressionType.SELF_CLOSING_ELEMENT,
      name: nameToken.value,
      attributes,
      location: getLocation(start, scanner.curr(), scanner.source),
    }) as PCSelfClosingElement
  } else {
    scanner.next(); // eat >
    const endStart = scanner.curr();
    const [childNodes, endTag] = getElementChildNodes(nameToken.value, scanner);
    return ({
      type: PCExpressionType.ELEMENT,
      startTag: {
        name: nameToken.value,
        type: PCExpressionType.START_TAG,
        location: getLocation(start, endStart, scanner.source),
        attributes,
      },
      childNodes,
      location: getLocation(start, scanner.curr(), scanner.source),
      endTag,
    }) as PCElement;
  }
};

const createAttributes = (scanner: TokenScanner): PCAttribute[] => {
  const attributes = [];
  while(!scanner.ended()) {
    eatWhitespace(scanner);
    const curr = scanner.curr();
    if (curr.type === PCTokenType.BACKSLASH || curr.type == PCTokenType.GREATER_THAN) {
      break;
    }
    attributes.push(createAttribute(scanner));
  }
  return attributes;
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
  const name = scanner.curr();
  let value: PCExpression;
  scanner.next(); // eat name
  if (scanner.curr().type === PCTokenType.EQUALS) {
    scanner.next(); // eat =
    value = createExpression(scanner);
  }

  return {
    type: PCExpressionType.ATTRIBUTE,
    name: name.value,
    value,
    location: getLocation(name, scanner.curr(), scanner.source),
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
    if (curr.type === PCTokenType.LESS_THAN || curr.type == PCTokenType.CLOSE_TAG) {
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