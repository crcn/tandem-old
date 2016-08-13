import { expect } from "chai";
import { timeout } from "sf-core/test/utils";
import { InsertAction } from "sf-core/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { OpenFileAction, SelectSourceAtOffsetAction } from "sf-front-end/actions";

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

    // OpenFileAction no longer supported on the front-end
    xit("can select an entity based on its source code position", async () => {
      await app.bus.execute(new OpenFileAction("something.html", `
          <div>
            a
          </div>
      `));

      // need to wait for the content to load
      // TODO - watch for app.workspace.file.entity to change
      await timeout(10);

      expect(app.workspace.file.entity).not.to.equal(undefined);
      expect(app.workspace.selection.length).to.equal(0);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: -Infinity, end: Infinity }));
      expect(app.workspace.selection.length).to.equal(1);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: 0, end: 0 }));
      expect(app.workspace.selection.length).to.equal(0);
      app.bus.execute(new SelectSourceAtOffsetAction({ start: app.workspace.file.entity.source.position.start, end: app.workspace.file.entity.source.position.end }));
      expect(app.workspace.selection.length).to.equal(1);
    });
  });
});