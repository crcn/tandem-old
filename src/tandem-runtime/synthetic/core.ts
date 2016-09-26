import { uniq } from "lodash";
import { SyntheticAction } from "../actions";
import { IPatchable, IComparable, Observable, diffArray } from "tandem-common";

// TODO - synthetic immetubale value object -- booleans, numbers, and strings

export enum SyntheticKind {
  Native       = 1,
  Function     = Native       + 1,
  SymbolTable  = Function     + 1,
  JSXElement   = SymbolTable  + 1,
  JSXAttribute = JSXElement   + 1,
  Object       = JSXAttribute + 1
}

export interface ISynthetic extends IPatchable, IComparable {
  readonly id: number;
  kind: SyntheticKind;
  get(propertyName: string): ISynthetic;
  set(propertyName: string, value: ISynthetic);
  toJSON();
  toString();
  toNative();
}

export interface IInstantiableSynthetic extends ISynthetic {
  createInstance(args: Array<ISynthetic>): ISynthetic;
}

export interface ISyntheticFunction extends IInstantiableSynthetic {
  apply(context: ISynthetic, args?: Array<ISynthetic>): ISynthetic;
}

export interface ISyntheticValueObject extends ISynthetic {
  value: any;
}

export function mapNativeAsSynthetic(value: any) {
  if (value && value.kind) return value;
  switch (typeof value) {
    case "function": return new NativeFunction(value);
    case "object":
      if (Array.isArray(value)) return new SyntheticArray(value.map(mapNativeAsSynthetic));
      const properties = {};
      for (const propertyName in value) {
        properties[propertyName] = mapNativeAsSynthetic(value[propertyName]);
      }
      return new SyntheticObject(properties);
    default: return new SyntheticValueObject(value);
  }
}

let _i: number = 0;
function createId() {
  return ++_i;
}

export abstract class BaseSynthetic extends Observable implements ISynthetic {
  abstract kind: SyntheticKind;
  private __syntheticMembers: Array<string>;
  private __currentNative: any;

  readonly id: number;

  constructor() {
    super();
    this.initialize();
    this.id = createId();
  }

  public patchTarget: BaseSynthetic;
  protected initialize() {
    for (const syntheticPropertyName of (this.__syntheticMembers || [])) {
      const value = this[syntheticPropertyName];
      this.set(syntheticPropertyName, typeof value === "function" ? new SyntheticWrapperFunction(value) : new SyntheticValueObject(value));
    }
  }

  public patch(source: BaseSynthetic) {
    this.applyPatch(source);
    this.notify(new SyntheticAction(SyntheticAction.PATCHED));
  }

  toNative() {

    // prevent circular reference issues
    if (this.__currentNative) {
      return this.__currentNative;
    }
    const ret = this.__currentNative = this.createNativeValue();
    this.addNativeProperties(ret);
    this.__currentNative = undefined;
    return ret;
  }


  abstract get(propertyName: string): ISynthetic;
  abstract set(propertyName: string, value: ISynthetic): void;
  protected abstract applyPatch(source: ISynthetic): void;
  abstract toJSON(): Object;
  compare(value: ISynthetic) {
    return Number(this.constructor === value.constructor);
  }

  protected abstract createNativeValue();
  protected addNativeProperties(value: any) {
    // override me
  }
}
export class SyntheticObject extends BaseSynthetic {

  kind = SyntheticKind.Object;
  protected __properties: any;
  constructor(properties?: any) {
    super();
    if (properties != null) {
      Object.assign(this.__properties, properties);
    }
  }

  get<T extends ISynthetic>(propertyName: string): T {
    return this.__properties[propertyName] || new SyntheticValueObject(undefined);
  }

  set(propertyName: string, value: ISynthetic) {
    this.__properties[propertyName] = value;
  }

  protected initialize() {
    this.__properties = {};
    super.initialize();
  }

  createNativeValue() {
    return {};
  }

  addNativeProperties(value: any) {
    for (const propertyName in this.__properties) {
      value[propertyName] = this.__properties[propertyName].toNative();
    }
  }

  static defineProperty(target: SyntheticObject, propertyName: string, attributes: PropertyDescriptor) {
    Object.defineProperty(target.__properties, propertyName, attributes);
  }

  static assign(target: SyntheticObject, ...from: Array<SyntheticObject>) {
    return Object.assign(target.__properties, ...from.map((object) => object.__properties));
  }

  static create(prototype: SyntheticObject) {
    return new SyntheticObject(Object.create(prototype.__properties));
  }

  protected applyPatch(source: SyntheticObject) {

    // update / insert
    for (const propertyName in this.__properties) {
      const oldSyntheticValue = this.get(propertyName) as BaseSynthetic;
      let newSyntheticValue = source.get(propertyName) as BaseSynthetic;

      // if the new synthetic value has already been patched, then
      // this is a reference, so set -- TODO - seems a bit janky. Possibly
      // check for something more explicit such as SyntheticReference. Also possibly
      // enforce that synthetics can only have one owner object.
      if (newSyntheticValue.patchTarget) {
        this.set(propertyName, newSyntheticValue.patchTarget);
        continue;
      }

      if (oldSyntheticValue.compare(newSyntheticValue)) {
        newSyntheticValue.patchTarget = oldSyntheticValue;
        oldSyntheticValue.patch(newSyntheticValue);
      } else {
        this.set(propertyName, newSyntheticValue);
      }
    }

    // remove
    for (const propertyName in source.__properties) {
      const newSyntheticValue = source.get(propertyName);
      if (this.__properties[propertyName] == null) {
        this.set(propertyName, newSyntheticValue);
      }
    }
  }

  toJSON() {
    const object = {};
    for (const propertyName in this.__properties) {
      object[propertyName] = this.__properties[propertyName].toJSON();
    }
    return object;
  }
}
export class SyntheticValueObject<T> extends BaseSynthetic implements ISyntheticValueObject {
  kind = SyntheticKind.Native;
  private _vars: any;
  constructor(public value: T) {
    super();
    this._vars = {};
  }

  toString() {
    return String(this.value);
  }

  createNativeValue() {
    return this.value;
  }

  applyPatch(source: SyntheticValueObject<T>) {
    this.value = source.value;
  }

  get(propertyName: string) {
    return mapNativeAsSynthetic(this.value[propertyName]);
  }

  set(propertyName: string, value: ISynthetic) {
    this.value[propertyName] = value.toNative();
  }

  // deprecated -- entities need to be serializable
  toJSON() {
    return this.value;
  }
}

export class SyntheticWrapperFunction extends SyntheticValueObject<Function> implements ISyntheticFunction {
  kind = SyntheticKind.Function;
  createInstance(args: Array<ISynthetic>) {
    return null; // TODO
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.value.apply(context, args) || new SyntheticValueObject(undefined);
  }
  toJSON() {
    return undefined;
  }
}

export class SyntheticString extends SyntheticValueObject<string> {

}


export class SyntheticNumber extends SyntheticValueObject<number> {

}

export class SyntheticArray<T extends ISynthetic> extends SyntheticValueObject<Array<T>> {
  constructor(value: T[] = []) {
    super(value);
  }

  createNativeValue() {
    return [];
  }

  addNativeProperties(value: any[]) {
    value.push(...this.value.map((synthetic) => synthetic.toNative()));
  }

  applyPatch(source: SyntheticArray<T>) {
    const changes = diffArray(this.value, source.value, ((a, b) => a.compare(b)));
    for (const rm of changes.remove) {
      const index = this.value.indexOf(rm);
      this.value.splice(index, 1);
    }

    for (const add of changes.add) {
      this.value.splice(add.index, 0, add.value);
    }

    for (const [oldItem, newItem, newIndex] of changes.update) {
      const oldIndex = this.value.indexOf(oldItem);
      if (oldIndex !== newIndex) {
        this.value.splice(oldIndex, 1);
        this.value.splice(newIndex, 1, oldItem);
      }
      oldItem.patch(newItem);
    }
  }

  toJSON() {
    return this.toNative();
  }
}

export class NativeFunction extends SyntheticValueObject<Function> implements ISyntheticFunction {

  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    const result = this.value.apply(context.toNative(), args.map((arg) => arg.toNative()));

    // thenable
    if (result && result.then) {
      return new Promise((resolve, reject) => {
        result.then((result) => {
          resolve(mapNativeAsSynthetic(result));
        }, reject);
      });
    }

    return mapNativeAsSynthetic(result);
  }

  createNativeValue() {
    return this.value;
  }

  createInstance(args: Array<ISynthetic>) {
    const instance = new SyntheticValueObject(Object.create(this.value.prototype));
    this.apply(instance, args);
    return instance;
  }
}

export class SymbolTable extends SyntheticObject implements ISynthetic {

  kind = SyntheticKind.SymbolTable;

  constructor(private _parent?: SymbolTable) {
    super();
  }

  get<T extends ISynthetic>(id: string): T {
    return this.__properties[id] != null ? this.__properties[id] : this._parent ? this._parent.get(id) : new SyntheticValueObject(undefined);
  }

  defineVariable(id: string, value?: ISynthetic) {
    this.__properties[id] = value;
  }

  defineConstant(id: string, value: ISynthetic) {
    this.__properties[id] = value;
  }

  set(id: string, value: ISynthetic) {
    const context = this.getOwner(id);
    if (context === this) {
      this.__properties[id] = value;
    } else {
      context.set(id, value);
    }
  }

  getOwner(id: string) {
    return this.__properties.hasOwnProperty(id) ? this : this._parent ? this._parent.getOwner(id) : this;
  }

  createChild() {
    return new SymbolTable(this);
  }

  toJSON() {
    const value = {};
    for (const propertyName in this.__properties) {
      const propertyValue = <ISynthetic>this.__properties[propertyName];
      value[propertyName] = (propertyValue ? propertyValue.toJSON() : undefined);
    }
    return value;
  }
}

export class SyntheticJSXElement extends SyntheticObject {

  kind = SyntheticKind.JSXElement;

  constructor(name: ISynthetic, attributes: SyntheticArray<ISynthetic>, children: SyntheticArray<ISynthetic>) {
    super({
      name: name,
      attributes: attributes,
      children: children
    });
  }

  get name(): SyntheticValueObject<string> {
    return this.get<SyntheticValueObject<string>>("name");
  }

  get attributes(): SyntheticArray<SyntheticJSXAttribute> {
    return this.get<SyntheticArray<SyntheticJSXAttribute>>("attributes");
  }

  get children(): SyntheticArray<SyntheticJSXElement|SyntheticString> {
    return this.get<SyntheticArray<SyntheticJSXElement|SyntheticString>>("children");
  }

  toJSON() {
    return {
      name: this.name.toJSON(),
      attributes: this.attributes.toJSON(),
      children: this.children.toJSON()
    };
  }
}

export class SyntheticJSXAttribute extends SyntheticObject {
  kind = SyntheticKind.JSXAttribute;
  constructor(name: ISynthetic, value: ISynthetic) {
    super({
      name: name,
      value: value
    });
  }

  get name(): SyntheticString {
    return this.get<SyntheticString>("name");
  }

  get value(): ISynthetic {
    return this.get("value");
  }

  toJSON() {
    return {
      name: this.name.toJSON(),
      value: this.value.toJSON()
    };
  }
}

export class JSRootSymbolTable extends SymbolTable {
  constructor(parent?: SymbolTable) {
    super(parent);
    this.defineConstant("NaN", new SyntheticValueObject(NaN));
    this.defineConstant("Infinity", new SyntheticValueObject(Infinity));
    this.defineConstant("undefined", new SyntheticValueObject(undefined));
    this.defineConstant("Object", new SyntheticValueObject(Object));
    this.defineConstant("Date", new SyntheticValueObject(Date));
    this.defineConstant("console", new SyntheticValueObject(console));
  }
}

export function synthetic(proto: any, propertyName: String) {
  proto.__syntheticMembers = uniq((proto.__syntheticMembers || []).concat(propertyName));
}