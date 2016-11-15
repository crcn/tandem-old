import { IBus, DuplexStream, WritableStream } from "@tandem/mesh";
import { Action, DSInsertAction, DSRemoveAction, DSUpdateAction, PostDSAction } from "@tandem/common/actions";

export class PostDsNotifierBus implements IBus<any> {
  constructor(private _dsBus: IBus<any>, private _mainBus: IBus<any>) { }

  dispatch(action: Action) {

    if ([DSInsertAction.DS_INSERT, DSRemoveAction.DS_REMOVE, DSUpdateAction.DS_UPDATE].indexOf(action.type) > -1) {
      return new DuplexStream((input, output) => {
        const writer = output.getWriter();
        this._dsBus.dispatch(action).readable.pipeTo(new WritableStream({
          write: (chunk) => {
            writer.write(chunk);
            this._mainBus.dispatch(PostDSAction.createFromDSAction(<any>action, chunk));
          }
        })).then(writer.close.bind(writer)).catch(writer.abort.bind(writer));
      });
    }

    return this._dsBus.dispatch(action);
  }
}