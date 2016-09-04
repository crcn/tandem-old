import { IActor } from "tandem-common/actors";
import { expect } from "chai";
import { WrapBus } from "mesh";
import * as MemoryDsBus from "mesh-memory-ds-bus";
import { PostDsNotifierBus } from "./post-ds-notifier";
import {
  Action,
  DSFindAction,
  DSUpdateAction,
  DSRemoveAction,
  DSInsertAction,
  PostDSAction,
} from "tandem-common/actions";

describe(__filename + "#", () => {

  let bus: IActor;
  let executedActions: Array<PostDSAction>;

  beforeEach(() => {
    executedActions = [];
    bus = new PostDsNotifierBus(new MemoryDsBus(), WrapBus.create((action) => executedActions.push(action)));
  });

  it("fires a DS_DID_INSERT action after inserting an item", async () => {
    await bus.execute(new DSInsertAction("items", { a: "b" }));
    expect(executedActions.length).to.equal(1);
    expect(executedActions[0].type).to.equal(PostDSAction.DS_DID_INSERT);
    expect(executedActions[0].data.a).to.equal("b");
  });

  it("fires a DS_DID_UPDATE action after updating an item", async () => {
    await bus.execute(new DSInsertAction("items", { a: "b" }));
    await bus.execute(new DSUpdateAction("items", { a: "c" }, { a: "b" }));
    expect(executedActions[1].type).to.equal(PostDSAction.DS_DID_UPDATE);
    expect(executedActions[1].data.a).to.equal("c");
  });

  it("fires a DS_DID_REMOVE action after updating an item", async () => {
    await bus.execute(new DSInsertAction("items", { a: "b" }));
    await bus.execute(new DSRemoveAction("items", { a: "b" }));
    expect(executedActions[1].type).to.equal(PostDSAction.DS_DID_REMOVE);
    expect(executedActions[1].data.a).to.equal("b");
  });
});
