// import expect from "expect.js";
import { dependency as selectorDependency } from "./selector";
import { ClassFactoryDependency } from "sf-core/dependencies";
import { Application } from "sf-common/application";
import { expect } from "chai";
import { SelectAction, ToggleSelectAction } from "sf-front-end/actions/index";

describe(__filename + "#", () => {

  let app: any;

  beforeEach(async () => {
    app = new Application();
    app.dependencies.register(selectorDependency);
    await app.initialize();
  });

  xit("defines \"selection\" property on application on selection event", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(1);
  });

  xit("only selects one item if multi is false", () => {
    const item = { name: "blarg" };
    app.bus.execute(new SelectAction(item));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new SelectAction(item));
    expect(app.selection.length).to.equal(1);
  });

  xit("selects multiple items if multi is true", () => {
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }, true));
    expect(app.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(app.selection.length).to.equal(1);
  });

  xit("removes an item from the selection if it already exists", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction(item, true));
    expect(app.selection.length).to.equal(0);
  });

  xit("picks the correct collection type depending on the item type", () => {

    class DisplayCollection extends Array<any> { }
    class OtherCollection extends Array<any> { }

    app.dependencies.register(new ClassFactoryDependency("selection-collections/display", DisplayCollection));
    app.dependencies.register(new ClassFactoryDependency("selection-collections/other", OtherCollection));

    app.bus.execute(new ToggleSelectAction({ type: "display" }));
    expect(app.selection).to.be.an.instanceof(DisplayCollection);
    app.bus.execute(new ToggleSelectAction({ type: "display" }, true));
    expect(app.selection).to.be.an.instanceof(DisplayCollection);
    expect(app.selection.length).to.equal(2);

    app.bus.execute(new ToggleSelectAction({ type: "other" }, true));
    expect(app.selection).to.be.an.instanceof(OtherCollection);
    expect(app.selection.length).to.equal(1);
  });

  xit("can deselect all be omitting item", () => {
    app.bus.execute(new ToggleSelectAction({ type: "display" }));
    app.bus.execute(new ToggleSelectAction({ type: "display" }, true));
    expect(app.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction());
    expect(app.selection.length).to.equal(0);
  });

  xit("can select multiple in an event", () => {
    app.bus.execute(new ToggleSelectAction([{ type: "display" }, { type: "display" }]));
    expect(app.selection.length).to.equal(2);
  });

  xit("can turn toggling off", () => {
    const item = {};
    app.bus.execute(new ToggleSelectAction(item));
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.selection.length).to.equal(0);
  });
});
