import * as net from "net";
import { ISerializer } from "@tandem/common";
import { IDispatcher, IBus, RemoteBus } from "@tandem/mesh";

const PAYLOAD_BOUNDARY = "___payload end___";

export class SockBus implements IBus<any> {
  private _remoteBus: RemoteBus<any>;
  constructor(private _socket: net.Socket, localBus: IDispatcher<any, any>, serializer?: ISerializer<any, any>) {

    this._remoteBus = new RemoteBus({
      send: (data) => {
        _socket.write(`${JSON.stringify(data)}${PAYLOAD_BOUNDARY}`);
      },
      addListener: (listener: (data) => any) => {
        let currentBuffer = '';

        _socket.on("data", (chunk) => {
          let value = String(chunk);

          currentBuffer += value;

          if (currentBuffer.indexOf(PAYLOAD_BOUNDARY) !== -1) {
            const payloadParts = currentBuffer.split(PAYLOAD_BOUNDARY);
            const last = payloadParts.pop();
            payloadParts.map(text => JSON.parse(text)).forEach(listener);
            currentBuffer = last;
          }
        });
      }
    }, localBus, serializer);
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }
}