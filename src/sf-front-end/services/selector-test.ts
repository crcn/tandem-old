// import expect from "expect.js";
import { dependency as selectorDependency } from "./selector";
import { ClassFactoryDependency } from "sf-core/dependencies";
import { FrontEndApplication } from "sf-front-end/application";
import { Editor } from "sf-front-end/models";
import { expect } from "chai";
import { SelectAction, ToggleSelectAction } from "sf-front-end/actions/index";

describe(__filename + "#", () => {

  let app: FrontEndApplication;
  let editor: Editor;

  beforeEach(async () => {
    app = new FrontEndApplication({
      registerFrontEndDependencies: false
    });
    editor = app.editor;
    app.dependencies.register(selectorDependency);
    await app.initialize();
  });

  it("defines \"selection\" property on application on selection event", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.editor.selection.length).to.equal(1);
  });

  it("only selects one item if multi is false", () => {
    const item = { name: "blarg" };
    app.bus.execute(new SelectAction(item));
    expect(editor.selection.length).to.equal(1);
    app.bus.execute(new SelectAction(item));
    expect(editor.selection.length).to.equal(1);
  });

  it("selects multiple items if multi is true", () => {
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(editor.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }, true));
    expect(editor.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(editor.selection.length).to.equal(1);
  });

  it("removes an item from the selection if it already exists", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(editor.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction(item, true));
    expect(editor.selection.length).to.equal(0);
  });

  xit("picks the correct collection type depending on the item type", () => {

    class DisplayCollection extends Array<any> { }
    class OtherCollection extends Array<any> { }

    app.dependencies.register(new ClassFactoryDependency("selection-collections/display", DisplayCollection));
    app.dependencies.register(new ClassFactoryDependency("selection-collections/other", OtherCollection));

    app.bus.execute(new ToggleSelectAction({ type: "display" }));
    expect(editor.selection).to.be.an.instanceof(DisplayCollection);
    app.bus.execute(new ToggleSelectAction({ type: "display" }, true));
    expect(editor.selection).to.be.an.instanceof(DisplayCollection);
    expect(editor.selection.length).to.equal(2);

    app.bus.execute(new ToggleSelectAction({ type: "other" }, true));
    expect(editor.selection).to.be.an.instanceof(OtherCollection);
    expect(editor.selection.length).to.equal(1);
  });

  it("can deselect all be omitting item", () => {
    app.bus.execute(new ToggleSelectAction({ type: "display" }));
    app.bus.execute(new ToggleSelectAction({ type: "display" }, true));
    expect(editor.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction());
    expect(editor.selection.length).to.equal(0);
  });

  it("can select multiple in an event", () => {
    app.bus.execute(new ToggleSelectAction([{ type: "display" }, { type: "display" }]));
    expect(editor.selection.length).to.equal(2);
  });

  it("can turn toggling off", () => {
    const item = {};
    app.bus.execute(new ToggleSelectAction(item));
    app.bus.execute(new ToggleSelectAction(item));
    expect(editor.selection.length).to.equal(0);
  });
});
