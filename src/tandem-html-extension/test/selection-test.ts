import { expect } from "chai";
import { timeout } from "tandem-common/test/utils";
import { DSInsertAction } from "tandem-common/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectEntitiesAtSourceOffsetAction } from "tandem-front-end/actions";

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