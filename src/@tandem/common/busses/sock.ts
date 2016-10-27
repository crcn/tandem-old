import { IActor } from "../actors";
import * as RemoteBus from "mesh-remote-bus";
import * as net from "net";

const PAYLOAD_BOUNDARY = "___payload end___";

export class SockBus extends RemoteBus {
  constructor(private _socket: net.Socket, localBus: IActor, serializer?) {
    super({
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
}