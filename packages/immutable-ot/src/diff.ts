import {
  Mutation,
  Key,
  insert,
  set,
  replace,
  remove,
  move,
  unset
} from "./mutations";

export const diff = (oldItem: any, newItem: any) =>
  diff2(oldItem, newItem, [], []);

const diff2 = (
  oldItem: any,
  newItem: any,
  path: Key[],
  operations: Mutation[]
) => {
  if (oldItem === newItem) {
    return operations;
  }

  if (
    typeof oldItem !== typeof newItem ||
    (!oldItem || typeof oldItem !== "object")
  ) {
    if (oldItem !== newItem) {
      operations.push(replace(newItem, path));
    }
  }
  if (Array.isArray(oldItem)) {
    diffArray(oldItem, newItem, path, operations);
  } else if (typeof oldItem === "object") {
    diffObject(oldItem, newItem, path, operations);
  }

  return operations;
};

const diffArray = (
  oldArray: any[],
  newArray: any[],
  path: Key[],
  operations: Mutation[]
) => {
  const model = oldArray.concat();

  let used = {};
  let inserted = false;

  // insert, update, move
  for (let i = 0, n = newArray.length; i < n; i++) {
    const newItem = newArray[i];
    let oldItem;
    for (let j = 0, n2 = oldArray.length; j < n2; j++) {
      if (used[j]) {
        continue;
      }
      const item = oldArray[j];
      if (newItem === item) {
        oldItem = item;
        used[j] = true;
        break;
      }
    }

    if (i >= oldArray.length) {
      model.splice(i, 0, newItem);
      operations.push(insert(i, newItem, path));
      // does not exist
    } else if (oldItem == null) {
      const replItem = oldArray[i];

      let existing;
      let existingIndex;
      for (let k = i, n = newArray.length; k < n; k++) {
        const item = newArray[k];
        if (replItem === item) {
          existing = replItem;
          existingIndex = k;
          break;
        }
      }

      if (existing == null) {
        model.splice(existingIndex, 1, newItem);
        diff2(replItem, newItem, [...path, i], operations);
      } else {
        model.splice(i, 0, newItem);
        inserted = true;
        operations.push(insert(i, newItem, path));
      }

      // exists
    } else {
      const oldIndex = model.indexOf(oldItem, i);
      if (oldIndex !== i) {
        model.splice(oldIndex, 1);
        model.splice(i, 0, oldItem);
        operations.push(move(oldIndex, i, path));
      }

      diff2(oldItem, newItem, [...path, i], operations);
    }
  }

  // delete
  const lastNewArrayIndex = newArray.length;
  for (let j = lastNewArrayIndex, { length } = model; j < length; j++) {
    operations.push(remove(lastNewArrayIndex, path));
  }

  return operations;
};

const diffObject = (
  oldItem: any,
  newItem: any,
  path: Key[],
  operations: Mutation[]
) => {
  for (const key in oldItem) {
    const newValue = newItem[key];
    const oldValue = oldItem[key];
    if (
      typeof newValue === typeof oldValue &&
      typeof newValue === "object" &&
      newValue != null &&
      oldValue != null
    ) {
      diff2(oldValue, newValue, [...path, key], operations);
    } else if (newValue == null) {
      operations.push(unset(key, path));
    }
  }

  for (const key in newItem) {
    const newValue = newItem[key];
    const oldValue = oldItem[key];
    if (
      newValue != null &&
      newValue !== oldValue &&
      (typeof newValue !== typeof oldValue || typeof newValue !== "object")
    ) {
      operations.push(set(key, newValue, path));
    }
  }

  return operations;
};
