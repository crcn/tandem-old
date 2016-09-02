import * as React from "react";
import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/ast/entities";
import { IApplication } from "sf-core/application";
import { IEditor, IEditorTool } from "sf-front-end/models";
import { ReactComponentFactoryDependency } from "./base";
import { IFactory, Dependency, Dependencies, ClassFactoryDependency } from "sf-core/dependencies";

export * from "./base";

export const GLOBAL_KEY_BINDINGS_NS = "global-key-bindings";
export class GlobalKeyBindingDependency extends ClassFactoryDependency {
  constructor(readonly key: string | Array<string>, readonly commandClass: { new(): IActor }) {
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

export const EDITOR_TOOL_NS = "editorTool";
export class EditorToolFactoryDependency extends ClassFactoryDependency {
  constructor(readonly id: string, readonly icon: string, readonly editorType: string, readonly keyCommand: string, readonly clazz: { new(editor: IEditor): IEditorTool }) {
    super([EDITOR_TOOL_NS, editorType, id].join("/"), clazz);
  }

  clone() {
    return new EditorToolFactoryDependency(this.id, this.icon, this.editorType, this.keyCommand, this.clazz);
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

export const ENTITY_PANE_COMPONENT_NS = "components/panes/entity";
export class EntityPaneComponentFactoryDependency extends ReactComponentFactoryDependency {
  constructor(readonly id: string, readonly componentClass: React.ComponentClass<any>) {
    super([ENTITY_PANE_COMPONENT_NS, id].join("/"), componentClass);
  }
  clone() {
    return new EntityPaneComponentFactoryDependency(this.id, this.componentClass);
  }
}

export const DOCUMENT_PANE_COMPONENT_NS = "components/panes/document";
export class DocumentPaneComponentFactoryDependency extends ReactComponentFactoryDependency {
  constructor(readonly id: string, readonly componentClass: React.ComponentClass<any>) {
    super([DOCUMENT_PANE_COMPONENT_NS, id].join("/"), componentClass);
  }
  clone() {
    return new DocumentPaneComponentFactoryDependency(this.id, this.componentClass);
  }
}

export const LAYER_LABEL_COMPONENT = "layerLabelComponent";
export class LayerLabelComponentFactoryDependency extends ReactComponentFactoryDependency {
  constructor(readonly displayType: string, readonly componentClass: React.ComponentClass<any>, readonly childrenProperty: string = "children") {
    super([LAYER_LABEL_COMPONENT, displayType].join("/"), componentClass);
  }
  static find(displayType: string, dependencies: Dependencies) {
    return dependencies.query<LayerLabelComponentFactoryDependency>([LAYER_LABEL_COMPONENT, displayType].join("/"));
  }
  clone() {
    return new LayerLabelComponentFactoryDependency(this.displayType, this.componentClass);
  }
}