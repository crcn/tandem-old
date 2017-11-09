// TODO - measurements

export enum CSSDeclarationExpressionType {
  COLOR,
  VAR,
  CALL,
  KEYWORD,
  NUMBER
};

export type CSSDeclarationExpression = {
  type: CSSDeclarationExpressionType
};

export type CSSDeclarationCall = {
  name: string;
  params: CSSDeclarationExpression[]
} & CSSDeclarationExpression;

export type CSSDeclarationKeyword = {
  name: string;
} & CSSDeclarationExpression;

export type CSSDeclarationValueObject = {
  value: string;
} & CSSDeclarationExpression;

export type CSSDeclarationNumber = CSSDeclarationValueObject;
export type CSSDeclarationColor = CSSDeclarationValueObject;

export enum CSSDeclarationTokenType {
  WORD,
  NUMBER,
  CHAR,
  WS,
};

export type Token = {
  type: CSSDeclarationTokenType,
  value: string
};

type TokenCursor = {
  position: number;
}

const token = (type, value) => ({
  type: type,
  value: value
});

const tokenize = (source: string) => {
  let position = 0;
  const n = source.length;
  const tokens = [];
  while(position < n) {
    const char = source.charAt(position);
    if (/\d/.test(char) || ((char === "-" || char === ".") && /\d+/.test(source.charAt(position + 1)))) {
      const value = source.substr(position).match(/^(-?[\d\.]+)/)[1];
      position += value.length - 1;
      tokens.push(token(CSSDeclarationTokenType.NUMBER, value));
    } else if (/\w+/.test(char) || (char === "-" && /[\w-]+/.test(source.charAt(position + 1)))) {
      const value = source.substr(position).match(/^([\w-]+)/)[1];
      position += value.length - 1;
      tokens.push(token(CSSDeclarationTokenType.WORD, value));
    } else if(/[\s\t]/.test(char)) {
      const value = source.substr(position).match(/^([\s\r\n\t]+)/)[1];
      position += value.length - 1;
      tokens.push(token(CSSDeclarationTokenType.WS, char));
    } else {
      tokens.push(token(CSSDeclarationTokenType.CHAR, char));
    }

    position++;
  }

  return tokens;
};

let _memos = {};

setInterval(() => {
  _memos = {};
}, 1000 * 60);

const getTokenType = (tokens, position: number) => {
  return tokens[position] && tokens[position].type;
};

const getTokenValue = (tokens, position) => {
  return tokens[position] && tokens[position].value;
};

export const parseDeclarationValue = (value: string) => {
  if (_memos[value]) {
    return _memos[value];
  }
  return _memos[value] = getExpression(tokenize(value).filter(token => token.type !== CSSDeclarationTokenType.WS), { position: 0 });
};


const getExpression = (tokens: Token[], cursor: TokenCursor) => {
  const currentType = getTokenType(tokens, cursor.position);
  if (currentType === CSSDeclarationTokenType.WORD) {
    if (getTokenValue(tokens, cursor.position + 1) === "(") {
      return getCall(tokens, cursor);
    } 

    return getKeyword(tokens, cursor);
  } else if(currentType === CSSDeclarationTokenType.NUMBER) {
    return getNumber(tokens, cursor);
  }

  throw new Error(`unknown token ${getTokenValue(tokens, cursor.position)}`);
};

const getCall = (tokens: Token[], cursor: TokenCursor): CSSDeclarationCall => {
  cursor.position++; // eat word
  return {
    name: getTokenValue(tokens, cursor.position - 1),
    type: CSSDeclarationExpressionType.CALL,
    params: getParams(tokens, cursor),
  };
};

const getKeyword = (tokens: Token[], cursor: TokenCursor): CSSDeclarationKeyword => {
  cursor.position++; // eat word
  return {
    name: getTokenValue(tokens, cursor.position - 1),
    type: CSSDeclarationExpressionType.KEYWORD
  };
};

const getNumber = (tokens: Token[], cursor: TokenCursor): CSSDeclarationNumber => {
  cursor.position++;
  return {
    value: getTokenValue(tokens, cursor.position - 1),
    type: CSSDeclarationExpressionType.NUMBER
  };
};

const getParams = (tokens: Token[], cursor: TokenCursor) => {
  const params: CSSDeclarationExpression[] = [];
  cursor.position++; // eat (
  while(1) {
    const current = getTokenValue(tokens, cursor.position);
    if (current === ",") {
      cursor.position++;
      continue;
    }
    if (current === ")") {
      break;
    }
    params.push(getExpression(tokens, cursor));

  }
  return params;
}

export const stringifyCSSExpression = (expr: CSSDeclarationExpression) => {
  if (expr.type === CSSDeclarationExpressionType.CALL) {
    const call = expr as CSSDeclarationCall;
    return `${call.name}(${call.params.map(stringifyCSSExpression).join(", ")})`;
  } else if (expr.type === CSSDeclarationExpressionType.NUMBER || expr.type === CSSDeclarationExpressionType.COLOR) {
    return (expr as CSSDeclarationValueObject).value;
  } else if (expr.type === CSSDeclarationExpressionType.KEYWORD) {
    return (expr as CSSDeclarationKeyword).name;
  }
}