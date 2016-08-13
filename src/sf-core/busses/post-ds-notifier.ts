import { IActor } from "sf-core/actors";
import { Response } from "mesh";
import { Action, INSERT, REMOVE, UPDATE, PostDBAction } from "sf-core/actions";

export class PostDsNotifierBus implements IActor {
  constructor(private _dsBus: IActor, private _mainBus: IActor) { }

  execute(action: Action) {

    if ([INSERT, REMOVE, UPDATE].indexOf(action.type) > -1) {
      return new Response((writable) => {
          (<Response>this._dsBus.execute(action)).pipeTo({
          write: (data) => {
            writable.write(data);
            this._mainBus.execute(PostDBAction.createFromDBAction(<any>action, data));
          },
          close: writable.close.bind(writable),
          abort: writable.abort.bind(writable)
        });
      });
    }

    return this._dsBus.execute(action);
  }
}