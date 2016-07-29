import { Application } from "./index.ts";
import { LOAD, INITIALIZE } from "sf-core/actions";
import { expect } from "chai";
import { ApplicationSingletonDependency, ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Application();
  });

  it("initializes a load, then initialize action", async () => {
    let i = 0;
    const app = new Application({});
    app.actors.push({
      execute(action) {
        if (action.type === LOAD) expect(i++).to.equal(0);
        if (action.type === INITIALIZE) expect(i++).to.equal(1);
      }
    });

    await app.initialize();
    expect(i).to.equal(2);
  });

  it("can bind to the loading property", async () => {
    const app = new Application({});
  });

  it("registers application service dependencies upon initialization", async () => {
    const app = new Application({});
    let i = 0;
    let j = 0;

    class TestService extends BaseApplicationService<Application> {
      load() { i++; }
      initialize() { j++; }
    }

    app.dependencies.register(new ApplicationServiceDependency("testService", TestService));

    await app.initialize();
    expect(i).to.equal(1);
    expect(j).to.equal(1);
  });
});