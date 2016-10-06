import { Dependency, Dependencies } from "@tandem/common";
import { syntheticElementClassType } from "./dom";

export class SyntheticMarkupElementClassDependency extends Dependency<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS_PREFIX = "syntheticMarkupElementClass/";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticMarkupElementClassDependency.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticMarkupElementClassDependency(this.xmlns, this.tagName, this.value);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, encodeURIComponent(xmlns), tagName].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SyntheticMarkupElementClassDependency>([this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, "**"].join("/"));
  }
}