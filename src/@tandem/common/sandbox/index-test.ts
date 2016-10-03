import { expect } from "chai";
import { Sandbox, ModuleFactoryDependency, BaseModule } from "./index";
import {
  BrokerBus,
  TypeWrapBus,
  Dependencies,
  WatchFileAction,
  MimeTypeDependency,
  MainBusDependency,
} from "@tandem/common";

import { Response } from "mesh";

describe(__filename + "#", () => {

  let deps: Dependencies;
  let bus: BrokerBus;


  class TestModule extends BaseModule {
      evaluate() {
        return { message: this.content };
      }
  }

  beforeEach(() => {
    deps = new Dependencies(
      new MainBusDependency(bus = new BrokerBus()),
      new MimeTypeDependency("scss", "text/scss"),
      new ModuleFactoryDependency("someEnv", "text/scss", TestModule)
    );
  });



  it("can be created", () => {
    const sandbox = new Sandbox(deps);
  });

  it("can import a module", async () => {
    bus.register(new TypeWrapBus("readFile", () => "hello world"));
    const sb = new Sandbox(deps);
    const exports = await sb.import("someEnv", "module.scss");
    expect(exports.message).to.eql("hello world");
  });

  it("caches readfile when importing a module", async () => {
    let i = 0;

    bus.register(new TypeWrapBus("readFile", () => "hello world" + (++i)));
    const sb = new Sandbox(deps);
    await sb.import("someEnv", "module.scss");
    await sb.import("someEnv", "module.scss");
    await sb.import("someEnv", "module.scss");
    const exports = await sb.import("someEnv", "module.scss");
    expect(i).to.eql(1);
    expect(exports.message).to.eql("hello world1");
  });

});
