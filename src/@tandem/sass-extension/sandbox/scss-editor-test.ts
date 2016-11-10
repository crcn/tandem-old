import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { cssEditorTestCases } from "@tandem/synthetic-browser/sandbox/css-editor-test";
import { generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";
import { FileEditorProvider, FileSystemProvider } from "@tandem/sandbox";
import { waitForPropertyChange, Application, LogLevel, serialize } from "@tandem/common";
import { createTestMasterApplication, createRandomFileName } from "@tandem/editor/test";
import { SyntheticCSSStyleSheet, SyntheticBrowser, parseCSS, evaluateCSS } from "@tandem/synthetic-browser";


describe(__filename + "#", () => {

  const cssLoaderPath = path.join(process.cwd(), "node_modules", "css-loader");
  const addStylePath  = path.join(process.cwd(), "node_modules", "style-loader", "addStyles.js");
  const cssBasePath   = path.join(cssLoaderPath, "lib", "css-base.js");

  let app: Application;

  before(async () => {
    app = createTestMasterApplication({
      // logLevel: LogLevel.ERROR | LogLevel.WARN,
      logLevel: LogLevel.NONE,
      sandboxOptions: {
        mockFiles: {
          [cssBasePath]: fs.readFileSync(cssBasePath, "utf8"),
          [addStylePath]: fs.readFileSync(addStylePath, "utf8")
        }
      }
    });
    await app.initialize();
  });

  const loadCSS = async (content: string) => {

    const { injector } = app;
    const fs = FileSystemProvider.getInstance(injector);

    const entryCSSFilePath = createRandomFileName("scss");
    const entryJSFilePath  = createRandomFileName("js");

    await fs.writeFile(entryCSSFilePath, content);
    await fs.writeFile(entryJSFilePath, `
      require("${entryCSSFilePath}");
    `);

    const browser = new SyntheticBrowser(injector);
    await browser.open({
      url: entryJSFilePath,
      dependencyGraphStrategyOptions: {
        name: "webpack"
      }
    });

    return {
      styleSheet: browser.document.styleSheets[0],
      fileEditor: FileEditorProvider.getInstance(injector),
      reloadStylesheet: async () => {
        await waitForPropertyChange(browser.sandbox, "exports");
        return browser.document.styleSheets[0]
      }
    }
  }

  const scssTestCases = [
    ...cssEditorTestCases,
    [
      `.a { .b { color: red }}`,
      `.a { .b { color: green }}`,
    ],
    [
      `.a { &-b { color: red }}`,
      `.a { &-b { color: green }}`,
    ],
    [
      `.a { &-b { color: red } &-c { color: green }}`,
      `.a { &-b { color: blue } &-c { color: white }}`,
    ],
  ];

  [

    // libscss is finicky with whitespace, so format the same tests
    // again and ensure that they're editable
    ...scssTestCases.map(([oldSource, newSource]) => {
      return [
        formatCSS(oldSource),
        formatCSS(newSource)
      ];
    }),



  ].forEach(([oldSource, newSource]) => {
    it(`can apply a file edit from ${oldSource} to ${newSource}`, async () => {
      const a = await loadCSS(oldSource);
      const b = await loadCSS(newSource);
      const edit = a.styleSheet.createEdit().fromDiff(b.styleSheet);
      expect(edit.actions.length).not.to.equal(0);
      a.fileEditor.applyEditActions(...edit.actions);
      expect((await a.reloadStylesheet()).cssText).to.equal(b.styleSheet.cssText);
    });
  });


  xit("doesn't save the file if there's a syntax error in an edit");
});

function formatCSS(source) {
  return source.replace(/([;{}])/g, "$1\n");
}