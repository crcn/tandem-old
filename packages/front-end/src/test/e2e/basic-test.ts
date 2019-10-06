import { expect } from "chai";
import { App } from "./support/api";
describe(__filename + "#", () => {
  let app: App;
  before(() => {
    app = App.create().load();
  });
  it("can load a basic project", () => {});
});
