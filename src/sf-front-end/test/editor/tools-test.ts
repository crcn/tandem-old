import { expect } from "chai";
import { FrontEndApplication } from "sf-front-end/application";
describe(__filename + "#", () => {

  let app: FrontEndApplication;
  let element: HTMLDivElement;

  beforeEach(async () => {
    app = new FrontEndApplication({
      element: element = document.createElement("div")
    });
    document.body.appendChild(element);
    await app.initialize();
  });

  afterEach(() => {
    element.parentNode.removeChild(element);
  });

  describe("pointer tool", () => {
    it("can delete 1 selected item", () => {

    });
  });
});