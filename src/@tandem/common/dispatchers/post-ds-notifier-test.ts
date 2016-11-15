import { IDispatcher } from "@tandem/mesh";
import { expect } from "chai";
import { CallbackDispatcher, MemoryDataStore, DSFind, DSUpdate, DSInsert, DSRemove } from "@tandem/mesh";
import { PostDsNotifierBus } from "./post-ds-notifier";
import {
  Action,
  PostDSAction,
} from "@tandem/common/actions";

describe(__filename + "#", () => {

  let bus: IDispatcher<any, any>;
  let dispatchedActions: Array<PostDSAction>;

  beforeEach(() => {
    dispatchedActions = [];
    bus = new PostDsNotifierBus(new MemoryDataStore(), new CallbackDispatcher((action: any) => dispatchedActions.push(action)));
  });

  it("fires a DS_DID_INSERT action after inserting an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0].type).to.equal(PostDSAction.DS_DID_INSERT);
    expect(dispatchedActions[0].data.a).to.equal("b");
  });

  it("fires a DS_DID_UPDATE action after updating an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    await bus.dispatch(new DSUpdate("items", { a: "c" }, { a: "b" }));
    expect(dispatchedActions[1].type).to.equal(PostDSAction.DS_DID_UPDATE);
    expect(dispatchedActions[1].data.a).to.equal("c");
  });

  it("fires a DS_DID_REMOVE action after updating an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    await bus.dispatch(new DSRemove("items", { a: "b" }));
    expect(dispatchedActions[1].type).to.equal(PostDSAction.DS_DID_REMOVE);
    expect(dispatchedActions[1].data.a).to.equal("b");
  });
});
