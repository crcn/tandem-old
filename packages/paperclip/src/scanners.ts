import { Token } from "./ast";


export class Scanner<T extends string|any[]> {
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

  hasNext() {
    return this.pos < this.length - 1;
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

export class StringScanner extends Scanner<string> {
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

export class TokenScanner extends Scanner<Token[]> {
  constructor(readonly source: string, tokens: Token[]) {
    super(tokens);
  } 

  peek(count: number = 1) {
    return this._target[this.pos + count];
  }

  peekUntil(until: (token: Token) => boolean) {
    let i = this.pos;
    while(i < this.length - 1) {
      if (until(this._target[++i])) {
        return this._target[i];
      }
    }
  }

  curr(): Token {
    return super.curr();
  }
  next(): Token {
    return super.next();
  }
}

export const eatUntil = (scanner: TokenScanner, type: number) => {
  while(!scanner.ended()) {
    const curr = scanner.curr();
    if (curr.type !== type) {
      break;
    }
    scanner.next();
  }
  return !scanner.ended();
}
