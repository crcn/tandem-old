import { Action } from "../actions";
import { IActor } from "../actors";
import { Response } from "mesh";
import { IExpression } from "../lang";
import { SyntheticEditAction } from "./actions";

export interface ISynthetic {
  expression: IExpression;
  editor: ISyntheticEditor;
}

export interface ISyntheticEditor extends IActor {

}

export abstract class BaseSyntheticEditor implements IActor {

  private _actions: Array<[SyntheticEditAction, any]>;
  private _ticking: boolean;

  constructor() {
    this._actions = [];
  }

  execute(action: SyntheticEditAction) {
    return new Response((writer) => {
      if (!this._ticking) {
        this._ticking = true;
        requestAnimationFrame(this.flush.bind(this));
      }
      this._actions.push([action, writer]);
      writer.close();
    });
  }

  private flush() {
    this._ticking = false;

    // sort actions based on where the expressions live in the source
    const sortedActions = this._actions.map(([action, writer]) => action).sort((a, b) => a.item.expression.position.start > b.item.expression.position.start ? -1 : 1);
    this._actions = [];
    this.applyEdits(sortedActions);

  }

  protected abstract applyEdits(actions: SyntheticEditAction[]);
}

export * from "./actions";