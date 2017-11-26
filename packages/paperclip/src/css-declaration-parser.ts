import { DcMeasurement, DcExpressionType, PCExpressionType, DcCall, DcColor, DcExpression, DcKeyword, DcList, Token, BKExpressionType, BKString } from "./ast";
import { createString, assertCurrTokenType, eatWhitespace, throwUnexpectedToken } from "./parser";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";
import { TokenScanner } from "./scanners";
import { getLocation } from "./ast-utils";

const _memos = {};

export const parseDeclaration = (source: string) => {
  if (_memos[source]) {
    return _memos[source];
  }

  return _memos[source] = createList(tokenizePaperclipSource(source));
}

const createList = (scanner: TokenScanner) => {
  const start = scanner.curr();
  let items = [];
  let delim: Token;
  while(!scanner.ended()) {
    items.push(createExpression(scanner));
    if (!delim) {
      delim = scanner.curr();
      if (delim && delim.type !== PCTokenType.WHITESPACE && delim.type !== PCTokenType.COMMA) {
        assertCurrTokenType(scanner, PCTokenType.COMMA);
      }
      scanner.next();
    }
  }

  return items.length === 1 ? items[0] : {
    type: delim.type === PCTokenType.WHITESPACE ? DcExpressionType.SPACED_LIST : DcExpressionType.COMMA_LIST,
    items: items,
    location: getLocation(start, scanner.curr(), scanner.source),
  } as DcList;
};

const createExpression = (scanner: TokenScanner) => {
  eatWhitespace(scanner);

  switch(scanner.curr().type) {
    case PCTokenType.SINGLE_QUOTE:
    case PCTokenType.DOUBLE_QUOTE: {
      return createString(scanner);
    }
    case PCTokenType.HASH: {
      return createColor(scanner);
    }
    case PCTokenType.NUMBER: {
      return createMeasurement(scanner);
    }
    case PCTokenType.MINUS: {
      if (scanner.hasNext() && scanner.peek(1).type === PCTokenType.NUMBER) {
        return createMeasurement(scanner);
      } else {
        return createReference(scanner);
      }
    }
    case PCTokenType.TEXT: {
      return createReference(scanner);
    }
    default: {
      throwUnexpectedToken(scanner.source, scanner.curr());
    }
  }
};

const createColor = (scanner: TokenScanner): DcColor => {
  const start = scanner.curr();
  let buffer = "";

  while(!scanner.ended() && scanner.curr().type !== PCTokenType.WHITESPACE) {
    buffer += scanner.curr().value;
    scanner.next();
  }

  return {
    type: DcExpressionType.COLOR,
    value: buffer,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
};

const createMeasurement = (scanner: TokenScanner): DcMeasurement  => {
  const start = scanner.curr();
  const value = getNumber(scanner);
  let unit = "";
  if (!scanner.ended() && scanner.curr().type !== PCTokenType.WHITESPACE && scanner.curr().type !== PCTokenType.COMMA && scanner.curr().type !== PCTokenType.PAREN_CLOSE) {
    unit = scanner.curr().value;
    scanner.next();
  }

  return {
    type: DcExpressionType.MEASUREMENT,
    value,
    unit,
    location: getLocation(start, scanner.curr(), scanner.source)
  };
};

const getNumber = (scanner: TokenScanner) => {
  const curr = scanner.curr();
  let buffer = curr.value;
  if (buffer === "-") {
    buffer += scanner.next().value;
  }

  scanner.next(); // eat number

  return buffer;
};

const createReference = (scanner: TokenScanner) => {
  const start = scanner.curr();
  const name = getReferenceName(scanner);
  if (!scanner.ended() && scanner.curr().type === PCTokenType.PAREN_OPEN) {
    return {
      type: DcExpressionType.CALL,
      name,
      params: getParams(scanner),
      location: getLocation(start, scanner.curr(), scanner.source)
    } as DcCall;
  } else {
    return {
      type: DcExpressionType.KEYWORD,
      name
    } as DcKeyword;
  }
};

const getParams = (scanner: TokenScanner) => {
  const params = [];
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.PAREN_CLOSE) {
    scanner.next(); // eat ( , \s
    eatWhitespace(scanner);
    params.push(createExpression(scanner));
  }

  assertCurrTokenType(scanner, PCTokenType.PAREN_CLOSE);
  scanner.next(); // eat )
  
  return params;
};

const getReferenceName = (scanner: TokenScanner) => {
  let buffer = "";
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.WHITESPACE && scanner.curr().type !== PCTokenType.PAREN_OPEN && scanner.curr().type !== PCTokenType.PAREN_CLOSE) {
    buffer += scanner.curr().value;
    scanner.next();
  }
  return buffer;
}

export const stringifyDeclarationAST = (expr: DcExpression) => {
  switch(expr.type) {
    case DcExpressionType.SPACED_LIST: {
      const list = expr as DcList;
      return list.items.map(stringifyDeclarationAST).join(" ");
    }
    case DcExpressionType.COMMA_LIST: {
      const list = expr as DcList;
      return list.items.map(stringifyDeclarationAST).join(", ");
    }
    case DcExpressionType.KEYWORD: {
      return (expr as DcKeyword).name;
    }
    case DcExpressionType.CALL: {
      const call = expr as DcCall;
      return `${call.name}(${call.params.map(stringifyDeclarationAST).join(", ")})`
    }
    case DcExpressionType.COLOR: {
      return (expr as DcColor).value;
    }
    case BKExpressionType.STRING: {
      return JSON.stringify((expr as BKString).value);
    }
    case DcExpressionType.MEASUREMENT: {
      const { value, unit } = expr as DcMeasurement;
      return `${value}${unit}`;
    }
    default: {
      throw new Error(`Unable to stringify CSS declaration value type ${expr.type}`);
    }
  }
};