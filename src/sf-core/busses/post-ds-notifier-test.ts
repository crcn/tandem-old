import { IActor } from "sf-core/actors";
import { expect } from "chai";
import { WrapBus } from "mesh";
import * as MemoryDsBus from "mesh-memory-ds-bus";
import { PostDsNotifierBus } from "./post-ds-notifier";
import {
  Action,
  FindAction,
  DID_INSERT,
  DID_REMOVE,
  DID_UPDATE,
  UpdateAction,
  RemoveAction,
  InsertAction,
  PostDBAction,
} from "sf-core/actions";

describe(__filename + "#", () => {

  let bus: IActor;
  let executedActions: Array<PostDBAction>;

  beforeEach(() => {
    executedActions = [];
    bus = new PostDsNotifierBus(new MemoryDsBus(), WrapBus.create((action) => executedActions.push(action)));
  });

  it("fires a DID_INSERT action after inserting an item", async () => {
    await bus.execute(new InsertAction("items", { a: "b" }));
    expect(executedActions.length).to.equal(1);
    expect(executedActions[0].type).to.equal(DID_INSERT);
    expect(executedActions[0].data.a).to.equal("b");
  });

  it("fires a DID_UPDATE action after updating an item", async () => {
    await bus.execute(new InsertAction("items", { a: "b" }));
    await bus.execute(new UpdateAction("items", { a: "c" }, { a: "b" }));
    expect(executedActions[1].type).to.equal(DID_UPDATE);
    expect(executedActions[1].data.a).to.equal("c");
  });

  it("fires a DID_REMOVE action after updating an item", async () => {
    await bus.execute(new InsertAction("items", { a: "b" }));
    await bus.execute(new RemoveAction("items", { a: "b" }));
    expect(executedActions[1].type).to.equal(DID_REMOVE);
    expect(executedActions[1].data.a).to.equal("b");
  });
});
