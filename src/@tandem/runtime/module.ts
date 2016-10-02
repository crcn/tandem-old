import { SymbolTable, ISynthetic } from "./synthetic";

export interface IModule {
  readonly fileName: string;
  evaluate(context: SymbolTable): any;
}

export abstract class BaseModule<T extends ISynthetic> {
  constructor(readonly fileName: string, protected _content: string) {

  }

  abstract evaluate(context: SymbolTable): T
}