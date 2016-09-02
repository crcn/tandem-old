// import expect from "expect.js";
import { expect } from "chai";
import { Workspace, Editor } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { ClassFactoryDependency } from "sf-core/dependencies";
import { dependency as selectorDependency } from "./selector";
import { SelectAction, ToggleSelectAction } from "sf-front-end/actions";

describe(__filename + "#", () => {

  let app: FrontEndApplication;
  let editor: Editor;
  let workspace: Workspace;

  beforeEach(async () => {
    app = new FrontEndApplication({
      registerFrontEndDependencies: false
    });
    app.workspace = new Workspace(null);
    workspace = app.workspace;
    editor = app.workspace.editor;
    app.dependencies.register(selectorDependency);
    await app.initialize();
  });

  it("defines \"selection\" property on application on selection event", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(app.workspace.selection.length).to.equal(1);
  });

  it("only selects one item if multi is false", () => {
    const item = { name: "blarg" };
    app.bus.execute(new SelectAction(item));
    expect(workspace.selection.length).to.equal(1);
    app.bus.execute(new SelectAction(item));
    expect(workspace.selection.length).to.equal(1);
  });

  it("selects multiple items if multi is true", () => {
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(workspace.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }, true));
    expect(workspace.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction({ name: "blarg" }));
    expect(workspace.selection.length).to.equal(1);
  });

  it("removes an item from the selection if it already exists", () => {
    const item = { name: "blarg" };
    app.bus.execute(new ToggleSelectAction(item));
    expect(workspace.selection.length).to.equal(1);
    app.bus.execute(new ToggleSelectAction(item, true));
    expect(workspace.selection.length).to.equal(0);
  });

  it("can deselect all be omitting item", () => {
    app.bus.execute(new ToggleSelectAction({ type: "display" }));
    app.bus.execute(new ToggleSelectAction({ type: "display" }, true));
    expect(workspace.selection.length).to.equal(2);
    app.bus.execute(new ToggleSelectAction());
    expect(workspace.selection.length).to.equal(0);
  });

  it("can select multiple in an event", () => {
    app.bus.execute(new ToggleSelectAction([{ type: "display" }, { type: "display" }]));
    expect(workspace.selection.length).to.equal(2);
  });

  it("can turn toggling off", () => {
    const item = {};
    app.bus.execute(new ToggleSelectAction(item));
    app.bus.execute(new ToggleSelectAction(item));
    expect(workspace.selection.length).to.equal(0);
  });
});
