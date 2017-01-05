import { ISerializer, IDisposable } from "@tandem/common";
import { 
  IBus, 
  RemoteBus, 
  DuplexStream, 
  IMessageTester, 
  TransformStream,
  RemoteBusMessageTester, 
} from "@tandem/mesh/core";

export interface ISocketIOBusOptions {
  family: string;
  testMessage?: RemoteBusMessageTester<any>;
  channel?: string;
  connection: SocketIO.Socket;
}

export class SocketIOBus<T> implements IBus<T>, IMessageTester<T> {
  private _target: RemoteBus<T>;
  private _disposables: IDisposable[];
  constructor({ family, channel, connection, testMessage }: ISocketIOBusOptions, localBus: IBus<any>, serializer?: ISerializer<any, any>) {
    if (!channel) channel = "o";
    this._disposables = [];

    this._target = new RemoteBus({
      family: family,
      testMessage: testMessage,
      adapter: {
        send(message) {
          connection.compress(true).emit(channel, message);
        },
        addListener(listener) {
          connection.on(channel, listener);
        }
      }
    }, localBus, serializer);
  }

  addDisposable(disposable: IDisposable) {
    this._disposables.push(disposable);
  }

  testMessage(message: any) {
    return this._target.testMessage(message);
  }

  dispatch(message: T) {
    return this._target.dispatch(message);
  }

  dispose() {
    for (const disposable of this._disposables) disposable.dispose();
    this._target.dispose();
  }
}