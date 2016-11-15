import {
  Provider,
  Injector,
  createSingletonProviderClass
} from "@tandem/common";
import { IDispatcher } from "@tandem/mesh";


export class StdinHandlerProvider extends Provider<any> {
  static readonly NS = "stdinHandler";
  constructor(readonly name: string, readonly handle: (value: string) => any, readonly test: (value: string) => boolean) {
    super(StdinHandlerProvider.getId(name), handle);
  }

  clone() {
    return new StdinHandlerProvider(this.name, this.value, this.test);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  static findByInput(input: string, injector: Injector): StdinHandlerProvider {
    for (const handlerProvider of injector.queryAll<StdinHandlerProvider>(this.getId("**"))) {
      if (handlerProvider.test(input)) {
        return handlerProvider;
      }
    }
  }
}

export class DSProvider extends Provider<IDispatcher<any, any>> {
  static readonly ID: string = "ds";
  constructor(value: IDispatcher<any, any>) {
    super(DSProvider.ID, value);
  }
}