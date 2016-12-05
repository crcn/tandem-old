import { expect } from "chai";
import { LogLevel } from "@tandem/common";
import { SyntheticBrowser, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { createTestMasterApplication } from "@tandem/editor/test";
import { loadTestWindow } from "@tandem/synthetic-browser/test";

// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", () => {

  it("Can dynamically create a new script", async () => {
    const window = await loadTestWindow({
      "index.html": `
        <script>
          var script = document.createElement("script");
          script.text = "document.appendChild(document.createTextNode('a'))";
          document.appendChild(script);
        </script>
      `
    }, "index.html");

    expect(window.document.lastChild.textContent).to.equal("a");
  });

  it("Can set the text of a script after it's been added to the DOM", async () => {
    const window = await loadTestWindow({
      "index.html": `
        <script>
          var script = document.createElement("script");
          document.appendChild(script);
          script.text = "document.appendChild(document.createTextNode('a'))";
        </script>
      `
    }, "index.html");

    expect(window.document.lastChild.textContent).to.equal("a");
  });

});