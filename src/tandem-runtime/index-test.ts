import { expect } from "chai";
import {
  Browser,
  BaseModule,
  SymbolTable,
  EnvironmentKind,
  SyntheticValueObject,
  ModuleFactoryDependency,
} from "./index";

import { MockFileSystem } from "./test";
import {
  BrokerBus,
  Dependencies,
  MimeTypeDependency,
  MainBusDependency,
} from "tandem-common";

class MockModule extends BaseModule<any> {
  evaluate(context: SymbolTable) {
    context.get("window").set("i", new SyntheticValueObject(((context.get("window").get("i") as any).value || 0) + 1));
  }
}

describe(__filename + "#", () => {

  let fs: MockFileSystem;
  let deps: Dependencies;

  beforeEach(() => {
    fs = new MockFileSystem();
    deps = new Dependencies(
      new MainBusDependency(new BrokerBus(undefined, fs)),
      new MimeTypeDependency("test", "application/test"),
      new ModuleFactoryDependency(EnvironmentKind.DOM, "application/test", MockModule)
    );
  });

  it("can be created", () => {
    new Browser(deps);
  });

  it("can open a new file", async () => {
    fs.addMockFile({ path: "a.test", content: "abc", mtime: Date.now() });
    const browser = new Browser(deps);
    const window = browser.window;
    await browser.open("a.test");
    expect(window.get<any>("i").value).to.equal(1);
  });
});