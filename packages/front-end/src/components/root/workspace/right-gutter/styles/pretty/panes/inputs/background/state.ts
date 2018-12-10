import { EMPTY_ARRAY } from "tandem-common";
import { ComputedStyleInfo } from "paperclip";

// TODO - compute this information based on CSS properties

export enum CSSBackgroundType {
  SOLID,
  LINEAR_GRADIENT,
  IMAGE
}

export enum BackgroundBlendMode {
  SATURATION = "saturation"
}

export type CSSBaseBackground<TType extends CSSBackgroundType> = {
  type: TType;
  blendMode?: BackgroundBlendMode;
};

export type CSSSolidBackground = {
  color: string;
} & CSSBaseBackground<CSSBackgroundType.SOLID>;

export type CSSLinearGradientColorStop = {
  color: string;
  stop: number;
};

export type CSSLinearGradientBackground = {
  degree: string;
  stops: CSSLinearGradientColorStop[];
} & CSSBaseBackground<CSSBackgroundType.LINEAR_GRADIENT>;

export type CSSImageBackground = {
  // https://www.w3schools.com/cssref/pr_background-image.asp
  uri: string;

  // https://www.w3schools.com/CSSref/pr_background-repeat.asp
  repeat?: string;

  // https://www.w3schools.com/csSref/css3_pr_background-size.asp
  size?: string;
} & CSSBaseBackground<CSSBackgroundType.IMAGE>;

export type CSSBackground =
  | CSSSolidBackground
  | CSSLinearGradientBackground
  | CSSImageBackground;

export const computeCSSBackgrounds = ({
  style
}: ComputedStyleInfo): CSSBackground[] => {
  const source = style["background-image"];

  if (!source) {
    return EMPTY_ARRAY;
  }

  const scanner = new Scanner(source);
  const tokenizer = new Tokenizer(scanner);
  return getBackgroundExpressions(tokenizer);
};

export const parseCSSBackroundValue = (value: string) => {
  const scanner = new Scanner(value);
  const tokenizer = new Tokenizer(scanner);
  return getBackgroundExpressions(tokenizer);
};

const getBackgroundExpressions = (tokenizer: Tokenizer): CSSBackground[] => {
  const backgrounds = [];
  while (!tokenizer.ended()) {
    backgrounds.push(getBackgroundExpression(tokenizer));
  }

  return backgrounds;
};

const getBackgroundExpression = (tokenizer: Tokenizer): CSSBackground => {
  const keyword = tokenizer.next();
  const t = tokenizer.next();
  if (t.type === TokenType.L_PAREN) {
    const params = getParams(tokenizer);
    if (keyword.value === "linear-gradient") {
      if (params.length === 2 && params[0] === params[1]) {
        const solid: CSSSolidBackground = {
          color: params[0],
          type: CSSBackgroundType.SOLID
        };

        return solid;
      } else {
        let degree: string;
        if (/deg$/.test(params[0])) {
          degree = params.shift();
        }

        const stops: CSSLinearGradientColorStop[] = [];

        for (const param of params) {
          const [, color, stop] = param.match(/(.*?)([\d\.]+%)$/);
          stops.push({
            color: color.trim(),
            stop: Number(stop.trim().replace("%", ""))
          });
        }

        const linearGradient: CSSLinearGradientBackground = {
          stops,
          type: CSSBackgroundType.LINEAR_GRADIENT,
          degree
        };

        return linearGradient;
      }
    } else if (keyword.value === "url") {
      const image: CSSImageBackground = {
        uri: params.join(","),
        type: CSSBackgroundType.IMAGE
      };

      return image;
    } else {
      throw new Error(`unexpected keyword ${keyword.value}`);
    }
  }
  return null;
};

const getParams = (tokenizer: Tokenizer): string[] => {
  const params: string[] = [];
  let buffer: string = "";
  while (!tokenizer.ended()) {
    const curr = tokenizer.next();

    if (curr.type === TokenType.R_PAREN) {
      params.push(buffer.trim());
      break;
    }

    if (curr.type === TokenType.COMMA) {
      params.push(buffer.trim());
      buffer = "";
      continue;
    }

    let value = curr.value;

    if (!tokenizer.ended() && tokenizer.peek().type === TokenType.L_PAREN) {
      tokenizer.next(); // eat (
      value = `${value}(${getParams(tokenizer).join(", ")})`;
    }

    buffer += value;
  }

  return params;
};

export const stringifyCSSBackground = (background: CSSBackground) => {
  switch (background.type) {
    case CSSBackgroundType.IMAGE: {
      return `url(${background.uri})`;
    }
    case CSSBackgroundType.LINEAR_GRADIENT: {
      return `linear-gradient()`;
    }
    case CSSBackgroundType.SOLID: {
      return `${background.color}`;
    }
  }
};

enum TokenType {
  KEYWORD,
  L_PAREN,
  WHITESPACE,
  R_PAREN,
  COMMA,
  NUMBER,
  CHAR
}

type Token = {
  type: TokenType;
  value: string;
};

class Tokenizer {
  private _stack: Token[] = [];

  constructor(private _scanner: Scanner) {}

  ended() {
    return this._scanner.ended() && !this._stack.length;
  }

  putBack() {
    this._stack.unshift(this.current());
  }

  next() {
    if (this._stack.length === 0) {
      this._stack.push(this._next());
    }
    return this._stack.shift();
  }

  peek(count: number = 1) {
    let diff = count - this._stack.length;
    while (diff > 0) {
      this._stack.push(this._next());
      diff--;
    }
    return this._stack[0];
  }

  _next(): Token {
    const c = this._scanner.next();

    // whitespace
    if (/[\s\r\n\t]/.test(c)) {
      return {
        type: TokenType.WHITESPACE,
        value: c + this._scanner.scan(/^[\s\n\r\t]+/)
      };
    }

    if (c === "(")
      return {
        type: TokenType.L_PAREN,
        value: c
      };

    if (c === ")")
      return {
        type: TokenType.R_PAREN,
        value: c
      };

    if (/[a-zA-Z_-]/.test(c))
      return {
        type: TokenType.KEYWORD,
        value: c + this._scanner.scan(/^[a-zA-Z_-]+/)
      };

    if (/[0-9\.]/.test(c))
      return {
        type: TokenType.NUMBER,
        value: c + this._scanner.scan(/^[0-9\.]+/)
      };

    if (c === ",")
      return {
        type: TokenType.COMMA,
        value: c
      };

    return {
      type: TokenType.CHAR,
      value: c
    };
  }

  current(): Token {
    return this._stack[0];
  }
}

class Scanner {
  private _position: number = 0;
  constructor(private _source: string) {}
  next() {
    return this.scan(/./);
  }

  ended() {
    return this._position >= this._source.length;
  }

  scan(pattern: RegExp) {
    const match = this._source.substr(this._position).match(pattern);
    if (!match) {
      return "";
    }
    const value = match[0];
    this._position += value.length;
    return value;
  }
}
