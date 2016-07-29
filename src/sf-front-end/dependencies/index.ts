import * as React from "react";

import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { IFactory, Dependency, Dependencies } from "sf-core/dependencies";

import { KeyBinding } from "sf-front-end/key-bindings/base";

import { ReactComponentFactoryDependency } from "./base";

export * from "./base";

export const KEY_BINDINGS_NS = "key-bindings";
export class KeyBindingDependency extends Dependency<KeyBinding> {
  constructor(value: KeyBinding) {
    super(`${KEY_BINDINGS_NS}/${value.key}`, value);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<KeyBindingDependency>(`${KEY_BINDINGS_NS}/**`);
  }
}

export const ROOT_COMPONENT_NS = "components/root";
export class RootReactComponentDependency extends ReactComponentFactoryDependency {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ROOT_COMPONENT_NS, componentClass);
  }
  static find(dependencies: Dependencies) {
    return dependencies.query<RootReactComponentDependency>(ROOT_COMPONENT_NS);
  }
}

export const ENTITY_PREVIEW_COMPONENT_NS = "components/preview";
export class EntityPreviewDependency extends ReactComponentFactoryDependency {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ENTITY_PREVIEW_COMPONENT_NS, componentClass);
  }
  static find(dependencies: Dependencies) {
    return dependencies.query<RootReactComponentDependency>(ENTITY_PREVIEW_COMPONENT_NS);
  }
}