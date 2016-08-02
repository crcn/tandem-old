import * as React from "react";

import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/entities";
import { IApplication } from "sf-core/application";
import { IFactory, Dependency, Dependencies, ClassFactoryDependency } from "sf-core/dependencies";

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

export const SELECTION_FACTORY_NS = "selection";
type entitySelectionType = { new(...items: Array<IEntity>): Array<IEntity> };
export class SelectionFactoryDependency extends ClassFactoryDependency {
  constructor(entityType: string, collectionClass: entitySelectionType) {
    super([SELECTION_FACTORY_NS, entityType].join("/"), collectionClass);
  }
  create(...selection: Array<IEntity>): Array<IEntity> {
    return super.create(...selection);
  }
  static find(entityType: string, dependencies: Dependencies): SelectionFactoryDependency {
    return dependencies.query<SelectionFactoryDependency>([SELECTION_FACTORY_NS, entityType].join("/"));
  }
}

export const EDITOR_TOOL_NS = "editorTool";
export class EditorToolFactoryDependency extends ClassFactoryDependency {
  constructor(id: string, clazz: { new(): IActor }) {
    super([EDITOR_TOOL_NS, id].join("/"), clazz);
  }
  create(): IActor {
    return super.create();
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<EditorToolFactoryDependency>([EDITOR_TOOL_NS, "**"].join("/"));
  }
}