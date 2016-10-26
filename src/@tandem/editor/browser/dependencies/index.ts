import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { Store } from "@tandem/editor/browser/models";
import { IApplication } from "@tandem/common/application";
import { IWorkspace, IWorkspaceTool } from "@tandem/editor/browser/models";
import { ReactComponentFactoryDependency } from "./base";
import {
  Metadata,
  IFactory,
  Dependency,
  Dependencies,
  ClassFactoryDependency,
  createSingletonDependencyClass,
} from "@tandem/common";

export const GLOBAL_KEY_BINDINGS_NS = "globalKeyBindings";
export class GlobalKeyBindingDependency extends ClassFactoryDependency {
  readonly keys: string[];
  constructor(keys: string|string[], readonly commandClass: { new(...rest: any[]): IActor }) {
    super(`${GLOBAL_KEY_BINDINGS_NS}/${keys}`, commandClass);
    this.keys = Array.isArray(keys) ? keys : [keys];
  }
  clone() {
    return new GlobalKeyBindingDependency(this.keys, this.commandClass);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<GlobalKeyBindingDependency>(`${GLOBAL_KEY_BINDINGS_NS}/**`);
  }
}

export const ENTITY_PREVIEW_COMPONENT_NS = "components/preview";
export class EntityPreviewDependency extends ReactComponentFactoryDependency {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ENTITY_PREVIEW_COMPONENT_NS, componentClass);
  }
  static find(dependencies: Dependencies) {
    return dependencies.query<EntityPreviewDependency>(ENTITY_PREVIEW_COMPONENT_NS);
  }
}

export const EDITOR_TOOL_NS = "editorTool";
export class WorkspaceToolFactoryDependency extends ClassFactoryDependency {
  constructor(readonly name: string, readonly icon: string, readonly editorType: string, readonly keyCommand: string, readonly clazz: { new(editor: IWorkspace): IWorkspaceTool }) {
    super([EDITOR_TOOL_NS, editorType, name].join("/"), clazz);
  }

  clone() {
    return new WorkspaceToolFactoryDependency(this.name, this.icon, this.editorType, this.keyCommand, this.clazz);
  }

  create(editor: IWorkspace): IWorkspaceTool {
    return super.create(editor);
  }

  static findAll(editorType: string, dependencies: Dependencies) {
    return dependencies.queryAll<WorkspaceToolFactoryDependency>([EDITOR_TOOL_NS, editorType, "**"].join("/"));
  }

  static find(id: string, editorType: string, dependencies: Dependencies) {
    return dependencies.query<WorkspaceToolFactoryDependency>([EDITOR_TOOL_NS, editorType, id].join("/"));
  }
}

export const ENTITY_PANE_COMPONENT_NS = "components/panes/entity";
export class EntityPaneComponentFactoryDependency extends ReactComponentFactoryDependency {
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super([ENTITY_PANE_COMPONENT_NS, name].join("/"), componentClass);
  }
  clone() {
    return new EntityPaneComponentFactoryDependency(this.name, this.componentClass);
  }
}

export const DOCUMENT_PANE_COMPONENT_NS = "components/panes/document";
export class DocumentPaneComponentFactoryDependency extends ReactComponentFactoryDependency {
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super([DOCUMENT_PANE_COMPONENT_NS, name].join("/"), componentClass);
  }
  clone() {
    return new DocumentPaneComponentFactoryDependency(this.name, this.componentClass);
  }
}

export class StageToolComponentFactoryDependency extends ReactComponentFactoryDependency {
  static readonly NS_PREFIX = "components/tools";
  constructor(readonly name: string, readonly toolType: string, readonly componentClass: React.ComponentClass<any>) {
    super(StageToolComponentFactoryDependency.getNamespace(name, toolType), componentClass);
  }

  static getNamespace(name: string, toolType: string) {
    return [this.NS_PREFIX, name, toolType].join("/");
  }

  clone() {
    return new StageToolComponentFactoryDependency(this.name, this.toolType, this.componentClass);
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

/**
 */

export class TokenComponentFactoryDependency extends ReactComponentFactoryDependency {
  static readonly TOKEN_COMPONENT_FACTORIES_NS = "tokenComponentFactories";
  constructor(readonly tokenType: string, readonly componentClass: React.ComponentClass<any>) {
    super(TokenComponentFactoryDependency.getNamespace(tokenType), componentClass);
  }

  static getNamespace(tokenType: string) {
    return [TokenComponentFactoryDependency.TOKEN_COMPONENT_FACTORIES_NS, tokenType].join("/");
  }

  static find(tokenType: string, dependencies: Dependencies) {
    return dependencies.query<TokenComponentFactoryDependency>(this.getNamespace(tokenType));
  }
  clone() {
    return new TokenComponentFactoryDependency(this.tokenType, this.componentClass);
  }
}

export class FooterComponentFactoryDependency extends ReactComponentFactoryDependency {
  static readonly NS_PREFIX = "footerComponentFactories";
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super(FooterComponentFactoryDependency.getNamespace(name), componentClass);
  }
  static getNamespace(name: string) {
    return [FooterComponentFactoryDependency.NS_PREFIX, name].join("/");
  }
  static find(name: string, dependencies: Dependencies) {
    return dependencies.query<FooterComponentFactoryDependency>(this.getNamespace(name));
  }
  clone() {
    return new FooterComponentFactoryDependency(this.name, this.componentClass);
  }
}

export const StoreDependency = createSingletonDependencyClass("store", Store);

export * from "./base";