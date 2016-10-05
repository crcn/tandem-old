import { Dependency, Dependencies } from "@tandem/common";
import { syntheticElementClassType } from "./dom";

export class SyntheticHTMLElementClassDependency extends Dependency<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS_PREFIX = "syntheticHTMLElementClass/";

  constructor(readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticHTMLElementClassDependency.getNamespace(tagName), value);
  }

  clone() {
    return new SyntheticHTMLElementClassDependency(this.tagName, this.value);
  }

  static getNamespace(tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, tagName].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SyntheticHTMLElementClassDependency>(this.getNamespace("**"));
  }
}