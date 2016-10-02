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

export function diffArray<T>(a: Array<T>, b: Array<T>, compare: (a: T, b: T) => number|boolean): IArrayChange {
  const update  = [];

  const aPool = a.concat();
  const bPool = b.concat();
  const add   = [];

  for (let i = 0, n = aPool.length; i < n; i++) {
    const av = aPool[i];
    const candidates = [];
    let bestCandidate;
    let bestCandidateScore;

    for (let j = 0, n2 = bPool.length; j < n2; j++) {
      const bv = bPool[j];
      let score;
      if (score = Number(compare(av, bv))) {
        if (!bestCandidate || score > bestCandidateScore) {
          bestCandidate      = bv;
          bestCandidateScore = score;
        }
      }
    }

    if (bestCandidate) {
      aPool.splice(i--, 1);
      n--;
      bPool.splice(bPool.indexOf(bestCandidate), 1);
      update.push([av, bestCandidate, b.indexOf(bestCandidate)]);
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
    to.splice(av.index, 0, av.value);
  }
}