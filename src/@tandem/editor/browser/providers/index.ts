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

export class GlobalKeyBindingProvider extends ClassFactoryProvider {
  static readonly NS = "globalKeyBindings";
  readonly keys: string[];
  constructor(keys: string|string[], readonly commandClass: { new(...rest: any[]): IActor }) {
    super(`${GlobalKeyBindingProvider.NS}/${keys}`, commandClass);
    this.keys = Array.isArray(keys) ? keys : [keys];
  }
  clone() {
    return new GlobalKeyBindingProvider(this.keys, this.commandClass);
  }
  static findAll(injector: Injector) {
    return injector.queryAll<GlobalKeyBindingProvider>(`${GlobalKeyBindingProvider.NS}/**`);
  }
}

export class WorkspaceToolFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "editorTool";
  constructor(readonly name: string, readonly icon: string, readonly editorType: string, readonly keyCommand: string, readonly clazz: { new(editor: any): IWorkspaceTool }) {
    super([WorkspaceToolFactoryProvider.NS, editorType, name].join("/"), clazz);
  }

  clone() {
    return new WorkspaceToolFactoryProvider(this.name, this.icon, this.editorType, this.keyCommand, this.clazz);
  }

  create(editor: any): IWorkspaceTool {
    return super.create(editor);
  }

  static findAll(editorType: string, injector: Injector) {
    return injector.queryAll<WorkspaceToolFactoryProvider>([WorkspaceToolFactoryProvider.NS, editorType, "**"].join("/"));
  }

  static find(id: string, editorType: string, injector: Injector) {
    return injector.query<WorkspaceToolFactoryProvider>([WorkspaceToolFactoryProvider.NS, editorType, id].join("/"));
  }
}

export class EntityPaneComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "components/panes/entity";
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super(EntityPaneComponentFactoryProvider.getId(name), componentClass);
  }
  clone() {
    return new EntityPaneComponentFactoryProvider(this.name, this.componentClass);
  }
  static getId(name) {
    return [EntityPaneComponentFactoryProvider.NS, name].join("/");
  }
}

export class DocumentPaneComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "components/panes/document";
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super(DocumentPaneComponentFactoryProvider.getId(name), componentClass);
  }
  clone() {
    return new DocumentPaneComponentFactoryProvider(this.name, this.componentClass);
  }
  static getId(name) {
    return [DocumentPaneComponentFactoryProvider.NS, name].join("/");
  }
}

export class StageToolComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "components/tools";
  constructor(readonly name: string, readonly toolType: string, readonly componentClass: React.ComponentClass<any>) {
    super(StageToolComponentFactoryProvider.getNamespace(name, toolType), componentClass);
  }

  static getNamespace(name: string, toolType: string) {
    return [this.NS, name, toolType].join("/");
  }

  clone() {
    return new StageToolComponentFactoryProvider(this.name, this.toolType, this.componentClass);
  }
}
export class LayerLabelComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "layerLabelComponent";
  constructor(readonly displayType: string, readonly componentClass: React.ComponentClass<any>, readonly childrenProperty: string = "children") {
    super([LayerLabelComponentFactoryProvider.NS, displayType].join("/"), componentClass);
  }
  static find(displayType: string, injector: Injector) {
    return injector.query<LayerLabelComponentFactoryProvider>([LayerLabelComponentFactoryProvider.NS, displayType].join("/"));
  }
  clone() {
    return new LayerLabelComponentFactoryProvider(this.displayType, this.componentClass);
  }
}

/**
 */

export class TokenComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "tokenComponentFactories";
  constructor(readonly tokenType: string, readonly componentClass: React.ComponentClass<any>) {
    super(TokenComponentFactoryProvider.getNamespace(tokenType), componentClass);
  }

  static getNamespace(tokenType: string) {
    return [TokenComponentFactoryProvider.NS, tokenType].join("/");
  }

  static find(tokenType: string, injector: Injector) {
    return injector.query<TokenComponentFactoryProvider>(this.getNamespace(tokenType));
  }
  clone() {
    return new TokenComponentFactoryProvider(this.tokenType, this.componentClass);
  }
}

export class FooterComponentFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "footerComponentFactories";
  constructor(readonly name: string, readonly componentClass: React.ComponentClass<any>) {
    super(FooterComponentFactoryProvider.getNamespace(name), componentClass);
  }
  static getNamespace(name: string) {
    return [FooterComponentFactoryProvider.NS, name].join("/");
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