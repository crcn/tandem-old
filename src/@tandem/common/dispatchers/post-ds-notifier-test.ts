import { IDispatcher } from "@tandem/mesh";
import { expect } from "chai";
import { CallbackDispatcher, MemoryDataStore, DSFindRequest, DSUpdateRequest, DSInsertRequest, DSRemoveRequest } from "@tandem/mesh";
import { PostDsNotifierBus } from "./post-ds-notifier";
import {
  Action,
  PostDSMessage,
} from "@tandem/common/actions";

describe(__filename + "#", () => {

  let bus: IDispatcher<any, any>;
  let dispatchedActions: Array<PostDSMessage>;

  beforeEach(() => {
    dispatchedActions = [];
    bus = new PostDsNotifierBus(new MemoryDataStore(), new CallbackDispatcher((action: any) => dispatchedActions.push(action)));
  });

  it("fires a DS_DID_INSERT action after inserting an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    expect(dispatchedActions.length).to.equal(1);
    expect(dispatchedActions[0].type).to.equal(PostDSMessage.DS_DID_INSERT);
    expect(dispatchedActions[0].data.a).to.equal("b");
  });

  it("fires a DS_DID_UPDATE action after updating an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    await bus.dispatch(new DSUpdateRequest("items", { a: "c" }, { a: "b" }));
    expect(dispatchedActions[1].type).to.equal(PostDSMessage.DS_DID_UPDATE);
    expect(dispatchedActions[1].data.a).to.equal("c");
  });

  it("fires a DS_DID_REMOVE action after updating an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    await bus.dispatch(new DSRemoveRequest("items", { a: "b" }));
    expect(dispatchedActions[1].type).to.equal(PostDSMessage.DS_DID_REMOVE);
    expect(dispatchedActions[1].data.a).to.equal("b");
  });
});
