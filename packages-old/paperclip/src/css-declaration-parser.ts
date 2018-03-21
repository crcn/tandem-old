import { DcMeasurement, DcExpressionType, PCExpressionType, DcCall, DcColor, DcExpression, DcKeyword, DcList, Token, BKExpressionType, BKString } from "./ast";
import { createString, eatWhitespace, throwUnexpectedToken, testCurrTokenType } from "./parser";
import { tokenizePaperclipSource, PCTokenType } from "./tokenizer";
import { TokenScanner } from "./scanners";
import { getLocation } from "./ast-utils";
import { ParseContext, ParseResult } from "./parser-utils";

const _memos = {};

export const parseDeclaration = (source: string, filePath?: string): ParseResult => {
  if (_memos[source]) {
    return _memos[source];
  }

  const context: ParseContext = {
    filePath,
    source,
    diagnostics: [],
    scanner: tokenizePaperclipSource(source)
  };

  return _memos[source] = {
    root: createList(context),
    diagnostics: context.diagnostics
  }
}

const createList = (context: ParseContext) => {
  const {scanner} = context;
  const start = scanner.curr();
  let items = [];
  let delim: Token;
  while(!scanner.ended()) {
    items.push(createExpression(context));
    if (!delim) {
      delim = scanner.curr();
      if (delim && delim.type !== PCTokenType.WHITESPACE && delim.type !== PCTokenType.COMMA) {
        if (!testCurrTokenType(context, [PCTokenType.COMMA])) {
          return null;
        }
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

const createExpression = (context: ParseContext) => {
  const {scanner} = context;
  eatWhitespace(context);

  switch(scanner.curr().type) {
    case PCTokenType.SINGLE_QUOTE:
    case PCTokenType.DOUBLE_QUOTE: {
      return createString(context);
    }
    case PCTokenType.HASH: {
      return createColor(context);
    }
    case PCTokenType.NUMBER: {
      return createMeasurement(context);
    }
    case PCTokenType.MINUS: {
      if (scanner.hasNext() && scanner.peek(1).type === PCTokenType.NUMBER) {
        return createMeasurement(context);
      } else {
        return createReference(context);
      }
    }
    case PCTokenType.TEXT: {
      return createReference(context);
    }
    default: {
      throwUnexpectedToken(scanner.source, scanner.curr());
    }
  }
};

const createColor = (context: ParseContext): DcColor => {
  const {scanner} = context;
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

const createMeasurement = (context: ParseContext): DcMeasurement  => {
  const {scanner} = context;
  const start = scanner.curr();
  const value = getNumber(context);
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

const getNumber = (context: ParseContext) => {
  const {scanner} = context;
  const curr = scanner.curr();
  let buffer = curr.value;
  if (buffer === "-") {
    buffer += scanner.next().value;
  }

  scanner.next(); // eat number

  return buffer;
};

const createReference = (context: ParseContext) => {
  const {scanner} = context;
  const start = scanner.curr();
  const name = getReferenceName(context);
  if (!scanner.ended() && scanner.curr().type === PCTokenType.PAREN_OPEN) {
    return {
      type: DcExpressionType.CALL,
      name,
      params: getParams(context),
      location: getLocation(start, scanner.curr(), scanner.source)
    } as DcCall;
  } else {
    return {
      type: DcExpressionType.KEYWORD,
      name
    } as DcKeyword;
  }
};

const getParams = (context: ParseContext) => {
  const {scanner} = context;
  const params = [];
  while(!scanner.ended() && scanner.curr().type !== PCTokenType.PAREN_CLOSE) {
    scanner.next(); // eat ( , \s
    eatWhitespace(context);
    params.push(createExpression(context));
  }

  if (!testCurrTokenType(context, [PCTokenType.PAREN_CLOSE])) {
    return null;
  }
  scanner.next(); // eat )
  
  return params;
};

const getReferenceName = (context: ParseContext) => {
  const {scanner} = context;
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