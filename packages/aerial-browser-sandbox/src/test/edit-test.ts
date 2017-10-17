import { 
  getSenvHTMLScriptElementClass, 
  createUpdateValueNodeMutation, 
  insertContentMutation, 
  createHTMLStringMutation, 
  getComputedEditHistoryContent,
  createSetElementAttributeMutation
} from "../index";
import { openTestWindow, wrapHTML, waitForDocumentComplete } from "./env/utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can edit a simple text node", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createUpdateValueNodeMutation(window.document.querySelector("span").childNodes[0] as Text, "b");
    
    const history = insertContentMutation(mutation, { content: source, mutations: [] }, createHTMLStringMutation) ;
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql("<html><head></head><body><span>b</span></body></html>");
  });

  it("can make an attribute edit", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createSetElementAttributeMutation(window.document.querySelector("span") as Element, "a", "b");
    
    const history = insertContentMutation(mutation, { content: source, mutations: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span a="b">a</span></body></html>`);
  });

  xit("can add a new child");
  xit("can remove a child");
  xit("can move a child");
  xit("can perform an edit 2 times");
  xit("can perform an edit 3 times");
  xit("can perform an edit 4 times");

  // edit, perform a reload, then create an edit with previous fingerprint
  xit("can perform a later edit against the 1st edit");
  xit("can perform a later edit against the 2nd edit");
});