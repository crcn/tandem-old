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

@serializable({
  serialize({ type, target, newValue }: SetValueMutation<any>) {
    return {
      type: type,
      target: serialize(target.clone(false)),
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


export abstract class ChildMutation<T, U extends IUnique & ICloneable> extends Mutation<T> {
  constructor(type: string, target: T, readonly child: U, readonly index: number) {
    super(type, target);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.child.toString().replace(/[\n\r\s\t]+/g, " ")}`;
  }
}

// TODO - change index to newIndex 
@serializable({
  serialize({ type, target, child, index }: InsertChildMutation<ICloneable, any>) {
    return {
      type: type,
      target: serialize(target.clone(false)),
      child: serialize(child),
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
  constructor(type: string, target: T, child: U, index: number = Infinity) {
    super(type, target, child, index);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
  }
}

@serializable({
  serialize({ type, target, child, index }: RemoveChildMutation<ICloneable, any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      index: index
    };
  },
  deserialize({ type, target, child, index }, injector): RemoveChildMutation<any, any> {
    return new RemoveChildMutation(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      index
    );
  }
})
export class RemoveChildMutation<T extends ICloneable, U extends ICloneable & IUnique> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, index: number) {
    super(type, target, child, index);
  }
}

@serializable({
  serialize({ type, target, name, newValue, oldName, index }: PropertyMutation<ICloneable>) {
    return {
      type: type,
      target: serialize(target.clone()),
      name: name,
      newValue: serialize(newValue),
      oldName: oldName,
      index: index
    };
  },
  deserialize({ type, target, name, newValue, oldName, index }, injector): PropertyMutation<any> {
    return new PropertyMutation(
      type,
      deserialize(target, injector),
      name,
      deserialize(newValue, injector),
      oldName,
      index
    );
  }
})
export class PropertyMutation<T extends ICloneable> extends Mutation<T> {
  constructor(type: string, target: T, public  name: string, public newValue: any, public oldName?: string, public index?: number) {
    super(type, target);
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

// TODO - change oldIndex to index, and index to newIndex
@serializable({
  serialize({ type, target, child, index, oldIndex }: MoveChildMutation<any, any>) {
    return {
      type: type,
      target: serialize(target.clone()),
      child: serialize(child.clone()),
      oldInex: oldIndex,
      index: index
    };
  },
  deserialize({ type, target, child, index, oldIndex }, injector): MoveChildMutation<any, any> {
    return new MoveChildMutation(
      type,
      deserialize(target, injector),
      deserialize(child, injector),
      oldIndex,
      index
    );
  }
})
export class MoveChildMutation<T, U extends ICloneable & IUnique> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, readonly oldIndex: number, index: number) {
    super(type, target, child, index);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
  }
}
