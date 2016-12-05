import { expect } from "chai";
import { loadTestWindow } from "@tandem/synthetic-browser/test";

describe(__filename + "#", () => {
  it("XMLHttpRequest exists", async () => {
    const window = await loadTestWindow({
      "index.js": `
        document.body.appendChild(document.createTextNode(typeof XMLHttpRequest))
      `
    }, "index.js");

    expect(window.document.textContent).to.equal("function");
  });
  
});