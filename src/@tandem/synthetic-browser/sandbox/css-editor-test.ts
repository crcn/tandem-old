import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { createTestSandboxProviders } from "@tandem/sandbox/test";
import { generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";
import { createHTMLCoreProviders } from "@tandem/html-extension";
import { createJavaScriptSandboxProviders } from "@tandem/javascript-extension";
import { SyntheticCSSStyleSheet, SyntheticBrowser } from "@tandem/synthetic-browser";
import { createSASSSandboxProviders } from "@tandem/sass-extension";
import { BrokerBus, Injector, InjectorProvider, PrivateBusProvider, waitForPropertyChange, LogAction, LogLevel } from "@tandem/common";
import { FileEditorProvider, WebpackDependencyGraphStrategy, DependencyGraphStrategyProvider, FileCacheProvider } from "@tandem/sandbox";

describe(__filename + "#", () => {


  const loadCSS = async (content: string) => {

    const cssLoaderPath = path.join(process.cwd(), "node_modules", "css-loader");
    const addStylePath  = path.join(process.cwd(), "node_modules", "style-loader", "addStyles.js");
    const cssBasePath   = path.join(cssLoaderPath, "lib", "css-base.js");
    const bus = new BrokerBus();

    bus.register({
      execute(action: LogAction) {
        if (action.type === LogAction.LOG && (action.level & (LogLevel.WARN | LogLevel.ERROR))) {
          console.log(action.text);
        }
      }
    })

    const injector = new Injector(
      new InjectorProvider(),
      new PrivateBusProvider(bus),
      createHTMLCoreProviders(),
      createSASSSandboxProviders(),
      new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
      createJavaScriptSandboxProviders(),
      createTestSandboxProviders({
        mockFiles: {
          [cssBasePath]: fs.readFileSync(cssBasePath, "utf8"),
          [addStylePath]: fs.readFileSync(addStylePath, "utf8"),
          [process.cwd() + "/entry.scss"]: content,
          [process.cwd() + "/entry.js"]: `
            require("./entry.scss")

          `
        }
      })
    );
    FileCacheProvider.getInstance(injector).syncWithLocalFiles();

    const browser = new SyntheticBrowser(injector);
    await browser.open({
      url: process.cwd() + "/entry.js",
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

  const fuzzyTests = Array.from({ length: 0 }).map((v) => [
    generateRandomStyleSheet(5, 2).cssText.replace(/[\s\r\n\t]+/g, " "),
    generateRandomStyleSheet(5, 2).cssText.replace(/[\s\r\n\t]+/g, " ")
  ]);

  [
    [`.a { color: red; }`, `.a{ color: blue; }`],
    [`.a { color: red; }`, `.a{ }`],
    [`.a { color: red;  }`, `.a{ color: red; background: orange; }`],
    [`.a { color: red; background: orange; }`, `.a{ }`],
    [`.a { color: red; }`, `.a{ color: red; } .b { color: blue; }`],
    [`.a { color: red; }`, `.a{ color: red; } @media a { .b { color: blue; }}`],
    [`.a { color: black; }`, `.a{ color: black; } @keyframes a { 0% { color: blue; }}`],
    [`.a { color: red; } .b { color: blue; }`, `.b { color: blue; } .a{ color: red; }`],
    [`@media a { .b { color: red; }}`, `@media a { .c { color: red; }}`],

    // busted fuzzy tests
    [
      `@charset "utf-8"; @media f { .e { b: d; } .d { f: f; a: g; }} @media d { .d { b: ad; } @keyframes e { .e { e: af; } .c { b: ad; } }}`,
      `.g { b: bf; }`
    ],

    ...fuzzyTests,
  ].forEach(([oldSource, newSource]) => {
    it(`can apply a file edit from ${oldSource} to ${newSource}`, async () => {
      const a = await loadCSS(oldSource);
      const b = await loadCSS(newSource);
      const edit = a.styleSheet.createEdit().fromDiff(b.styleSheet);
      if (!edit.actions.length) throw new Error(`There are no edit actions`);
      a.fileEditor.applyEditActions(...edit.actions);
      expect((await a.reloadStylesheet()).cssText).to.equal(b.styleSheet.cssText);
    });
  });


  xit("doesn't save the file if there's a syntax error in an edit");
});