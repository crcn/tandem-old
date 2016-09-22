export namespace SyntheticKind {
  export const Native = 1;
  export const Function = Native + 1;
  export const SymbolTable = Function + 1;
  export const JSXElement = SymbolTable + 1;
  export const JSXAttribute = JSXElement + 1;
}

export interface ISynthetic {
  kind: number;
  get(propertyName: string): ISynthetic;
  set(propertyName: string, value: ISynthetic);
  toJSON();
}

export interface ISyntheticFunction extends ISynthetic {
  evaluate(args: Array<ISynthetic>): ISynthetic;
}

export interface ISyntheticValueObject extends ISynthetic {
  value: any;
}

export function mapNativeAsEntity(value: any, context?: any) {
  if (value && value.kind) return value;
  switch (typeof value) {
    case "function": return new NativeFunction(value, context);
    case "object":
      if (Array.isArray(value)) return new ArrayEntity(value.map(mapNativeAsEntity));
      const properties = {};
      for (const propertyName in value) {
        properties[propertyName] = mapNativeAsEntity(value[propertyName]);
      }
      return new ObjectEntity(properties);
    default: return new SyntheticValueObject(value);
  }
}

export function mapEntityAsNative(value: ISynthetic) {
  switch (value.kind) {
    case SyntheticKind.Function: return mapFunctionEntityAsNative(<ISyntheticFunction>value);
    default: return (<SyntheticValueObject<any>>value).toJSON();
  }
}

function mapFunctionEntityAsNative(value: ISyntheticFunction) {
  return function(...args: Array<any>) {
    const result = (<ISyntheticFunction>value.get("apply")).evaluate([mapNativeAsEntity(this), mapNativeAsEntity(args)]);
    return mapEntityAsNative(result);
  };
}

export class SyntheticValueObject<T> implements ISyntheticValueObject {
  kind = SyntheticKind.Native;
  private _vars: any;
  constructor(readonly value: T) {
    this._vars = {};
  }

  get(propertyName: string) {
    return mapNativeAsEntity(this.value[propertyName], this.value);
  }

  set(propertyName: string, value: ISynthetic) {
    this.value[propertyName] = mapEntityAsNative(value);
  }

  // deprecated -- entities need to be serializable
  toJSON() {
    return this.value;
  }
}

export class ArrayEntity<T extends ISynthetic> extends SyntheticValueObject<Array<T>> {
  constructor(value: Array<T>) {
    super(value);
  }

  toJSON() {
    return this.value.map(mapEntityAsNative);
  }
}

export class ObjectEntity extends SyntheticValueObject<Object> {
  constructor(value: any = {}) {
    super(value);
  }

  toJSON() {
    const value = {};
    for (const propertyName in this.value) {
      value[propertyName] = this.value[propertyName].toJSON();
    }
    return value;
  }
}

export class NativeFunction extends SyntheticValueObject<Function> implements ISyntheticFunction {
  constructor(value: Function, readonly context: any) {
    super(value);
  }
  evaluate(args: Array<any>) {
    return mapNativeAsEntity(this.value.apply(this.context, args.map(mapEntityAsNative)));
  }
}

export class SymbolTable implements ISynthetic {

  kind = SyntheticKind.SymbolTable;

  private _vars: any;

  constructor(private _parent?: SymbolTable) {
    this._vars = {};
  }

  get(id: string) {
    return this._vars[id] != null ? this._vars[id] : this._parent ? this._parent.get(id) : new SyntheticValueObject(undefined);
  }

  defineVariable(id: string, value?: ISynthetic) {
    this._vars[id] = value;
  }

  defineConstant(id: string, value: ISynthetic) {
    this._vars[id] = value;
  }

  set(id: string, value: ISynthetic) {
    const context = this.getOwner(id);
    if (context === this) {
      this._vars[id] = value;
    } else {
      context.set(id, value);
    }
  }

  getOwner(id: string) {
    return this._vars.hasOwnProperty(id) ? this : this._parent ? this._parent.getOwner(id) : this;
  }

  createChild() {
    return new SymbolTable(this);
  }

  toJSON() {
    const value = {};
    for (const propertyName in this._vars) {
      const propertyValue = <ISynthetic>this._vars[propertyName];
      value[propertyName] = (propertyValue ? propertyValue.toJSON() : undefined);
    }
    return value;
  }
}

export class JSXElement extends SyntheticValueObject<Object> {

  kind = SyntheticKind.JSXElement;

  constructor(name: ISynthetic, attributes: ArrayEntity<ISynthetic>, children: ArrayEntity<ISynthetic>) {
    super({
      name: name,
      attributes: attributes,
      children: children
    });
  }

  toJSON() {
    return {
      name: this.value["name"].toJSON(),
      attributes: this.value["attributes"].toJSON(),
      children: this.value["children"].toJSON()
    };
  }
}

export class JSXAttributeEntity extends SyntheticValueObject<Object> {
  kind = SyntheticKind.JSXAttribute;
  constructor(name: ISynthetic, value: ISynthetic) {
    super({
      name: name,
      value: value
    });
  }

  toJSON() {
    return {
      name: this.value["name"].toJSON(),
      value: this.value["value"].toJSON()
    };
  }
}

export class JSRootSymbolTable extends SymbolTable {
  constructor(parent?: SymbolTable) {
    super(parent);
    this.defineConstant("NaN", new SyntheticValueObject(NaN));
    this.defineConstant("Infinity", new SyntheticValueObject(Infinity));
    this.defineConstant("undefined", new SyntheticValueObject(undefined));
  }
}