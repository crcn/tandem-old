import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { Store } from "@tandem/editor/browser/models";
import { IWorkspaceTool } from "@tandem/editor/browser/models";
import { ReactComponentFactoryProvider } from "./base";
import {
  Metadata,
  IFactory,
  IProvider,
  Provider,
  Injector,
  ClassFactoryProvider,
  createSingletonProviderClass,
} from "@tandem/common";

export const GLOBAL_KEY_BINDINGS_NS = "globalKeyBindings";
export class GlobalKeyBindingProvider extends ClassFactoryProvider {
  readonly keys: string[];
  constructor(keys: string|string[], readonly commandClass: { new(...rest: any[]): IActor }) {
    super(`${GLOBAL_KEY_BINDINGS_NS}/${keys}`, commandClass);
    this.keys = Array.isArray(keys) ? keys : [keys];
  }
  clone() {
    return new GlobalKeyBindingProvider(this.keys, this.commandClass);
  }
  static findAll(injector: Injector) {
    return injector.queryAll<GlobalKeyBindingProvider>(`${GLOBAL_KEY_BINDINGS_NS}/**`);
  }
}

export const ENTITY_PREVIEW_COMPONENT_NS = "components/preview";
export class EntityPreviewProvider extends ReactComponentFactoryProvider {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ENTITY_PREVIEW_COMPONENT_NS, componentClass);
  }
  static find(injector: Injector) {
    return injector.query<EntityPreviewProvider>(ENTITY_PREVIEW_COMPONENT_NS);
  }
}

export const EDITOR_TOOL_NS = "editorTool";
export class WorkspaceToolFactoryProvider extends ClassFactoryProvider {
  constructor(readonly name: string, readonly icon: string, readonly editorType: string, readonly keyCommand: string, readonly clazz: { new(editor: any): IWorkspaceTool }) {
    super([EDITOR_TOOL_NS, editorType, name].join("/"), clazz);
  }

  clone() {
    return new WorkspaceToolFactoryProvider(this.name, this.icon, this.editorType, this.keyCommand, this.clazz);
  }

  create(editor: any): IWorkspaceTool {
    return super.create(editor);
  }

  static findAll(editorType: string, injector: Injector) {
    return injector.queryAll<WorkspaceToolFactoryProvider>([EDITOR_TOOL_NS, editorType, "**"].join("/"));
  }

  static find(id: string, editorType: string, injector: Injector) {
    return injector.query<WorkspaceToolFactoryProvider>([EDITOR_TOOL_NS, editorType, id].join("/"));
  }
}

export const ENTITY_PANE_COMPONENT_NS = "components/panes/entity";
export class EntityPaneComponentFactoryProvider extends ReactComponentFactoryProvider {
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super([ENTITY_PANE_COMPONENT_NS, name].join("/"), componentClass);
  }
  clone() {
    return new EntityPaneComponentFactoryProvider(this.name, this.componentClass);
  }
}

export const DOCUMENT_PANE_COMPONENT_NS = "components/panes/document";
export class DocumentPaneComponentFactoryProvider extends ReactComponentFactoryProvider {
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super([DOCUMENT_PANE_COMPONENT_NS, name].join("/"), componentClass);
  }
  clone() {
    return new DocumentPaneComponentFactoryProvider(this.name, this.componentClass);
  }
}

export class StageToolComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS_PREFIX = "components/tools";
  constructor(readonly name: string, readonly toolType: string, readonly componentClass: React.ComponentClass<any>) {
    super(StageToolComponentFactoryProvider.getNamespace(name, toolType), componentClass);
  }

  static getNamespace(name: string, toolType: string) {
    return [this.NS_PREFIX, name, toolType].join("/");
  }

  clone() {
    return new StageToolComponentFactoryProvider(this.name, this.toolType, this.componentClass);
  }
}
export const LAYER_LABEL_COMPONENT = "layerLabelComponent";
export class LayerLabelComponentFactoryProvider extends ReactComponentFactoryProvider {
  constructor(readonly displayType: string, readonly componentClass: React.ComponentClass<any>, readonly childrenProperty: string = "children") {
    super([LAYER_LABEL_COMPONENT, displayType].join("/"), componentClass);
  }
  static find(displayType: string, injector: Injector) {
    return injector.query<LayerLabelComponentFactoryProvider>([LAYER_LABEL_COMPONENT, displayType].join("/"));
  }
  clone() {
    return new LayerLabelComponentFactoryProvider(this.displayType, this.componentClass);
  }
}

/**
 */

export class TokenComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly TOKEN_COMPONENT_FACTORIES_NS = "tokenComponentFactories";
  constructor(readonly tokenType: string, readonly componentClass: React.ComponentClass<any>) {
    super(TokenComponentFactoryProvider.getNamespace(tokenType), componentClass);
  }

  static getNamespace(tokenType: string) {
    return [TokenComponentFactoryProvider.TOKEN_COMPONENT_FACTORIES_NS, tokenType].join("/");
  }

  static find(tokenType: string, injector: Injector) {
    return injector.query<TokenComponentFactoryProvider>(this.getNamespace(tokenType));
  }
  clone() {
    return new TokenComponentFactoryProvider(this.tokenType, this.componentClass);
  }
}

export class FooterComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS_PREFIX = "footerComponentFactories";
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super(FooterComponentFactoryProvider.getNamespace(name), componentClass);
  }
  static getNamespace(name: string) {
    return [FooterComponentFactoryProvider.NS_PREFIX, name].join("/");
  }
  static find(name: string, injector: Injector) {
    return injector.query<FooterComponentFactoryProvider>(this.getNamespace(name));
  }
  clone() {
    return new FooterComponentFactoryProvider(this.name, this.componentClass);
  }
}

export const StoreProvider = createSingletonProviderClass<Store>("store");

export * from "./base";