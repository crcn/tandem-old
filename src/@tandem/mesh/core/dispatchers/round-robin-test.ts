import { expect } from "chai";
import { DuplexStream, WritableStream, RoundRobinBus, readAll } from "@tandem/mesh";
import { CallbackDispatcher } from "./callback";

describe(__filename + "#", () => {
  it("can be created", () => {
    new RoundRobinBus([]);
  });

  it("alternates dispatchers each each message, round robin style", async () => {
    const bus = new RoundRobinBus([
      new CallbackDispatcher(m => "a"),
      new CallbackDispatcher(m => "b"),
      new CallbackDispatcher(m => "c")
    ]);

    expect((await bus.dispatch({}).readable.getReader().read()).value).to.equal("a");
    expect((await bus.dispatch({}).readable.getReader().read()).value).to.equal("b");
    expect((await bus.dispatch({}).readable.getReader().read()).value).to.equal("c");
  });
});