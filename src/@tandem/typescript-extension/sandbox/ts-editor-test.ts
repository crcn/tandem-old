import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
const config = require(process.cwd() + "/webpack.config.js");
import { waitForPropertyChange, Application, LogLevel } from "@tandem/common";
import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";
import { createTestSandboxProviders, ISandboxTestProviderOptions } from "@tandem/sandbox/test";
import { Sandbox, FileCacheProvider, FileSystemProvider, FileEditorProvider } from "@tandem/sandbox";

import { SyntheticBrowser, SyntheticHTMLElement, parseMarkup, evaluateMarkup } from "@tandem/synthetic-browser";

// TODO - move most of this in util functions - possibly in @tandem/editor/test/utils
// TODO - re-use VM instead of creating a new one each time - should be much faster
describe(__filename + "#", () => {

  const aliasMockFiles = {};

  for (const name in config.resolve.alias) {
    const filePath = config.resolve.alias[name];
    if (fs.existsSync(filePath)) {
      aliasMockFiles[filePath] = fs.readFileSync(filePath, "utf8");
    }
  }

  let app: Application;

  before(async () => {
    app = createTestMasterApplication({
      log: {
        level: LogLevel.NONE
      },
      sandboxOptions: {
        mockFiles:aliasMockFiles
      }
    });
    await app.initialize();
  });

  const loadJSX = async (jsx: string) => {
    const { injector } = app;

    const entryFilePath = createRandomFileName("tsx");

    await FileSystemProvider.getInstance(injector).writeFile(entryFilePath, `
      import * as React from "react";
      import * as ReactDOM from "react-dom";
      const element = document.createElement("div");
      ReactDOM.render(${jsx}, element);
      module.exports = element;
    `);

    const browser = new SyntheticBrowser(injector);
    await browser.open({
      url: entryFilePath,
      dependencyGraphStrategyOptions: {
        name: "webpack"
      }
    });

    const getElement = () => {
      return  browser.document.body.firstChild.firstChild as SyntheticHTMLElement;
    }

    return {
      entryFilePath: entryFilePath,
      element: getElement(),
      editor: FileEditorProvider.getInstance(injector),
      fileCache: FileCacheProvider.getInstance(injector),
      reloadElement: async () => {
        await waitForPropertyChange(browser.sandbox, "exports");
        return getElement();
      }
    }
  };

  // testing to ensure the setup code above works
  it("can render an element", async () => {
    const { element } = await loadJSX(`<div>a</div>`);
    expect(element.textContent).to.equal("a");
    expect(element.$source).not.to.be.undefined;
    expect(element.$source.start).not.to.be.undefined;
  });

  [
    // attribute editsw
    [`<div id="a">Hello</div>`, `<div id="b">Hello</div>`],
    [`<div>Hello</div>`, `<div id="b">Hello</div>`],
    [`<div>Hello</div>`, `<div id="b">Hello</div>`],
    [`<div id="a">Hello</div>`, `<div>Hello</div>`],
    [`<div id="a" className="b">Hello</div>`, `<div title="c">Hello</div>`],
    [`<div id="a" className="b" />`, `<div title="c" />`],

    // container edits
    [`<div></div>`, `<div>a</div>`],
    [`<div><span>a</span></div>`, `<div>a</div>`],
    [`<div><span>a</span><div>b</div></div>`, `<div><div>b</div><span>a</span></div>`],
    [`<div />`, `<div>a</div>`],

    [`(
      <div />
    )`, `<div>aa</div>`],

    // add fuzzy here
  ].reverse().forEach(([oldSource, newSource]) => {
    it(`can apply typescript file edits from ${oldSource} to ${newSource}`, async () => {
      const { element, editor, fileCache, entryFilePath, reloadElement } = await loadJSX(oldSource);
      const newElementResult = await loadJSX(newSource);
      const edit = element.createEdit().fromDiff(newElementResult.element);
      expect(edit.changes.length).not.to.equal(0);
      editor.applyEditChanges(...edit.changes);
      expect((await reloadElement()).outerHTML).to.equal(newElementResult.element.outerHTML);
    });
  });
});