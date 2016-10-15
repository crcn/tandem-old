import * as path from "path";
import { Sandbox } from "./sandbox";
import { WrapBus } from "mesh";
import { IModuleEditor } from "./editor";
import { ModuleImporter } from "./importer";
import { SandboxModuleAction } from "./actions";
import { Action, bindable, JS_MIME_TYPE, Observable, IObservable } from "@tandem/common";

export interface IModule extends IObservable {

  /**
   * File name associated with the module
   */

  fileName: string;

  sandbox: Sandbox;

  /**
   * The source content
   */

  content: string;

  /**
   * Loads the module along with all dependencies
   */

  load(): Promise<any>|any;

  evaluate(): any;

  editor?: IModuleEditor;
}

export type sandboxModuleScriptType = (...rest: any[]) => any;

export abstract class BaseSandboxModule extends Observable implements IModule {

  @bindable()
  public content: string;

  constructor(readonly fileName: string, content: string, readonly sandbox: Sandbox) {
    super();
    this.content = content;
    this.initialize();
  }

  protected initialize() { }

  abstract load(): Promise<any>|any;
  abstract evaluate(): any;
}
