import { Dependency, Dependencies } from "@tandem/common";

export class StdinHandlerDependency extends Dependency<any> {
  static readonly NS = "stdinHandler";
  constructor(readonly name: string, readonly handle: (value: string) => any, readonly test: (value: string) => boolean) {
    super(StdinHandlerDependency.getId(name), handle);
  }

  clone() {
    return new StdinHandlerDependency(this.name, this.value, this.test);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  static findByInput(input: string, dependencies: Dependencies): StdinHandlerDependency {
    for (const handlerDependency of dependencies.queryAll<StdinHandlerDependency>(this.getId("**"))) {
      if (handlerDependency.test(input)) {
        return handlerDependency;
      }
    }
  }
}