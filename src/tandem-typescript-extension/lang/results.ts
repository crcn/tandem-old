import * as synthetic from "./synthetic";

export namespace ResultKind {
  export const Return = 1;
  export const Declaration = Return + 1;
  export const Exports = Declaration + 1;
  export const Void = Exports + 1;
  export const Literal = Void + 1;
  export const Break = Literal + 1;
  export const Continue = Break + 1;
  export const List = Continue + 1;
}

export abstract class Result<T> {
  constructor(readonly kind: number, readonly value: T = undefined) {

  }
}

export class VoidResult extends Result<undefined> {
  constructor() {
    super(ResultKind.Void);
  }
}

export class DeclarationResult extends Result<synthetic.ISynthetic> {
  constructor(readonly name: string, value: synthetic.ISynthetic) {
    super(ResultKind.Declaration, value);
  }
}

export class LiteralResult extends Result<synthetic.ISynthetic> {
  constructor(value: synthetic.ISynthetic) {
    super(ResultKind.Literal, value);
  }
}

export class ReturnResult extends Result<any> {
  constructor(value: any) {
    super(ResultKind.Return, value);
  }
}

export class ExportsResult extends Result<synthetic.ISynthetic> {
  constructor(value: synthetic.ISynthetic) {
    super(ResultKind.Exports, value);
  }
}

export class ListResult extends Result<Array<Result<any>>> {
  constructor(value: Array<Result<any>>) {
    super(ResultKind.List, value);
  }
}