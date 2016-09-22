export interface IModule {
  evaluate(context: any): any;
}

export abstract class BaseModule<T extends any> {
  constructor(private _content: string) {

  }

  abstract evaluate(context: any): T
}