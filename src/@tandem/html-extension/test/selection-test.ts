import { expect } from "chai";
import { timeout } from "@tandem/common/test";
import { DSInsertAction } from "@tandem/common/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectEntitiesAtSourceOffsetAction } from "@tandem/editor/actions";

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