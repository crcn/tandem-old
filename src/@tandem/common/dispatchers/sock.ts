import * as net from "net";
import { ISerializer } from "@tandem/common";
import { IDispatcher, IMessageTester, IBus, RemoteBus, RemoteBusMessageTester, DuplexStream } from "@tandem/mesh";

const PAYLOAD_BOUNDARY = "___payload end___";

export interface ISockBusOptions {
  family: string;
  connection: net.Socket;
  testMessage: RemoteBusMessageTester<any>;
}

export class SockBus implements IBus<any>, IMessageTester<any> {
  private _remoteBus: RemoteBus<any>;
  constructor({ family, connection, testMessage }: ISockBusOptions, localBus: IDispatcher<any, any>, serializer?: ISerializer<any, any>) {

    this._remoteBus = new RemoteBus({
      family: family,
      testMessage: testMessage,
      adapter: {
        send: (data) => {
          connection.write(`${JSON.stringify(data)}${PAYLOAD_BOUNDARY}`);
        },
        addListener: (listener: (data) => any) => {
          let currentBuffer = '';

          connection.on("data", (chunk) => {
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
      }
    }, localBus, serializer);
  }

  testMessage(message) {
    return this._remoteBus.testMessage(message);
  }

  dispose() {
    this._remoteBus.dispose();
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }
}