import { IActor } from "tandem-common/actors";
import { Response } from "mesh";
import { Action, DS_INSERT, DS_REMOVE, DS_UPDATE, PostDSAction } from "tandem-common/actions";

export class PostDsNotifierBus implements IActor {
  constructor(private _dsBus: IActor, private _mainBus: IActor) { }

  execute(action: Action) {

    if ([DS_INSERT, DS_REMOVE, DS_UPDATE].indexOf(action.type) > -1) {
      return new Response((writable) => {
          (<Response>this._dsBus.execute(action)).pipeTo({
          write: (data) => {
            writable.write(data);
            this._mainBus.execute(PostDSAction.createFromDSAction(<any>action, data));
          },
          close: writable.close.bind(writable),
          abort: writable.abort.bind(writable)
        });
      });
    }

    return this._dsBus.execute(action);
  }
}