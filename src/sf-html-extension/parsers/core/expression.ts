

export interface ICursor {
  start: number;
  end: number;
}

/**
 * utility function for flattening expressions
 */

export function flattenEach(fromItems: Array<BaseExpression>, toItems: Array<BaseExpression>) {
  for (const item of fromItems) {
    item._flattenDeep(toItems);
  }
}

/**
 * Generic
 */

export class BaseExpression {
  constructor(readonly type: string, readonly position: ICursor) {

  }

  public flatten(): Array<BaseExpression> {
    const items = [];
    this._flattenDeep(items);
    return items;
  }

  public _flattenDeep(items: Array<BaseExpression>) {
    items.push(this);
  }

  public toString() {
    return "";
  }
}