import * as path from "path";
import { Sandbox } from "./sandbox";
import { WrapBus } from "mesh";
import { IModuleEditor } from "./editor";
import { ModuleImporter } from "./importer";
import { SandboxModuleAction } from "./actions";
import { Action, bindable, JS_MIME_TYPE, Observable, IObservable } from "@tandem/common";

export interface IModule extends IObservable {

  exports: any;

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

  reset(): void;

  editor: IModuleEditor;
}

export type sandboxModuleScriptType = (...rest: any[]) => any;

export abstract class BaseSandboxModule extends Observable implements IModule {

  @bindable()
  public content: string;
  readonly editor: IModuleEditor;
  public exports: any;

  protected _script: sandboxModuleScriptType;
  private _evaluated: boolean;

  constructor(readonly fileName: string, content: string, readonly sandbox: Sandbox) {
    super();
    this.content = content;
    this.editor = this.createEditor();
    this.initialize();
  }

  reset() {
    this._evaluated = false;
    this.exports = {};
  }

  protected createEditor(): IModuleEditor {
    return null;
  }

  protected initialize() { }

  abstract load(): Promise<any>|any;

  evaluate() {
    if (this._evaluated) return this.exports;
    this._evaluated = true;
    this.evaluate2();
    return this.exports;
  }

  protected evaluate2() {

  }
}
