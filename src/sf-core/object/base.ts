export interface IDisposable {
  dispose(): void;
}

export interface INamed {
  readonly name: string;
}
