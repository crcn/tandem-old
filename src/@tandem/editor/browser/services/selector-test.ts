// // import expect from "expect.js";
// import { expect } from "chai";
// import { Workspace, Editor } from "@tandem/editor/browser/models";
// import { FrontEndApplication } from "@tandem/editor/browser/application";
// import { ClassFactoryDependency } from "@tandem/common/dependencies";
// import { selectorServiceDependency } from "./selector";
// import { SelectAction, ToggleSelectAction } from "@tandem/editor/browser/actions";

// describe(__filename + "#", () => {

//   let app: FrontEndApplication;
//   let editor: Editor;
//   let workspace: Workspace;

//   beforeEach(async () => {
//     app = new FrontEndApplication({
//       registerFrontEndDependencies: false
//     });
//     app.workspace = new Workspace(null);
//     workspace = app.workspace;
//     editor = app.workspace.editor;
//     app.dependencies.register(selectorServiceDependency);
//     await app.initialize();
//   });

//   class MockEntity {
//     readonly source = {
//       source: {

//       }
//     };
//   }

//   it("defines \"selection\" property on application on selection event", () => {
//     app.bus.execute(new ToggleSelectAction(new MockEntity()));
//     // expect(app.workspace.selection.length).to.equal(1);
//   });

//   it("only selects one item if multi is false", () => {
//     const item = new MockEntity();
//     app.bus.execute(new SelectAction(item));
//     expect(workspace.selection.length).to.equal(1);
//     app.bus.execute(new SelectAction(item));
//     expect(workspace.selection.length).to.equal(1);
//   });

//   it("selects multiple items if multi is true", () => {
//     app.bus.execute(new ToggleSelectAction(new MockEntity()));
//     expect(workspace.selection.length).to.equal(1);
//     app.bus.execute(new ToggleSelectAction(new MockEntity(), true));
//     expect(workspace.selection.length).to.equal(2);
//     app.bus.execute(new ToggleSelectAction(new MockEntity()));
//     expect(workspace.selection.length).to.equal(1);
//   });

//   it("removes an item from the selection if it already exists", () => {
//     const item = new MockEntity();
//     app.bus.execute(new ToggleSelectAction(item));
//     expect(workspace.selection.length).to.equal(1);
//     app.bus.execute(new ToggleSelectAction(item, true));
//     expect(workspace.selection.length).to.equal(0);
//   });

//   it("can deselect all be omitting item", () => {
//     app.bus.execute(new ToggleSelectAction(new MockEntity()));
//     app.bus.execute(new ToggleSelectAction(new MockEntity(), true));
//     expect(workspace.selection.length).to.equal(2);
//     app.bus.execute(new ToggleSelectAction());
//     expect(workspace.selection.length).to.equal(0);
//   });

//   it("can select multiple in an event", () => {
//     app.bus.execute(new ToggleSelectAction([new MockEntity(), new MockEntity()]));
//     expect(workspace.selection.length).to.equal(2);
//   });

//   it("can turn toggling off", () => {
//     const item = new MockEntity();
//     app.bus.execute(new ToggleSelectAction(item));
//     app.bus.execute(new ToggleSelectAction(item));
//     expect(workspace.selection.length).to.equal(0);
//   });
// });
