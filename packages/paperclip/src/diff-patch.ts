import { shallowEquals, arraySplice } from "tandem-common";

/*

Vanilla diffing & patching
*/

type Key = string | number;

export enum OperationType {
  INSERT,
  DELETE,
  UPDATE,
  MOVE
}

export type BaseOperation<TType extends OperationType> = {
  type: TType;
  path: Key[];
  prev?: string;
  id: string;
};

export type Insert = {
  value: any;
} & BaseOperation<OperationType.INSERT>;

export type Delete = {} & BaseOperation<OperationType.DELETE>;

export type Update = {
  value: any;
} & BaseOperation<OperationType.UPDATE>;

export type Move = {
  newPath: Key[];
} & BaseOperation<OperationType.MOVE>;

export type Operation = Insert | Delete | Update | Move;

let _opCount = 0;
let _opSeed = String(Math.round(Math.random() * 9999)) + String(Date.now());

const generateId = () => {
  return `${_opSeed}${_opCount++}`;
};

export const diff2 = (
  oldItem: any,
  newItem: any,
  path: Key[] = [],
  operations: Operation[] = []
) => {
  if (oldItem === newItem) {
    return operations;
  }

  if (
    typeof oldItem !== typeof newItem ||
    (!oldItem || typeof oldItem !== "object")
  ) {
    if (oldItem !== newItem) {
      addOperation(upd(newItem, path, generateId()), operations);
    }
  }
  if (Array.isArray(oldItem)) {
    diffArray(oldItem, newItem, path, operations);
  } else if (typeof oldItem === "object") {
    diffObject(oldItem, newItem, path, operations);
  }

  return operations;
};

export const mergeOts = (
  allOperations: Operation[],
  newOperations: Operation[]
) => {
  const newAllOperations = [...allOperations];
  for (const operation of newOperations) {
    addOperation(operation, newAllOperations);
  }
  return newAllOperations;
};

const del = (path: Key[], id: string): Delete => ({
  type: OperationType.DELETE,
  path,
  id
});
const ins = (value: any, path: Key[], id: string): Insert => ({
  type: OperationType.INSERT,
  value,
  path,
  id
});
const mov = (newPath: Key[], path: Key[], id: string): Move => ({
  type: OperationType.MOVE,
  newPath,
  path,
  id
});
const upd = (value: any, path: Key[], id: string): Update => ({
  type: OperationType.UPDATE,
  value,
  path,
  id
});

const addOperation = (operation: Operation, operations: Operation[]) => {
  if (!operation.prev) {
    operation.prev = operations.length
      ? operations[operations.length - 1].id
      : null;
    operations.push(operation);
  } else {
    const prevIndex = operations.findIndex(
      existingOperation => existingOperation.id === operation.prev
    );
    if (prevIndex === -1) {
      console.error(`Cannot add operation`);
      // TODO - need to add operation to buffer
    } else {
      const prevOperation = operations[prevIndex];
      operation = { ...operation, prev: prevOperation.id };
      operations.splice(prevIndex + 1, 0, operation);
    }
  }
};

const diffArray = (
  oldArray: any[],
  newArray: any[],
  path: Key[],
  operations: Operation[]
) => {
  const oldHash = arrayToHash(oldArray);
  const newHash = arrayToHash(newArray);
  const model = oldArray.concat();

  // insert, update, move
  for (let i = 0, { length } = newArray; i < length; i++) {
    const newItem = newArray[i];
    const newItemId = (newItem && newItem.id) || i;
    const oldItem = oldHash[newItemId];
    const newChildPath = [...path, i];

    if (i >= model.length) {
      addOperation(ins(newItem, newChildPath, generateId()), operations);
      // does not exist
    } else if (oldItem == null) {
      const replItem = oldArray[i];
      const replItemId = (replItem && replItem.id) || i;

      // if the item exists, then just insert the new item -- we'll get to it eventually
      if (newHash.hasOwnProperty(replItemId)) {
        model.splice(i, 0, newItem);
      } else {
        // otherwise, remove the item since it doesn't exist
        model.splice(i, 1, newItem);
        addOperation(del(newChildPath, generateId()), operations);
      }

      addOperation(ins(newItem, newChildPath, generateId()), operations);

      // exists
    } else {
      const oldIndex = model.indexOf(oldItem);
      if (oldIndex !== i) {
        model.splice(oldIndex, 1);
        model.splice(i, 0, oldItem);
        addOperation(
          mov([...path, oldIndex], newChildPath, generateId()),
          operations
        );
      }

      diff2(oldItem, newItem, newChildPath, operations);
    }
  }

  // delete
  const lastNewArrayIndex = newArray.length;
  for (let j = lastNewArrayIndex, { length } = model; j < length; j++) {
    addOperation(del([...path, lastNewArrayIndex], generateId()), operations);
  }

  return operations;
};

const diffObject = (
  oldItem: any,
  newItem: any,
  path: Key[],
  operations: Operation[]
) => {
  for (const key in oldItem) {
    if (newItem[key] == null && oldItem[key] != null) {
      addOperation(del([...path, key], generateId()), operations);
    } else {
      diff2(oldItem[key], newItem[key], [...path, key], operations);
    }
  }

  for (const key in newItem) {
    if (oldItem[key] == null) {
      addOperation(ins(newItem[key], [...path, key], generateId()), operations);
    }
  }

  return operations;
};

const arrayToHash = (ary: any) => {
  const hash = {};
  for (let i = 0, { length } = ary; i < length; i++) {
    const item = ary[i];
    hash[(item && item.id) || i] = item;
  }
  return hash;
};

export const patch2 = (oldItem: any, operations: Operation[]) =>
  operations.reduce((oldItem, operation) => {
    let parent = oldItem;
    for (let i = 0, n = operation.path.length - 1; i < n; i++) {
      parent = parent[operation.path[i]];
    }

    const property = operation.path[operation.path.length - 1];

    switch (operation.type) {
      case OperationType.DELETE: {
        if (typeof property === "number") {
          parent = arraySplice(parent, property, 1);
        } else {
          parent = { ...parent };
          delete parent[property];
        }
        break;
      }
      case OperationType.UPDATE: {
        if (typeof property === "number") {
          parent = arraySplice(parent, property, 1, operation.value);
        } else {
          parent = { ...parent, [property]: operation.value };
        }
        break;
      }
      case OperationType.INSERT: {
        if (typeof property === "number") {
          parent = arraySplice(parent, property, 0, operation.value);
        } else {
          parent = { ...parent, [property]: operation.value };
        }
        break;
      }
      case OperationType.MOVE: {
        const value = parent[property];
        const newProperty = operation.newPath[operation.newPath.length - 1];
        if (typeof property === "number") {
          parent = arraySplice(parent, property, 1);
          parent = arraySplice(parent, Number(newProperty), 0, value);
        } else {
          parent = { ...parent };
          delete parent[property];
          parent[newProperty] = value;
        }
      }
    }

    return updatedNestedValue(
      oldItem,
      parent,
      operation.path.slice(0, operation.path.length - 1),
      0
    );
  }, oldItem);

const updatedNestedValue = (
  ancestor: any,
  value: any,
  path: Key[],
  depth: number
) => {
  if (depth === path.length) {
    return value;
  }

  const property = path[depth];

  if (Array.isArray(ancestor)) {
    const index = Number(path[depth]);
    return arraySplice(
      ancestor,
      index,
      1,
      updatedNestedValue(ancestor[index], value, path, depth + 1)
    );
  }

  return {
    ...ancestor,
    [property]: updatedNestedValue(ancestor[property], value, path, depth)
  };
};
