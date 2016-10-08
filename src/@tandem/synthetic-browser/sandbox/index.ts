import { BaseModule, ModuleFactoryDependency } from "@tandem/sandbox";
import { evaluateMarkup, parseMarkup, SyntheticWindow } from "../dom";
import { spliceChunk, getChunk } from "@tandem/common";

export class MarkupModule extends BaseModule {

  createEditor() {
    return {};
  }

  compile() {
    return Promise.resolve(() => {
      return evaluateMarkup(parseMarkup(this.content), (<SyntheticWindow>this.sandbox.global).document, null);
    });
  }
}