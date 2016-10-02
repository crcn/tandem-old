import { uniq } from "lodash";
import { SyntheticAction } from "../actions";
import { IPatchable, IComparable, Observable, diffArray } from "@tandem/common";

// TODO - synthetic immetubale value object -- booleans, numbers, and strings

export enum SyntheticKind {
  Native       = 1,
  Function     = Native       + 1,
  SymbolTable  = Function     + 1,
  JSXElement   = SymbolTable  + 1,
  JSXAttribute = JSXElement   + 1,
  Object       = JSXAttribute + 1,
  Undefined    = Object + 1,
  Array        = Undefined + 1
}

export interface ISynthetic extends IPatchable, IComparable {
  readonly id: number;
  kind: SyntheticKind;
  get(propertyName: string): ISynthetic;
  set(propertyName: string, value: ISynthetic);
  toJSON();
  equalsEquals(target: ISynthetic): boolean;
  equalsEqualsEquals(target: ISynthetic): boolean;
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
    case "function": return value.__synthetic ? new SyntheticWrapperFunction(value) : new NativeFunction(value);
    case "object":
      // if (Array.isArray(value)) return new SyntheticArray(value.map(mapNativeAsSynthetic));
      return new SyntheticValueObject(value);
    default: return new SyntheticValueObject(value);
  }
}

let _i: number = 0;
function createId() {
  return ++_i;
}

export abstract class BaseSynthetic extends Observable implements ISynthetic {
  abstract kind: SyntheticKind;
  private __currentNative: any;

  readonly id: number;
  public patchTarget: BaseSynthetic;

  constructor() {
    super();
    this.initialize();
    this.id = createId();
  }

  protected initialize() { }

  abstract isTrueLike();

  public patch(source: BaseSynthetic) {
    this.applyPatch(source);
    this.notify(new SyntheticAction(SyntheticAction.PATCHED));
  }

  abstract equalsEquals(target: BaseSynthetic);
  abstract equalsEqualsEquals(target: BaseSynthetic);

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
  protected __syntheticProperties: any;
  protected __initialProperties: any;
  private __syntheticMembers: Object;
  constructor(properties?: any) {
    super();
    if (!this.__syntheticMembers) {
      this.__syntheticMembers = {};
    }

    this.__initialProperties = properties || {};
    for (const propertyName in this.__initialProperties) {
      this.set(propertyName, this.__initialProperties[propertyName]);
    }
  }

  get<T extends ISynthetic>(propertyName: string): T {
    if (propertyName in this.__syntheticMembers) {
      if (this.__syntheticProperties[propertyName] == null) {
        const descriptor = this.__syntheticMembers[propertyName];
        const value = descriptor["value"];
        if (typeof value === "function") {
          this.__syntheticProperties[propertyName] = new SyntheticWrapperFunction(value);
        } else {
          Object.defineProperty(this.__syntheticProperties, propertyName, {
            get: descriptor.get ? descriptor.get.bind(this) : undefined,
            set: descriptor.set ? descriptor.set.bind(this) : undefined
          });
        }
      }

      return this.__syntheticProperties[propertyName];
    }

    return mapNativeAsSynthetic(this.__properties[propertyName] || new SyntheticValueObject(undefined));
  }

  set(propertyName: string, value: ISynthetic) {
    this.__syntheticProperties[propertyName] = value;
    this.__properties[propertyName] = value;
  }

  equalsEquals(value: SyntheticObject) {
    return this === value;
  }

  equalsEqualsEquals(value: SyntheticObject) {
    return this === value;
  }

  isTrueLike() {
    return true;
  }

  protected initialize() {
    this.__properties = this.createNativeValue();
    this.__syntheticProperties = {};
    super.initialize();
  }

  createNativeValue() {
    return {};
  }

  @synthetic() hasOwnProperty(propertyName: string) {
    return new SyntheticBoolean(!(propertyName in this.__initialProperties));
  }

  @synthetic("toString") toString2() {
    return new SyntheticString("[object Object]");
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
    return new SyntheticObject(Object.assign({}, prototype.__properties || prototype["value"]));
  }

  static keys(object: SyntheticObject) {
    return Object.keys(object.toNative());
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
  constructor(public value: T) {
    super();
  }

  equalsEquals(target: SyntheticValueObject<any>) {
    /* tslint:disable */
    return this.value == target.value;
    /* tslint:enable */
  }

  equalsEqualsEquals(target: SyntheticValueObject<any>) {
    return this.value === target.value;
  }

  toString() {
    return String(this.value);
  }

  isTrueLike() {
    return !!this.value;
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

export abstract class SyntheticBaseFunction extends SyntheticObject implements ISyntheticFunction {
  kind = SyntheticKind.Function;
  constructor(name?: string, properties?: any) {
    super(properties);
    this.set("prototype", new SyntheticObject());
    this.set("name", new SyntheticValueObject(name));
  }

  @synthetic() get call() {
    return new SyntheticCallFunction(this);
  }

  @synthetic("apply") get apply2() {
    return new SyntheticApplyFunction(this);
  }

  @synthetic("apply") get bind() {
    return new SyntheticBindFunction(this);
  }

  abstract apply(context: ISynthetic, args: Array<ISynthetic>);

  createInstance(args: Array<ISynthetic>): ISynthetic {
    const instance = SyntheticObject.create(this.get<SyntheticObject>("prototype"));
    this.apply(instance, args);
    return instance;
  }
}

export class SyntheticWrapperFunction extends SyntheticBaseFunction {
  kind = SyntheticKind.Function;
  constructor(readonly value: Function) {
    super(value.name);
  }
  createInstance(args: Array<ISynthetic>) {
    return new (this.value as any)(...args);
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.value.apply(context, args) || new SyntheticValueObject(undefined);
  }
  toJSON() {
    return undefined;
  }
}


class SyntheticCallFunction extends SyntheticBaseFunction {
  constructor(private __target: ISyntheticFunction) {
    super("name");
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.__target.apply(args[0], args.slice(1));
  }
}

class SyntheticApplyFunction extends SyntheticBaseFunction {
  constructor(private __target: ISyntheticFunction) {
    super("apply");
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.__target.apply(args[0], (<SyntheticArray<any>>args[1]).value);
  }
}

class SyntheticBindFunction extends SyntheticBaseFunction {
  constructor(private __target: ISyntheticFunction) {
    super("bind");
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return new SyntheticBoundFunction(this.__target, args);
  }
}

class SyntheticBoundFunction extends SyntheticBaseFunction {
  constructor(private __target: ISyntheticFunction, private _args: Array<ISynthetic>) {
    super();
  }
  apply(context: ISynthetic, args: Array<ISynthetic> = []) {
    return this.__target.apply(this._args[0], this._args.slice(1).concat(args));
  }
}

export class SyntheticString extends SyntheticValueObject<string> {

}


export class SyntheticNumber extends SyntheticValueObject<number> {

}

export class SyntheticBoolean extends SyntheticValueObject<boolean> {

}

export class SyntheticRegExp extends SyntheticValueObject<RegExp> {
  constructor(value: RegExp) {
    super(value);
  }
  @synthetic() test(value: any) {
    return new SyntheticBoolean(this.value.test(value));
  }
}

export class SyntheticArray<T extends ISynthetic> extends SyntheticObject {
  kind = SyntheticKind.Array;
  constructor(...items: T[]) {
    super(items);
  }

  get value(): T[] {
    return this.__properties;
  }

  createNativeValue() {
    return [];
  }

  @synthetic() get length() {
    return new SyntheticNumber(this.__properties.length);
  }

  @synthetic() indexOf(value: T) {
    return new SyntheticValueObject(this.__properties.indexOf(value));
  }

  @synthetic() reduce(reducer: ISyntheticFunction) {
    return new SyntheticValueObject(this.__properties.reduce(reducer.toNative()));
  }

  @synthetic() push(...items) {
    return new SyntheticValueObject(this.__properties.push(...items));
  }

  @synthetic() unshift(...items) {
    return new SyntheticValueObject(this.__properties.unshift(...items));
  }

  @synthetic() splice(...items) {
    return new SyntheticArray(...this.__properties.splice(...items));
  }

  @synthetic() slice(...items) {
    return new SyntheticArray(...this.__properties.slice(...items));
  }

  @synthetic() map(transform: ISyntheticFunction) {
    return new SyntheticArray(...this.__properties.map(wrapSyntheticFunction(transform)));
  }

  @synthetic() sort(sort: ISyntheticFunction) {
    return new SyntheticArray(...this.__properties.sort(wrapSyntheticFunction(sort)));
  }

  @synthetic() filter(filter: ISyntheticFunction) {
    return new SyntheticArray(...this.__properties.filter((item) => {
      return filter.apply(this, [item]).toNative();
    }));
  }

  @synthetic() shift() {
    return this.__properties.shift();
  }

  @synthetic() pop() {
    return this.__properties.pop();
  }

  @synthetic() join(sep: SyntheticString) {
    return new SyntheticString(this.__properties.join(sep.toNative()));
  }

  @synthetic() find(filter: ISyntheticFunction) {
    return this.__properties.find((item) => {
      return filter.apply(this, [item]).toNative();
    });
  }

  @synthetic() reverse(filter: ISyntheticFunction) {
    return new SyntheticArray(...this.__properties.reverse());
  }

  @synthetic() concat(...items: ISynthetic[]) {
    const flattened = [...this];
    for (const item of items) {
      if (SyntheticArray.isArray(item).toNative()) {
        flattened.push(...<SyntheticArray<any>>item);
      } else {
        flattened.push(item);
      }
    }
    return new SyntheticArray(...flattened);
  }

  @synthetic() forEach(each: ISyntheticFunction) {
    this.value.forEach((value, index, array) => {
      each.apply(this, [value, new SyntheticNumber(index), this]);
    });
  }

  @synthetic() static from(arrayLike: { [Symbol.iterator] }, map: ISyntheticFunction) {
    return new SyntheticArray(...([...arrayLike].map(map ? wrapSyntheticFunction(map) : item => item) as ISynthetic[]));
  }

  @synthetic() static isArray(value: ISynthetic) {
    return new SyntheticBoolean(value.kind === SyntheticKind.Array);
  }

  addNativeProperties(value: any[]) {
    value.push(...this.__properties.map(synthetic => synthetic.toNative()));
  }

  applyPatch(source: SyntheticArray<T>) {
    const changes = diffArray(this.__properties, source.__properties, ((a: ISynthetic, b: ISynthetic) => a.compare(b)));
    for (const rm of changes.remove) {
      const index = this.__properties.indexOf(rm);
      this.__properties.splice(index, 1);
    }

    for (const add of changes.add) {
      this.__properties.splice(add.index, 0, add.value);
    }

    for (const [oldItem, newItem, newIndex] of changes.update) {
      const oldIndex = this.__properties.indexOf(oldItem);
      if (oldIndex !== newIndex) {
        this.__properties.splice(oldIndex, 1);
        this.__properties.splice(newIndex, 1, oldItem);
      }
      oldItem.patch(newItem);
    }
  }

  toJSON() {
    return this.toNative();
  }

  [Symbol.iterator] = function*() {
    for (const value of this.__properties) yield value;
  };
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
    const inst = new (this.value as any)(...args.map((arg) => arg.toNative()));
    return mapNativeAsSynthetic(inst);
  }
}

function wrapSyntheticFunction(fn: ISyntheticFunction) {
  return function(...args: Array<any>) {
    return fn.apply(this, args);
  };
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
    this.defineConstant("Object", new NativeFunction(Object));
    this.defineConstant("Date", new NativeFunction(Date));
    this.defineConstant("Function", new NativeFunction(Function));
    this.defineConstant("RegExp", new NativeFunction(RegExp));
    this.defineConstant("Math", new SyntheticValueObject(Math));

    // todo - needs to be SyntheticArray here
    this.defineConstant("Array", new SyntheticWrapperFunction(SyntheticArray));
    this.defineConstant("Error", new NativeFunction(Error));
    this.defineConstant("console", new SyntheticValueObject(console));
  }
}

export function synthetic(newPropertyName?: string) {
  return (proto: any, propertyName: string, descriptor?: any) => {

    // ignore getters
    if (!descriptor.get && typeof proto[propertyName] === "function") {
      proto[propertyName].__synthetic = true;
    }

    proto.__syntheticMembers = Object.assign({}, proto.__syntheticMembers || {}, {
      [newPropertyName || propertyName]: descriptor
    });
  };
}