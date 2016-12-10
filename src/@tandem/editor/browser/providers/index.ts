import React =  require("react");
import { EditorStore } from "@tandem/editor/browser/stores";
import { IDispatcher } from "@tandem/mesh";
import {createMenuSeparatorClass } from "../menus";
import { IWorkspaceTool } from "@tandem/editor/browser/stores";
import { ReactComponentFactoryProvider } from "./base";
import { IRouteHandler } from "../stores/router"; 
import {
  Metadata,
  IFactory,
  IProvider,
  ICommand,
  Provider,
  Injector,
  StoreProvider,
  ClassFactoryProvider,
  createSingletonProviderClass,
} from "@tandem/common";

import { WebMenuItem } from "../menus";

export class GlobalKeyBindingProvider extends ClassFactoryProvider {
  static readonly NS = "globalKeyBindings";
  readonly keys: string[];
  constructor(keys: string|string[], readonly commandClass: { new(...rest: any[]): ICommand }) {
    super(`${GlobalKeyBindingProvider.NS}/${keys}`, commandClass);
    this.keys = Array.isArray(keys) ? keys : [keys];
  }
  create(): ICommand {
    return super.create();
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
  constructor(readonly name: string, readonly componentClass: any) {
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
  constructor(readonly name: string, readonly componentClass: any, readonly priority?: number) {
    super(DocumentPaneComponentFactoryProvider.getId(name), componentClass, priority);
  }
  clone() {
    return new DocumentPaneComponentFactoryProvider(this.name, this.componentClass, this.priority);
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

export class EditorStoreProvider extends StoreProvider {
  static readonly NAME = "editorStore";
  static readonly ID = StoreProvider.getId(EditorStoreProvider.NAME);
  constructor(clazz: { new(): EditorStore }) {
    super(EditorStoreProvider.NAME, clazz);
  }
}

export class RouteFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "routeFactories";

  constructor(readonly name: string, readonly path: string, readonly routeClass: { new(): IRouteHandler }) {
    super(RouteFactoryProvider.getId(name), routeClass);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  create(): IRouteHandler {
    return super.create();
  }

  clone() {
    return new RouteFactoryProvider(this.name, this.path, this.routeClass);
  }
  
  testPath(path: string) {

    // exact for now
    return this.path === path || this.name === path;
  }

  static findByPath(path: string, injector: Injector) {  
    return injector.queryAll<RouteFactoryProvider>(this.getId("**")).find((provider) => {
      return provider.testPath(path);
    })
  }
} 

export class PageFactoryProvider extends ReactComponentFactoryProvider {
  static readonly NS = "pageComponents";

  constructor(readonly pageName: string, readonly routeClass: any) {
    super(PageFactoryProvider.getId(pageName), routeClass);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }
} 


let i = 0;

export class WebMenuItemFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "menuItems";
  constructor(readonly name: string, readonly parentTester: any, readonly WebMenuItemClass: { new(name: string): WebMenuItem }) {
    super(WebMenuItemFactoryProvider.getId(name), WebMenuItemClass);
  }

  clone() {
    return new WebMenuItemFactoryProvider(this.name, this.parentTester, this.WebMenuItemClass);
  }

  create() {
    return super.create(this.name);
  }

  testParent(parent: WebMenuItem) {
    if (typeof this.parentTester === "string") {
      return this.parentTester === parent.name;
    }
    return this.parentTester(parent);
  }

  static createSeparatorProvider(parent: string) {
    return new WebMenuItemFactoryProvider(`sep${i++}`, parent, createMenuSeparatorClass());
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  static createSubWebMenuItems(parent: WebMenuItem, injector: Injector): WebMenuItem[] {
    return injector.queryAll<WebMenuItemFactoryProvider>(this.getId("**")).filter((provider) => {
      return provider.testParent(parent);
    }).map((provider) => {
      return provider.create();
    });
  }
} 

export * from "./base";