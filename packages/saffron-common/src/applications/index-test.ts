import { Application } from "./index.ts";
import { LOAD, INITIALIZE } from "saffron-core/src/actions";
import { expect } from "chai";
import { ApplicationSingletonFragment } from 'saffron-core/src/fragments';

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

  it('is registered as a singleton in fragments', () => {
    const app = new Application({});
    expect(ApplicationSingletonFragment.find(app.fragments).instance).to.equal(app);
  });
});