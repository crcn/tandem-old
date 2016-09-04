
// performs cleanup of object for GC
export interface IDisposable {
  dispose(): void;
}

export interface IRemovable {
  remove(): void;
}

export interface INamed {
  readonly name: string;
}

export interface ITyped {
  readonly type: string;
}

export interface IValued {
  value: any;
}

export interface ICloneable {
  clone(): ICloneable;
}

export interface IOwnable {
  readonly owner: any;
}

export interface IComparable {
  compare(node: IComparable): number;
}

export interface IPatchable {
  patch(node: IPatchable);
}

