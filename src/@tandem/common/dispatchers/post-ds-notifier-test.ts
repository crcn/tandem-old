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
  let dispatchdActions: Array<PostDSAction>;

  beforeEach(() => {
    dispatchdActions = [];
    bus = new PostDsNotifierBus(new MemoryDataStore(), new CallbackDispatcher((action: any) => dispatchdActions.push(action)));
  });

  it("fires a DS_DID_INSERT action after inserting an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    expect(dispatchdActions.length).to.equal(1);
    expect(dispatchdActions[0].type).to.equal(PostDSAction.DS_DID_INSERT);
    expect(dispatchdActions[0].data.a).to.equal("b");
  });

  it("fires a DS_DID_UPDATE action after updating an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    await bus.dispatch(new DSUpdate("items", { a: "c" }, { a: "b" }));
    expect(dispatchdActions[1].type).to.equal(PostDSAction.DS_DID_UPDATE);
    expect(dispatchdActions[1].data.a).to.equal("c");
  });

  it("fires a DS_DID_REMOVE action after updating an item", async () => {
    await bus.dispatch(new DSInsert("items", { a: "b" }));
    await bus.dispatch(new DSRemove("items", { a: "b" }));
    expect(dispatchdActions[1].type).to.equal(PostDSAction.DS_DID_REMOVE);
    expect(dispatchdActions[1].data.a).to.equal("b");
  });
});
