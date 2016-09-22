import { IFileSystem } from "./file-system";

export namespace EnvironmentKind {
  export const JavaScript = 1;
  export const DOM = JavaScript + 1;
  export const CSS = DOM + 1;
}

export interface IEnvironment {
  kind: number;
}

export abstract class BaseEnvironment implements IEnvironment {
  abstract kind: number;
  constructor(protected readonly _fileSystem: IFileSystem) {

  }
}

export class JavaScriptEnvironment extends BaseEnvironment {
  readonly kind = EnvironmentKind.JavaScript;
}

export class DOMEnvironment extends JavaScriptEnvironment {
  readonly kind = EnvironmentKind.DOM;
  readonly document: any;
}