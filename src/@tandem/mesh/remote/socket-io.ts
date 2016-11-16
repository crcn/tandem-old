import { ISerializer } from "@tandem/common";
import { IBus, RemoteBus, DuplexStream } from "@tandem/mesh/core";

export interface ISocketIOBusOptions {
  channel?: string;
  connection: SocketIO.Socket;
}

export class SocketIOBus<T> implements IBus<T> {
  private _target: RemoteBus<T>;
  constructor({ channel, connection }: ISocketIOBusOptions, localBus: IBus<any>, serializer?: ISerializer<any, any>) {
    if (!channel) channel = "o";

    this._target = new RemoteBus({
      adapter: {
        send(message) {
          connection.emit(channel, message);
        },
        addListener(listener) {
          connection.on(channel, listener);
        }
      }
    }, localBus, serializer);
  }

  dispatch(message: T) {
    return this._target.dispatch(message);
  }

  dispose() {
    this._target.dispose();
  }
}