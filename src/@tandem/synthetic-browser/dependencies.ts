import { Dependency, Dependencies } from "@tandem/common";
import { syntheticElementClassType } from "./dom";

export class SyntheticMarkupElementClassDependency extends Dependency<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS_PREFIX = "syntheticMarkupElementClass/";

  constructor(readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticMarkupElementClassDependency.getNamespace(tagName), value);
  }

  clone() {
    return new SyntheticMarkupElementClassDependency(this.tagName, this.value);
  }

  static getNamespace(tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, tagName].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SyntheticMarkupElementClassDependency>(this.getNamespace("**"));
  }
}