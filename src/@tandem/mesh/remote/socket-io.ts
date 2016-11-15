import { IBus, RemoteBus } from "@tandem/mesh/core";
import { ISerializer } from "@tandem/common";

export interface ISocketIOBusOptions {
  channel?: string;
  connection: SocketIO.Socket;
}

export class SocketIOBus<T> implements IBus<T> {
  private _target: RemoteBus<T>;
  constructor({ channel, connection }: ISocketIOBusOptions, localBus: IBus<any>, serializer?: ISerializer<any, any>) {
    if (!channel) channel = "o";

    this._target = new RemoteBus({
      send(message) {
        connection.emit(channel, message);
      },
      addListener(listener) {
        connection.addListener(channel, listener);
      }
    }, localBus, serializer);
  }

  dispatch(message: T) {
    return this._target.dispatch(message);
  }
}