import { ISerializer } from "@tandem/common";
import { IBus, RemoteBus, RemoteBusMessageTester, DuplexStream, IMessageTester } from "@tandem/mesh/core";

export interface ISocketIOBusOptions {
  family: string;
  testMessage?: RemoteBusMessageTester<any>;
  channel?: string;
  connection: SocketIO.Socket;
}

export class SocketIOBus<T> implements IBus<T>, IMessageTester<T> {
  private _target: RemoteBus<T>;
  constructor({ family, channel, connection, testMessage }: ISocketIOBusOptions, localBus: IBus<any>, serializer?: ISerializer<any, any>) {
    if (!channel) channel = "o";

    this._target = new RemoteBus({
      family: family,
      testMessage: testMessage,
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

  testMessage(message: any) {
    return this._target.testMessage(message);
  }

  dispatch(message: T) {
    return this._target.dispatch(message);
  }

  dispose() {
    this._target.dispose();
  }
}