export function toArray(value) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

export interface IArrayChangeAddition {
  index: number;
  value: any;
}

export interface IArrayChange {
  update: Array<Array<any>>;
  add: Array<IArrayChangeAddition>;
  remove: Array<any>;
}

export function diffArray<T>(a: Array<T>, b: Array<T>, test: (a: T, b: T) => boolean): IArrayChange {
  const update  = [];

  const aPool = a.concat();
  const bPool = b.concat();
  const add   = [];

  for (let i = aPool.length; i--; ) {
    const av = aPool[i];
    for (let j = bPool.length; j--; ) {
      const bv = bPool[j];
      if (test(av, bv)) {
        aPool.splice(i, 1);
        bPool.splice(j, 1);
        update.push([av, bv]);
        break;
      }
    }
  }

  for (const value of bPool) {
    add.push({ index: b.indexOf(value), value: value });
  }

  return {
    add    : add,
    update : update,
    remove : aPool,
  };
}

export function patchArray<T>(to: Array<T>, changes: IArrayChange, patchValue: (a: T, b: T) => T) {
  for (const rm of changes.remove) {
    to.splice(to.indexOf(rm), 1);
  }
  for (const [av, bv] of changes.update) {
    to.splice(to.indexOf(av), 1, patchValue(av, bv));
  }

  for (const av of changes.add) {
    to.splice(av.index, av.value);
  }
}