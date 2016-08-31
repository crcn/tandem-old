export interface IDisposable {
  dispose(): void;
}

export interface INamed {
  readonly name: string;
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

