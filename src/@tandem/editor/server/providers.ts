import { Provider, Dependencies } from "@tandem/common";

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

  static findByInput(input: string, dependencies: Dependencies): StdinHandlerProvider {
    for (const handlerProvider of dependencies.queryAll<StdinHandlerProvider>(this.getId("**"))) {
      if (handlerProvider.test(input)) {
        return handlerProvider;
      }
    }
  }
}