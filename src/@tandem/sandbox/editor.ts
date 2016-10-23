import { IModule } from "./module";
import {ISyntheticObject } from "./synthetic";
import { Response, Writable } from "mesh";
import { SandboxModuleAction } from "./actions";
import {
  Action,
  IActor,
  Observable,
  IObservable,
  SingletonThenable,
} from "@tandem/common";

/**
 * Batch edit object specific to the module. The methods
 * here may differ depending on the module type.
 */

export interface IModuleEdit {
  readonly actions: Action[];

  /**
   * Removes an expression that is representing a synthetic
   */

  remove(item: ISyntheticObject);
}

/**
 * Editor specific to the module abstract syntax tree since synthetic objects may be produced
 * by different combinations of AST nodes. A JS module for example:
 *
 * document.createElement("div"): SyntheticElement
 *
 * Markup Module example:
 *
 * <div /> : SyntheticElement
 */

export interface IModuleEditor extends IObservable {

  /**
   * batch method for making edits against the module
   */

  edit(onEdit: (edit: IModuleEdit) => any): Promise<void>;
}

export class RemoveSyntheticAction extends Action {
  static readonly REMOVE_SYNTHETIC = "removeSynthetic";
  constructor(readonly item: ISyntheticObject) {
    super(RemoveSyntheticAction.REMOVE_SYNTHETIC);
  }
}

export class BaseSandboxModuleEdit implements IModuleEdit {
  readonly actions: Action[];
  constructor() {
    this.actions = [];
  }
  remove(item: ISyntheticObject) {
    this.actions.push(new RemoveSyntheticAction(item));
  }
}

export abstract class BaseSandboxModuleEditor<T extends IModuleEdit> extends Observable implements IModuleEditor {

  private _ticking: boolean;
  private _edits: Array<[Action, Writable]>;
  private _currentSession: any;
  private _currentEdit: T;

  constructor(readonly module: IModule) {
    super();
  }

  public edit(onEdit: (edit: T) => any) {

    if (!this._currentEdit) {
      this._currentEdit = this.createEdit();
    }

    onEdit(this._currentEdit);

    return this._currentSession || (this._currentSession = new SingletonThenable(() => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const actions = this._currentEdit.actions;
          this._currentEdit    = undefined;
          this._currentSession = undefined;
          this.applyEdits(actions);
        });
      });
    }));
  }

  protected abstract createEdit(): T;
  abstract getFormattedContent(): string;
  protected applyEdits(actions: Action[]) {

    // apply all actions against the source content content
    for (const action of actions) {
      const method = this[action.type];
      if (method) {
        method.call(this, action);
      } else {
        console.warn(`Cannot apply edit "${action.type}".`);
      }
    }

    this.module.content = this.getFormattedContent();
    this.module.notify(new SandboxModuleAction(SandboxModuleAction.EDITED));
  }

  protected abstract removeSynthetic(action: RemoveSyntheticAction);
}