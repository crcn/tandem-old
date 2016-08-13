import { Action } from "../actions";
import { expect } from "chai";
import { Service } from "./base";
import { BufferedBus } from "mesh";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Service();
  });

  it("can add an actor to the service", async () => {
    const service = new Service();
    service.addActor("ping", new BufferedBus(undefined, "pong"));
    expect((await service.execute(new Action("ping")).read()).value).to.equal("pong");
  });

  it("can add multiple actors to the same action", async () => {
    const service = new Service();
    service.addActor("ping", new BufferedBus(undefined, "pong1"));
    service.addActor("ping", new BufferedBus(undefined, "pong2"));
    expect(await service.execute(new Action("ping")).readAll()).to.have.members(["pong1", "pong2"]);
    service.addActor("ping", new BufferedBus(undefined, "pong3"));
    expect(await service.execute(new Action("ping")).readAll()).to.have.members(["pong1", "pong2", "pong3"]);
  });

  it("calls methods on the service as actors", async () => {
    const service = new Service();
    service["ping"] = () => "pong";
    expect(await service.execute(new Action("ping")).readAll()).to.have.members(["pong"]);
  });

  it("ignores actions that don't have handlers", async () => {
    const service = new Service();
    expect((await service.execute(new Action("ping")).readAll()).length).to.equal(0);
  });
});