import { IActor } from "sf-core/actors";
import { expect } from "chai";
import { Action } from "sf-core/actions";
import { Application } from "sf-common/application";
import { CommandFactoryDependency } from "sf-core/dependencies";
import { dependency as commandsServiceDependency } from "./commands";

describe(__filename + "#", () => {

  let app: Application;

  beforeEach(() => {
    app = new Application();
    app.dependencies.register(commandsServiceDependency);
  });

  it("registers commands before the application loads", async () => {
    let i = 0;
    app.dependencies.register(new CommandFactoryDependency("initialize", class TestCommand implements IActor {
      execute(action: Action) {
        i++;
      }
    }));
    await app.initialize();
    expect(i).to.equal(1);
  });
});