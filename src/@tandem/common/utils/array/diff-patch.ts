export interface IArrayChangeAddition {
  index: number;
  value: any;
}

export enum DiffKind {
  REMOVE = 0,
  INSERT = REMOVE + 1,
  UPDATE = UPDATE + 1
}

export interface IArrayDiffChange {
  readonly kind: DiffKind;
  accept(visitor: IArrayDiffVisitor<any>);
}

export class ArrayDiffInsert<T>  implements IArrayDiffChange {
  readonly kind = DiffKind.INSERT;
  constructor(readonly index: number, readonly value: T) { }
  accept(visitor: IArrayDiffVisitor<T>) {
    visitor.visitInsert(this);
  }
}

export class ArrayDiffRemove {
  readonly kind = DiffKind.REMOVE;
  constructor(readonly index: number) { }
  accept(visitor: IArrayDiffVisitor<any>) {
    visitor.visitRemove(this);
  }
}

export class ArrayDiffUpdate<T> {
  readonly kind = DiffKind.UPDATE;
  constructor(readonly originalOldIndex: number, readonly patchedOldIndex: number, readonly newValue: T, readonly newIndex: number) { }
  accept(visitor: IArrayDiffVisitor<T>) {
    visitor.visitUpdate(this);
  }
}

export interface IArrayDiffVisitor<T> {
  visitRemove(del: ArrayDiffRemove);
  visitInsert(insert: ArrayDiffInsert<T>);
  visitUpdate(update: ArrayDiffUpdate<T>);
}

export class ArrayDiff<T> {

  readonly count: number;

  constructor(
    readonly changes: IArrayDiffChange[],
  ) {
    this.count = changes.length;
  }

  accept(visitor: IArrayDiffVisitor<T>) {
    this.changes.forEach(change => change.accept(visitor));
  }
}

export function diffArray<T>(oldArray: Array<T>, newArray: Array<T>, countDiffs: (a: T, b: T) => number): ArrayDiff<T> {

  // model used to figure out the proper mutation indices
  const model    = [].concat(oldArray);

  // remaining old values to be matched with new values. Remainders get deleted.
  const oldPool  = [].concat(oldArray);

  // remaining new values. Remainders get inserted.
  const newPool  = [].concat(newArray);

  const changes: IArrayDiffChange[] = [];
  let   matches: Array<[T, T]>        = [];

  for (let i = 0, n = oldPool.length; i < n; i++) {

    const oldValue = oldPool[i];
    let bestNewValue;

    let fewestDiffCount = Infinity;

    // there may be multiple matches, so look for the best one
    for (let j = 0, n2 = newPool.length; j < n2; j++) {

      const newValue   = newPool[j];

      // -1 = no match, 0 = no change, > 0 = num diffs
      let diffCount = countDiffs(oldValue, newValue);

      if (~diffCount && diffCount < fewestDiffCount) {
        bestNewValue    = newValue;
        fewestDiffCount = diffCount;
      }

      // 0 = exact match, so break here.
      if (fewestDiffCount === 0) break;
    }

    // subtract matches from both old & new pools and store
    // them for later use
    if (bestNewValue) {
      oldPool.splice(i--, 1);
      n--;
      newPool.splice(newPool.indexOf(bestNewValue), 1);

      // need to manually set array indice here to ensure that the order
      // of operations is correct when mutating the target array.
      matches[newArray.indexOf(bestNewValue)] = [oldValue, bestNewValue];
    }
  }

  for (let i = 0, n = oldPool.length; i < n; i++) {
    const oldValue  = oldPool[i];
    const index     = oldArray.indexOf(oldValue);
    changes.push(new ArrayDiffRemove(index));
    model.splice(index, 1);
  }

  // sneak the inserts into the matches so that they're
  // ordered propertly along with the updates - particularly moves.
  for (let i = 0, n = newPool.length; i < n; i++) {
    const newValue = newPool[i];
    const index    = newArray.indexOf(newValue);
    matches[index] = [undefined, newValue];
  }

  // apply updates last using indicies from the old array model. This ensures
  // that mutations are properly applied to whatever target array.
  for (let i = 0, n = matches.length; i < n; i++) {
    const match = matches[i];

    // there will be empty values since we're manually setting indices on the array above
    if (match == null) continue;

    const [oldValue, newValue] = matches[i];
    const newIndex = i;

    // insert
    if (oldValue == null) {
      changes.push(new ArrayDiffInsert(newIndex, newValue));
      model.splice(newIndex, 0, newValue);
    // updated
    } else {
      const oldIndex = model.indexOf(oldValue);
      changes.push(new ArrayDiffUpdate(oldArray.indexOf(oldValue), oldIndex, newValue, newIndex));
      if (oldIndex !== newIndex) {
        model.splice(oldIndex, 1);
        model.splice(newIndex, 0, oldValue);
      }
    }
  }

  return new ArrayDiff(changes);
}

export function patchArray<T>(target: Array<T>, diff: ArrayDiff<T>, mapUpdate: (a: T, b: T) => T, mapInsert?: (b: T) => T) {
  diff.accept({
    visitInsert({ index, value }) {
      target.splice(index, 0, mapInsert(value));
    },
    visitRemove({ index }) {
      target.splice(index, 1);
    },
    visitUpdate({ patchedOldIndex, newValue, newIndex }) {
      const oldValue     = target[patchedOldIndex];
      const patchedValue = mapUpdate(oldValue, newValue);
      if (patchedValue !== oldValue || patchedOldIndex !== newIndex) {
        if (patchedOldIndex !== newIndex) {
          target.splice(patchedOldIndex, 1);
        }
        target.splice(newIndex, 0, patchedValue);
      }
    }
  });
}