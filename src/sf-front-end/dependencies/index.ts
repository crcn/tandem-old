import * as React from "react";

import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/entities";
import { IApplication } from "sf-core/application";
import { IFactory, Dependency, Dependencies, ClassFactoryDependency } from "sf-core/dependencies";

import { IEditor, IEditorTool } from "sf-front-end/models";

import { ReactComponentFactoryDependency } from "./base";

export * from "./base";

export const GLOBAL_KEY_BINDINGS_NS = "global-key-bindings";
export class GlobalKeyBindingDependency extends ClassFactoryDependency {
  constructor(readonly key: string, readonly commandClass: { new(): IActor }) {
    super(`${GLOBAL_KEY_BINDINGS_NS}/${key}`, commandClass);
  }
  clone() {
    return new GlobalKeyBindingDependency(this.key, this.commandClass);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<GlobalKeyBindingDependency>(`${GLOBAL_KEY_BINDINGS_NS}/**`);
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
  constructor(readonly id: string, readonly icon: string, readonly editorType: string, readonly clazz: { new(editor: IEditor): IEditorTool }) {
    super([EDITOR_TOOL_NS, editorType, id].join("/"), clazz);
  }

  clone() {
    return new EditorToolFactoryDependency(this.id, this.icon, this.editorType, this.clazz);
  }

  create(editor: IEditor): IEditorTool {
    return super.create(editor);
  }

  static findAll(editorType: string, dependencies: Dependencies) {
    return dependencies.queryAll<EditorToolFactoryDependency>([EDITOR_TOOL_NS, editorType, "**"].join("/"));
  }

  static find(id: string, editorType: string, dependencies: Dependencies) {
    return dependencies.query<EditorToolFactoryDependency>([EDITOR_TOOL_NS, editorType, id].join("/"));
  }
}