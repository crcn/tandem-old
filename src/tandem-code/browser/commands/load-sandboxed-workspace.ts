import { BaseStudioEditorBrowserCommand } from "./base";
import { Kernel } from "@tandem/common";
import { SyntheticBrowser, SyntheticWindow, SyntheticDOMRenderer } from "@tandem/synthetic-browser";
import { Workspace } from "@tandem/editor/browser/stores";
import {createWorkspaceRedirectRequest } from "@tandem/editor/browser/messages";
import { createTestSandboxProviders } from "@tandem/sandbox/test/helpers";

export class LoadSandboxedWorkspaceCommand extends BaseStudioEditorBrowserCommand {
  async execute() {

    if (!window["$synthetic"]) return;

    const browser = new SyntheticBrowser(new Kernel(this.kernel, createTestSandboxProviders({
      mockFiles: {
        "index.html": `
          <html>
            <head>
            </head>
            <body>
              <remote-browser title="Something" style="width: 600px; height: 400px; left: 100px; top: 100px; position: absolute;"></remote-browser>
              <div></div>
            </body>
          </html>
        `
      }
    })), new SyntheticDOMRenderer());



    await browser.open({ uri: "file:///index.html" });

    const workspace = this.editorStore.workspace = new Workspace(null);
    workspace.browser = browser;
    workspace.select(browser.document.querySelector("div"));

    if(!location.hash) {
      await this.bus.dispatch(createWorkspaceRedirectRequest(null));
    }
  }
}