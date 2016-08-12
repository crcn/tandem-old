import { expect } from "chai";
import { InsertAction } from "sf-core/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { OpenFileAction, SelectSourceAtOffsetAction } from "sf-front-end/actions";
import { timeout } from "sf-core/test/utils";


describe(__filename + "#", () => {

  let app: FrontEndApplication;
  let element;

  beforeEach(async () => {
    app = new FrontEndApplication({
      element: element = document.createElement("div")
    });

    document.body.appendChild(element);

    // TODO - will eventually need to add the html extension here
    // when it's taken out of the main application
    await app.initialize();
  });

  afterEach(() => {
    element.parentNode.removeChild(element);
  });

  describe("source code selection#", () => {
    it("can select an entity based on its source code position", async () => {
      await app.bus.execute(new OpenFileAction("something.html", `
          <div>
            a
          </div>
      `));

      // need to wait for the content to load
      // TODO - watch for app.editor.file.entity to change
      await timeout(10);

      expect(app.editor.file.entity).not.to.equal(undefined);
      expect(app.editor.selection.length).to.equal(0);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: -Infinity, end: Infinity }));
      expect(app.editor.selection.length).to.equal(1);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: 0, end: 0 }));
      expect(app.editor.selection.length).to.equal(0);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: app.editor.file.entity.source.position.start, end: app.editor.file.entity.source.position.end }));
      expect(app.editor.selection.length).to.equal(1);
    });
  });
});