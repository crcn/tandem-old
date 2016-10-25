import { IActor } from "../actors";
import * as RemoteBus from "mesh-remote-bus";
import * as net from "net";

export class SockBus extends RemoteBus {
  constructor(private _socket: net.Socket, localBus: IActor, serializer?) {
    super({
      send: (data) => {
        _socket.write(JSON.stringify(data));
      },
      addListener: (listener: (data) => any) => {
        _socket.on("data", (data) => listener(JSON.parse(data.toString())));
      }
    }, localBus, serializer);
  }
}