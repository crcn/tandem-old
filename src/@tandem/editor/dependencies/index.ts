import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { IApplication } from "@tandem/common/application";
import { IEditor, IEditorTool } from "@tandem/editor/models";
import { ReactComponentFactoryDependency } from "./base";
import { IFactory, Dependency, Dependencies, ClassFactoryDependency } from "@tandem/common/dependencies";

export * from "./base";

export const GLOBAL_KEY_BINDINGS_NS = "global-key-bindings";
export class GlobalKeyBindingDependency extends ClassFactoryDependency {
  constructor(readonly key: string | Array<string>, readonly commandClass: { new(...rest: any[]): IActor }) {
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
  constructor(readonly name: string, readonly icon: string, readonly editorType: string, readonly keyCommand: string, readonly clazz: { new(editor: IEditor): IEditorTool }) {
    super([EDITOR_TOOL_NS, editorType, name].join("/"), clazz);
  }

  clone() {
    return new EditorToolFactoryDependency(this.name, this.icon, this.editorType, this.keyCommand, this.clazz);
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