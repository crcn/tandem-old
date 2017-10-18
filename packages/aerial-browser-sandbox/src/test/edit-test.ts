import { 
  getSenvHTMLScriptElementClass, 
  createUpdateValueNodeMutation, 
  createParentNodeInsertChildMutation,
  createParentNodeRemoveChildMutation,
  updateContent, 
  patchWindow,
  diffWindow,
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
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation) ;
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql("<html><head></head><body><span>b</span></body></html>");
  });

  it("can make an attribute edit", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createSetElementAttributeMutation(window.document.querySelector("span") as Element, "a", "b");
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span a="b">a</span></body></html>`);
  });

  it("can add a new child", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeInsertChildMutation(window.document.querySelector("span") as Element, window.document.createTextNode("ab"), 0);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span>aba</span></body></html>`);
  });

  it("can add a new child before one that has children", async () => {
    const source = wrapHTML(`<span><h1></h1></span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeInsertChildMutation(window.document.querySelector("span") as Element, window.document.createTextNode("ab"), 0);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span>ab<h1></h1></span></body></html>`);
  });

  it("can add a new child in an index that exceeds the child node length", async () => {
    const source = wrapHTML(`<span>a</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeInsertChildMutation(window.document.querySelector("span") as Element, window.document.createTextNode("ab"), Number.MAX_SAFE_INTEGER);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span>aab</span></body></html>`);
  });

  it("can add a new child to an element that doesn't have children", async () => {
    const source = wrapHTML(`<span></span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeInsertChildMutation(window.document.querySelector("span") as Element, window.document.createTextNode("ab"), Number.MAX_SAFE_INTEGER);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span>ab</span></body></html>`);
  });

  it("can add a new child to a self-closing tag", async () => {
    const source = wrapHTML(`<span />`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeInsertChildMutation(window.document.querySelector("span") as Element, window.document.createTextNode("ab"), 0);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span>ab</span></body></html>`);
  });

  it("can remove a child", async () => {
    const source = wrapHTML(`<span>ab</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createParentNodeRemoveChildMutation(window.document.querySelector("span") as Element, window.document.querySelector("span").childNodes[0], 0);
    
    const history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span></span></body></html>`);
  });

  xit("can move a child");

  it("can perform an edit 2 times with the same fingerprint", async () => {
    const source = wrapHTML(`<span>a</span><span>b</span>`);
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createSetElementAttributeMutation(window.document.querySelector("span") as Element, "a", "b");
    const mutation2 = createSetElementAttributeMutation((window.document.querySelectorAll("span")[1] as Element).cloneNode() as any, "c", "d");
    
    let history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource).to.eql(`<html><head></head><body><span a="b">a</span><span>b</span></body></html>`);

    const window2 = await openTestWindow(newSource);
    await waitForDocumentComplete(window2);

    patchWindow(window, diffWindow(window, window2));

    
    history = updateContent(mutation2, history, createHTMLStringMutation);
    const newSource2 = getComputedEditHistoryContent(history, createHTMLStringMutation);

    expect(newSource2).to.eql(`<html><head></head><body><span a="b">a</span><span c="d">b</span></body></html>`);
  }); 

  it("can perform an edit 3 times with the same fingerprint", async () => {
    const source = wrapHTML(`<span>a</span><span>b</span>`);
  
    const window = await openTestWindow(source);
    await waitForDocumentComplete(window);
    const mutation = createSetElementAttributeMutation(window.document.querySelector("span") as Element, "a", "b");
    let history = updateContent(mutation, { content: source, commits: [] }, createHTMLStringMutation);
    const newSource = getComputedEditHistoryContent(history, createHTMLStringMutation);
    expect(newSource).to.eql(`<html><head></head><body><span a="b">a</span><span>b</span></body></html>`);

    const window2 = await openTestWindow(newSource);
    await waitForDocumentComplete(window2);
    patchWindow(window, diffWindow(window, window2));
    const mutation2 = createSetElementAttributeMutation((window.document.querySelectorAll("span")[1] as Element).cloneNode() as any, "c", "d");
    history = updateContent(mutation2, history, createHTMLStringMutation);
    const newSource2 = getComputedEditHistoryContent(history, createHTMLStringMutation);
    expect(newSource2).to.eql(`<html><head></head><body><span a="b">a</span><span c="d">b</span></body></html>`);

    const window3 = await openTestWindow(newSource2);
    await waitForDocumentComplete(window3);
    patchWindow(window, diffWindow(window, window3));
    const mutation3 = createParentNodeRemoveChildMutation(window2.document.querySelectorAll("span")[1] as Element, (window2.document.querySelectorAll("span")[1].childNodes[0].cloneNode() as any));
    history = updateContent(mutation3, history, createHTMLStringMutation);
    const newSource3 = getComputedEditHistoryContent(history, createHTMLStringMutation);
    expect(newSource3).to.eql(`<html><head></head><body><span a="b">a</span><span c="d"></span></body></html>`);
    
  }); 

  xit("can perform an edit 4 times");

  // edit, perform a reload, then create an edit with previous fingerprint
  xit("can perform a later edit against the 1st edit");
  xit("can perform a later edit against the 2nd edit");
});