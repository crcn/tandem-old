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
  evaluate(): Promise<any>;
  editor: IModuleEditor;
}

export type sandboxModuleScriptType = (...rest: any[]) => any;

export abstract class BaseSandboxModule extends Observable implements IModule {

  @bindable()
  public content: string;
  readonly editor: IModuleEditor;

  protected _script: sandboxModuleScriptType;

  constructor(readonly fileName: string, content: string, readonly sandbox: Sandbox) {
    super();
    this.content = content;
    this.editor = this.createEditor();
    this.initialize();
  }

  protected createEditor(): IModuleEditor {
    return null;
  }

  protected initialize() { }

  async evaluate() {
    const run = await this.getScript();
    return await run();
  }

  protected abstract compile(): Promise<sandboxModuleScriptType>|sandboxModuleScriptType;

  protected async getScript() {
    if (this._script) return this._script;
    const run = await this.compile();
    return this._script = (...rest: any[]) => {
      this.notify(new SandboxModuleAction(SandboxModuleAction.EVALUATING));
      return run(...rest);
    };
  }
}
