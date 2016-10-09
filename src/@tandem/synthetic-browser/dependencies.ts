import { syntheticComponentType } from "./components";
import { SyntheticDOMNode } from "./dom";
import { Dependency, Dependencies } from "@tandem/common";
import { syntheticElementClassType } from "./dom";

export class SyntheticDOMElementClassDependency extends Dependency<syntheticElementClassType> {
  static readonly SYNTHETIC_ELEMENT_CLASS_NS_PREFIX = "syntheticMarkupElementClass/";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticElementClassType) {
    super(SyntheticDOMElementClassDependency.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticDOMElementClassDependency(this.xmlns, this.tagName, this.value);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, encodeURIComponent(xmlns), tagName].join("/");
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<SyntheticDOMElementClassDependency>([this.SYNTHETIC_ELEMENT_CLASS_NS_PREFIX, "**"].join("/"));
  }
}


export class SyntheticDOMNodeComponentClassDependency extends Dependency<syntheticComponentType> {
  static readonly SYNTHETIC_NODE_COMPONENT_NS_PREFIX = "syntheticNodeComponentClass";

  constructor(readonly xmlns: string, readonly tagName: string, value: syntheticComponentType) {
    super(SyntheticDOMNodeComponentClassDependency.getNamespace(xmlns, tagName), value);
  }

  clone() {
    return new SyntheticDOMNodeComponentClassDependency(this.xmlns, this.tagName, this.value);
  }

  create(source: SyntheticDOMNode) {
    return new this.value(source);
  }

  static getNamespace(xmlns: string, tagName: string) {
    return [this.SYNTHETIC_NODE_COMPONENT_NS_PREFIX, encodeURIComponent(xmlns), tagName].join("/");
  }


  static find(source: SyntheticDOMNode, dependencies: Dependencies) {
    return dependencies.query<SyntheticDOMNodeComponentClassDependency>(this.getNamespace(source.namespaceURI, source.nodeName));
  }
  static create(source: SyntheticDOMNode, dependencies: Dependencies) {
    const dependency = this.find(source, dependencies);
    if (!dependency) {
      throw new Error(`Cannot create synthetic DOM component from ${source.namespaceURI}:${source.nodeName}`);
    }
    return dependency.create(source);
  }
}