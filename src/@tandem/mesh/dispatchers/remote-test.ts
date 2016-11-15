import { expect } from "chai";
import { EventEmitter } from "events";
import { RemoteBus, NoopDispatcher, CallbackDispatcher, readAll, DuplexStream, TransformStream } from "@tandem/mesh";

describe(__filename + "#", () => {
  it("can be created", () => {
    new RemoteBus({ send: null, addListener: () => {} }, new NoopDispatcher());
  });

  const createAdapter = () => {
    const em = new EventEmitter();
    return {
      addListener : em.on.bind(em, 'message'),
      send        : em.emit.bind(em, 'message')
    };
  }

  it("can send and receive a remote message", async () => {

    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher(({ text }) => {
      return text.toUpperCase();
    }));

    expect(await readAll(bus.dispatch({ text: "hello" }))).to.eql(["HELLO"]);
  });

  it("can send and receive a remote stream", async () => {

    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher(({ text }) => {
      return new TransformStream({
        start(controller) {
          text.split("").forEach(chunk => controller.enqueue(chunk));
          controller.close();
        }
      })
    }));

    expect(await readAll(bus.dispatch({ text: "hello" }))).to.eql(["h", "e", "l", "l", "o"]);
  });

  it("can write chunks to a remote stream", async () => {
    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher((message: any) => {
      return new TransformStream({
        transform(chunk: string, controller) {
          controller.enqueue(chunk.toUpperCase());
        }
      })
    }));

    const { writable, readable } = bus.dispatch({});
    const writer = writable.getWriter();
    writer.write("a");
    writer.write("b");
    writer.write("c");
    await writer.write("d");
    writer.close();

    expect(await readAll(readable)).to.eql(["A", "B", "C", "D"]);
  });

  it("can abort a remote stream", async () => {
    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher((message: any) => {
      return new TransformStream({
        transform(chunk: string, controller) {
          controller.enqueue(chunk.toUpperCase());
        }
      })
    }));

    const { writable, readable } = bus.dispatch({});
    const writer = writable.getWriter();
    const reader = readable.getReader();
    writer.write("a").catch(e => {});
    writer.write("b").catch(e => {});
    writer.write("c").catch(e => {});
    await writer.abort(new Error("Cannot write anymore"));

    let error;

    try {
      await reader.read();
    } catch(e) {
      error = e;
    }

    expect(error.message).to.equal("Writable side aborted");
  });

  it("can cancel a read stream", async () => {

    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher(({ text }) => {
      return new TransformStream({
        start(controller) {
          text.split("").forEach(chunk => controller.enqueue(chunk.toUpperCase()));
        }
      })
    }));

    const { writable, readable } = bus.dispatch({ text: "abcde" });
    const reader = readable.getReader();
    expect((await reader.read()).value).to.equal("A");
    expect((await reader.read()).value).to.equal("B");
    expect((await reader.read()).value).to.equal("C");
    reader.cancel("not interested");
    expect((await reader.read()).done).to.equal(true);
  });


  it("doesn't get re-dispatched against the same remote bus", async () => {
    let i = 0;
    const bus = new RemoteBus(createAdapter(), new CallbackDispatcher((message: string) => {
      i++;
      return bus.dispatch(message);
    }));

    const { writable, readable } = bus.dispatch({});
    expect(i).to.equal(1);

  });

  it("gets re-dispatched against other remote busses", async () => {
    let i = 0;
    const abus = new RemoteBus(createAdapter(), new CallbackDispatcher((message: string) => {
      i++;
      return bbus.dispatch(message);
    }));


    const bbus = new RemoteBus(createAdapter(), new CallbackDispatcher((message: string) => {
      i++;
      return abus.dispatch(message);
    }));

    const { writable, readable } = abus.dispatch({});
    expect(i).to.equal(2);

  });
});