import { Action } from "./base";
import { IUnique, ICloneable } from "../object";
import { serializable, serialize, deserialize } from "../serialize";

@serializable({
  serialize({ type, target }: Mutation<any>) {
    return {
      type: type,
      target: serialize(target.clone())
    };
  },
  deserialize({ type, target }, injector): Mutation<any> {
    return new Mutation(
      type,
      deserialize(target, injector)
    );
  }
})
export class Mutation<T> extends Action {
  readonly target: any;
  constructor(type: string, target?: T) {
    super(type);
    this.currentTarget = target;
  }
  toString() {
    return `${this.constructor.name}(${this.paramsToString()})`;
  }
  protected paramsToString() {

    // Target is omitted here since you can inspect the *actual* target by providing an "each" function
    // for the synthetic object editor, and logging the target object there.
    return `${this.type}`;
  }
}


export abstract class ApplicableMutation<T> extends Mutation<T> {
  abstract applyTo(target: any);
}


@serializable({
  serialize({ type, target, newValue }: SetValueMutation<any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      newValue: newValue
    };
  },
  deserialize({ type, target, newValue }, injector): SetValueMutation<any> {
    return new SetValueMutation(
      type,
      deserialize(target, injector),
      newValue
    );
  }
})
export class SetValueMutation<T> extends Mutation<T> {
  constructor(type: string, target: T, public newValue: any) {
    super(type, target);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.newValue}`;
  }
}


export abstract class ChildMutation<T, U extends IUnique & ICloneable> extends ApplicableMutation<T> {
  constructor(type: string, target: T, readonly child: U) {
    super(type, target);
  }
  findChildIndex(collection: U[]) {
    const index = collection.findIndex(child => child.uid === this.child.uid);
    if (index === -1) throw new Error(`Cannot apply ${this.type} edit - child ${this.child.uid} not found.`);
    return index;
  }
  findChild(collection: U[]) {
    return collection[this.findChildIndex(collection)];
  }
  abstract applyTo(collection: U[]);
  paramsToString() {
    return `${super.paramsToString()}, ${this.child.toString().replace(/[\n\r\s\t]+/g, " ")}`;
  }
}

@serializable({
  serialize({ type, target, child, index }: InsertChildMutation<ICloneable, any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone(true)),
      index: index
    };
  },
  deserialize({ type, target, child, index }, injector): InsertChildMutation<any, any> {
    return new InsertChildMutation(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      index
    );
  }
})
export class InsertChildMutation<T extends ICloneable, U extends ICloneable & IUnique> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, readonly index: number = Infinity) {
    super(type, target, child);
  }
  applyTo(collection: U[]) {

    // need to clone child in case the edit is applied to multiple targets
    collection.splice(this.index, 0, this.child.clone(true) as any);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
  }
}

@serializable({
  serialize({ type, target, child }: RemoveChildMutation<ICloneable, any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone())
    };
  },
  deserialize({ type, target, child, newIndex }, injector): RemoveChildMutation<any, any> {
    return new RemoveChildMutation(
      type,
      deserialize(target, injector),
      deserialize(child, injector)
    );
  }
})
export class RemoveChildMutation<T extends ICloneable, U extends ICloneable & IUnique> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U) {
    super(type, target, child);
  }
  applyTo(collection: U[]) {
    const foundIndex = this.findChildIndex(collection);
    if (foundIndex === -1) throw new Error(`Cannot apply move edit - child ${this.child.uid} not found`);
    collection.splice(foundIndex, 1);
  }
}

@serializable({
  serialize({ type, target, name, newValue, oldName, newIndex }: PropertyMutation<ICloneable>) {
    return {
      type: type,
      target: serialize(target.clone()),
      name: name,
      newValue: serialize(newValue),
      oldName: oldName,
      newIndex: newIndex
    };
  },
  deserialize({ type, target, name, newValue, oldName, newIndex }, injector): PropertyMutation<any> {
    return new PropertyMutation(
      type,
      deserialize(target, injector),
      name,
      deserialize(newValue, injector),
      oldName,
      newIndex
    );
  }
})
export class PropertyMutation<T extends ICloneable> extends ApplicableMutation<T> {
  constructor(type: string, target: T, public  name: string, public newValue: any, public oldName?: string, public newIndex?: number) {
    super(type, target);
  }
  applyTo(target: T) {
    target[this.name] = this.newValue;
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.name}, ${this.newValue}`;
  }
}

/**
 * Removes the target synthetic object
 */

export class RemoveMutation<T> extends Mutation<T> {
  static readonly REMOVE_CHANGE = "removeChange";
  constructor(target?: T) {
    super(RemoveMutation.REMOVE_CHANGE, target);
  }
}

/**
 * Removes the target synthetic object
 */

export class AddMutation<T> extends Mutation<T> {
  static readonly ADD_CHANGE = "addChange";
  constructor(target?: T) {
    super(AddMutation.ADD_CHANGE, target);
  }
}



@serializable({
  serialize({ type, target, child, newIndex }: MoveChildMutation<any, any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      newIndex: newIndex
    };
  },
  deserialize({ type, target, child, newIndex }, injector): MoveChildMutation<any, any> {
    return new MoveChildMutation(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      newIndex
    );
  }
})
export class MoveChildMutation<T, U extends ICloneable & IUnique> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, readonly newIndex: number) {
    super(type, target, child);
  }

  applyTo(collection: U[]) {
    const found = this.findChild(collection);
    collection.splice(collection.indexOf(found), 1);
    collection.splice(this.newIndex, 0, found);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.newIndex}`;
  }
}
