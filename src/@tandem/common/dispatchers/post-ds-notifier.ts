import { IDispatcher, DSInsert, DSRemove, DSUpdate, IBus, DuplexStream, WritableStream, TransformStream } from "@tandem/mesh";
import { Action, PostDSAction } from "@tandem/common/actions";

export class PostDsNotifierBus implements IBus<any> {
  constructor(private _dsBus: IBus<any>, private _dispatcher: IDispatcher<any, any>) { }

  dispatch(action: Action) {

    if ([DSInsert.DS_INSERT, DSRemove.DS_REMOVE, DSUpdate.DS_UPDATE].indexOf(action.type) > -1) {
      return new DuplexStream((input, output) => {
        const writer = output.getWriter();
        this._dsBus.dispatch(action).readable.pipeTo(new WritableStream({
          write: (chunk) => {
            writer.write(chunk);
            this._dispatcher.dispatch(PostDSAction.createFromDSAction(<any>action, chunk));
          }
        })).then(writer.close.bind(writer)).catch(writer.abort.bind(writer));
      });
    }

    return this._dsBus.dispatch(action);
  }
}