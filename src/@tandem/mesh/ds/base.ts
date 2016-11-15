import { ProxyBus } from "@tandem/mesh/core";
import { DSMessage, DSInsert, DSFind, DSFindAll, DSRemove, DSUpdate } from "./messages";
import { IStreamableDispatcher, DuplexStream, wrapDuplexStream, TransformStream } from "@tandem/mesh/core";

export abstract class BaseDataStore implements IStreamableDispatcher<DSMessage> {
  private _proxy: ProxyBus;

  constructor() {
    this._proxy = new ProxyBus({
      dispatch: (message: DSMessage) => {
        const method = this[message.type];
        if (method) {
          return new DuplexStream((input, output) => {
            wrapDuplexStream(method.call(this, message)).readable.pipeTo(output);
          });
        }
        return DuplexStream.empty();
      }
    });

    this.initialize();
  }

  dispatch(message: DSMessage) {
    return this._proxy.dispatch(message);
  }

  private async initialize() {
    this._proxy.pause();
    await this.connect();
    this._proxy.resume();
  }

  protected async connect() { }

  abstract dsFind(message: DSFind<any>): any;
  abstract dsInsert(message: DSInsert<any>): any;
  abstract dsRemove(message: DSRemove<any>): any;
  abstract dsUpdate(message: DSUpdate<any, any>): any;
}