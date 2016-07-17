
declare module "mesh-socket-io-bus" {
  import { Bus } from 'mesh';

  class SocketIOConnection {
    on(eventType:string, listener:Function);
    emit(eventType:string, ...args:Array<any>);
  }

  class RemoteBus extends Bus { }

  export function create({ connection:SocketIOConnection }, localBus:Bus):RemoteBus;
}

