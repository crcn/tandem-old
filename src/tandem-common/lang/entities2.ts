export namespace EntityKind {
  export const Native = 1;
  export const Function = Native + 1;
  export const SymbolTable = Function + 1;
  export const JSXElement = SymbolTable + 1;
  export const JSXAttribute = JSXElement + 1;
}

export interface IEntity {
  kind: number;
  get(propertyName: string): IEntity;
  set(propertyName: string, value: IEntity);
  toJSON();
}

export interface IFunctionEntity extends IEntity {
  evaluate(args: Array<IEntity>): IEntity;
}

export interface ILiteralEntity extends IEntity {
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
    default: return new LiteralEntity(value);
  }
}

export function mapEntityAsNative(value: IEntity) {
  switch (value.kind) {
    case EntityKind.Function: return mapFunctionEntityAsNative(<IFunctionEntity>value);
    default: return (<LiteralEntity<any>>value).toJSON();
  }
}

function mapFunctionEntityAsNative(value: IFunctionEntity) {
  return function(...args: Array<any>) {
    const result = (<IFunctionEntity>value.get("apply")).evaluate([mapNativeAsEntity(this), mapNativeAsEntity(args)]);
    return mapEntityAsNative(result);
  };
}

export class LiteralEntity<T> implements ILiteralEntity {
  kind = EntityKind.Native;
  private _vars: any;
  constructor(readonly value: T) {
    this._vars = {};
  }

  get(propertyName: string) {
    return mapNativeAsEntity(this.value[propertyName], this.value);
  }

  set(propertyName: string, value: IEntity) {
    this.value[propertyName] = mapEntityAsNative(value);
  }

  // deprecated -- entities need to be serializable
  toJSON() {
    return this.value;
  }
}

export class ArrayEntity<T extends IEntity> extends LiteralEntity<Array<T>> {
  constructor(value: Array<T>) {
    super(value);
  }

  toJSON() {
    return this.value.map(mapEntityAsNative);
  }
}

export class ObjectEntity extends LiteralEntity<Object> {
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

export class NativeFunction extends LiteralEntity<Function> implements IFunctionEntity {
  constructor(value: Function, readonly context: any) {
    super(value);
  }
  evaluate(args: Array<any>) {
    return mapNativeAsEntity(this.value.apply(this.context, args.map(mapEntityAsNative)));
  }
}

export class SymbolTable implements IEntity {

  kind = EntityKind.SymbolTable;

  private _vars: any;

  constructor(private _parent?: SymbolTable) {
    this._vars = {};
  }

  get(id: string) {
    return this._vars[id] != null ? this._vars[id] : this._parent ? this._parent.get(id) : new LiteralEntity(undefined);
  }

  defineVariable(id: string, value?: IEntity) {
    this._vars[id] = value;
  }

  defineConstant(id: string, value: IEntity) {
    this._vars[id] = value;
  }

  set(id: string, value: IEntity) {
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
      const propertyValue = <IEntity>this._vars[propertyName];
      value[propertyName] = (propertyValue ? propertyValue.toJSON() : undefined);
    }
    return value;
  }
}

export class JSXElementEntity extends LiteralEntity<Object> {

  kind = EntityKind.JSXElement;

  constructor(name: IEntity, attributes: ArrayEntity<IEntity>, children: ArrayEntity<IEntity>) {
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

export class JSXAttributeEntity extends LiteralEntity<Object> {
  kind = EntityKind.JSXAttribute;
  constructor(name: IEntity, value: IEntity) {
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
    this.defineConstant("NaN", new LiteralEntity(NaN));
    this.defineConstant("Infinity", new LiteralEntity(Infinity));
    this.defineConstant("undefined", new LiteralEntity(undefined));
  }
}