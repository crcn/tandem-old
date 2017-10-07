import { getSenvHTMLScriptElementClass, createUpdateValueNodeMutation } from "../index";
import { openTestWindow, wrapHTML, waitForDocumentComplete } from "./env/utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can edit a simple text node", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createUpdateValueNodeMutation(window.document.querySelector("span").childNodes[0] as Text, "b");
    
    console.log(mutation);
  })
});