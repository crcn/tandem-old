import { expect } from "chai";
import { timeout } from "sf-common/test/utils";
import { DSInsertAction } from "sf-common/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectSourceAtOffsetAction } from "sf-front-end/actions";

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

  });
});