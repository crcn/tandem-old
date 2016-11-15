import { IBus, IDispatcher } from "./base";
import { DuplexStream, ReadableStream, WritableStream, wrapDuplexStream } from "../streams";
import {
  IteratorType,
  sequenceIterator,
  parallelIterator,
  createRandomIterator,
  createRoundRobinIterator,
} from "../utils";

export class FanoutBus<T> implements IBus<T> {
  constructor(private _dispatchers: IDispatcher<T>[], private _iterator: IteratorType<IDispatcher<T>>) {

  }
  dispatch(message: T) {
    return new DuplexStream((input, output) => {
      const writer = output.getWriter();

      let spare: ReadableStream<any> = input, child: ReadableStream<any>;

      this._iterator(this._dispatchers, async (dispatcher: IDispatcher<T>) => {
        [spare, child] = spare.tee();
        return child
        .pipeThrough(wrapDuplexStream(dispatcher.dispatch(message)))
        .pipeTo(new WritableStream({
          write(chunk) {
            return writer.write(chunk);
          }
        }));
      })
      .then(writer.close.bind(writer))
      .catch(writer.abort.bind(writer))
      .catch((e) => {

      });

      return {
        cancel() {
          // TODO
        }
      }
    });
  }
}

export class SequenceBus<T> extends FanoutBus<T> {
  constructor(dispatchers: IDispatcher<T>[]) {
    super(dispatchers, sequenceIterator);
  }
}

export class ParallelBus<T> extends FanoutBus<T> {
  constructor(dispatchers: IDispatcher<T>[]) {
    super(dispatchers, parallelIterator);
  }
}

export class RoundRobinBus<T> extends FanoutBus<T> {
  constructor(dispatchers: IDispatcher<T>[]) {
    super(dispatchers, createRoundRobinIterator());
  }
}

export class RandomBus<T> extends FanoutBus<T> {
  constructor(dispatchers: IDispatcher<T>[], weights?: number[]) {
    super(dispatchers, createRandomIterator(weights));
  }
}