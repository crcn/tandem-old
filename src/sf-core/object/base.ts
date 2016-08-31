export interface IDisposable {
  dispose(): void;
}

export interface INamed {
  readonly name: string;
}

export interface ICloneable {
  clone(): ICloneable;
}

export interface IOwnable {
  readonly owner: any;
}

