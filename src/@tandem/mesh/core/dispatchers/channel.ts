import { IMessage } from "../messages";
import { RemoteBus } from "./remote";
import { IBus, IDispatcher } from "./base";
import { noopDispatcherInstance } from "./noop";
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
  constructor(input: ReadableStream<IMessage>, output: WritableStream<IMessage>, localBus: IDispatcher<any, any> = noopDispatcherInstance, onClose?: () => any) {
    const writer = output.getWriter();
    this._remoteBus = new RemoteBus({
      adapter: {
        send(message: any) {
          writer.write(message);
        },
        async addListener(listener: any) {
          input.pipeTo(new WritableStream({
            write: (message) => {
              listener(message);
            },
            close: onClose,
            abort: onClose
          }))
        }
      }
    }, localBus);
  }

  dispatch(message: any) {
    return this._remoteBus.dispatch(message);
  }

  static createFromStream(stream: TransformStream<any, IMessage>) {
    return new ChannelBus(stream.readable, stream.writable);
  }
}