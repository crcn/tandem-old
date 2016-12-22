import { IMessage } from "../messages";
import { RemoteBus } from "./remote";
import { IBus, IDispatcher } from "./base";
import { noopDispatcherInstance } from "./noop";
import { CallbackDispatcher } from "./callback";
import { filterFamilyMessage } from "../messages";
import { 
  pump,
  DuplexStream,
  ReadableStream,
  WritableStream,
  TransformStream, 
  WritableStreamDefaultWriter,
  ReadableStreamDefaultReader
} from "../streams";

/*

const cb = new CallbackDispatcher((bus) => {
  return new DuplexStream((input, output) {
    return new ChannelBus(input, output, new CallbackDispatcher((message) => "blarg"));
  }); 
});

const channel = ChannelBus.createFromStream(bus.dispatch())

const stream = channel.dispatch()
*/

export class ChannelBus implements IBus<any> {
  private _remoteBus: RemoteBus<any>;
  private _writer: WritableStreamDefaultWriter<any>;
  constructor(family: string, input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus: IDispatcher<any, any> = noopDispatcherInstance, private _onClose?: () => any) {
    const writer = this._writer = output.getWriter();
    this._remoteBus = new RemoteBus({
      testMessage: filterFamilyMessage,
      family: family, 
      adapter: {
        send(message: any) {
          writer.write(message);
        },
        async addListener(listener: any) {
          input.pipeTo(new WritableStream({
            write: (message) => {
              listener(message);
            },
            close: _onClose,
            abort: _onClose
          }))
        }
      }
    }, localBus);
  }

  dispose() {
    this._writer.close();
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }

  static createFromStream(family: string, stream: TransformStream<any, IMessage>) {
    return new ChannelBus(family, stream.readable, stream.writable);
  }
}