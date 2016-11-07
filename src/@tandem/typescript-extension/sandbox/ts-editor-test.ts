import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
const config = require(process.cwd() + "/webpack.config.js");
import {
  Injector,
  BrokerBus,
  InjectorProvider,
  waitForPropertyChange,
  PrivateBusProvider,
} from "@tandem/common";
import {
  createTestSandboxProviders,
  ISandboxTestProviderOptions,
} from "@tandem/sandbox/test";

import {
  createJavaScriptSandboxProviders,
} from "@tandem/javascript-extension";

import { createTypescriptEditorWorkerProviders } from "@tandem/typescript-extension/editor/worker";

import {
  Sandbox,
  FileCacheProvider,
  FileEditorProvider,
  DependencyGraphStrategyProvider,
  WebpackDependencyGraphStrategy
} from "@tandem/sandbox";

import { SyntheticBrowser, SyntheticHTMLElement, parseMarkup, evaluateMarkup } from "@tandem/synthetic-browser";

// TODO - move most of this in util functions - possibly in @tandem/editor/test/utils
describe(__filename + "#", () => {

  const createTestInjector = (sandboxOptions: ISandboxTestProviderOptions) => {
    const injector = new Injector(
      new InjectorProvider(),
      createJavaScriptSandboxProviders(),
      createTypescriptEditorWorkerProviders(),
      createTestSandboxProviders(sandboxOptions),
      new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
      new PrivateBusProvider(new BrokerBus())
    );
    FileCacheProvider.getInstance(injector).syncWithLocalFiles();
    return injector;
  }

  const aliasMockFiles = {};


  for (const name in config.resolve.alias) {
    const filePath = config.resolve.alias[name];
    if (fs.existsSync(filePath)) {
      aliasMockFiles[filePath] = fs.readFileSync(filePath, "utf8");
    }
  }


  const loadJSX = async (jsx: string) => {

    // need to use process.cwd() to ensure that tsconfig.json gets loaded.
    const fileName = process.cwd() + "/entry.tsx";

    const mockFiles = Object.assign({
      [fileName]: `
        import * as React from "react";
        import * as ReactDOM from "react-dom";
        const element = document.createElement("div");
        ReactDOM.render(${jsx}, element);
        module.exports = element;
      `
    }, aliasMockFiles);


    const injector = createTestInjector({ mockFiles });

    const browser = new SyntheticBrowser(injector);
    await browser.open({
      url: fileName,
      dependencyGraphStrategyOptions: {
        name: "webpack"
      }
    });

    const getElement = () => {
      return browser.document.body.firstChild.firstChild as SyntheticHTMLElement;
    }

    return {
      entryFilePath: fileName,
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
    const { element } = await loadJSX(`<div>Hello</div>`);
    expect(element.textContent).to.equal("Hello");
    expect(element.$source).not.to.be.undefined;
    expect(element.$source.start.line).to.equal(5);
    expect(element.$source.start.column).to.equal(24);
  });

  [
    // attribute edits
    [`<div id="a">Hello</div>`, `<div id="b">Hello</div>`],
    [`<div>Hello</div>`, `<div id="b">Hello</div>`],
    [`<div>Hello</div>`, `<div id="b">Hello</div>`],
    [`<div id="a">Hello</div>`, `<div>Hello</div>`],
    [`<div id="a" class="b">Hello</div>`, `<div title="c">Hello</div>`],
    [`<div id="a" class="b" />`, `<div title="c" />`],

    // container edits
    [`<div></div>`, `<div>a</div>`],
    [`<div><span>a</span></div>`, `<div>a</div>`],
    [`<div><span>a</span><div>b</div></div>`, `<div><div>b</div><span>a</span></div>`],
    [`<div />`, `<div>a</div>`]

    // add fuzzy here
  ].forEach(([oldSource, newSource]) => {
    it(`can apply typescript file edits from ${oldSource} to ${newSource}`, async () => {
      const { element, editor, fileCache, entryFilePath, reloadElement } = await loadJSX(oldSource);
      const newElementResult = await loadJSX(newSource);
      const edit = element.createEdit().fromDiff(newElementResult.element);
      editor.applyEditActions(...edit.actions);
      expect((await reloadElement()).outerHTML).to.equal(newElementResult.element.outerHTML);
    });
  });
});