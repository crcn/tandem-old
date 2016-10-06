import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";
import { evaluateMarkup, parseMarkup, SyntheticWindow } from "../dom";

export class MarkupModule extends BaseModule {
  async evaluate() {
    return evaluateMarkup(parseMarkup(this.content), (<SyntheticWindow>this.sandbox.global).document);
  }
}
