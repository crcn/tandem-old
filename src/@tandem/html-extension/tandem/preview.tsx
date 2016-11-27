import "reflect-metadata";
import "@tandem/editor/browser/style.ts"

import "./preview.scss";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { GutterComponent } from "@tandem/uikit";
import { ReceiverService } from "@tandem/editor/common";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { createTestSandboxProviders } from "@tandem/sandbox/test";
import { createTestMasterApplication } from "@tandem/editor/test";
import { SyntheticBrowser, NoopRenderer } from "@tandem/synthetic-browser";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { createHTMLSandboxProviders, createHTMLCoreProviders } from "@tandem/html-extension";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { Injector, PrivateBusProvider, BrokerBus, InjectorProvider, RootApplicationComponent } from "@tandem/common";
import {
  LayersPaneComponent,
  HTMLStylePaneComponent,
  ElementCSSPaneComponent,
  ElementCSSInspectorComponent,
  ElementAttributesPaneComponent,
} from "@tandem/html-extension/editor/browser/components";

export const renderPreview = reactEditorPreview(async () => {

  const bus = new BrokerBus();
  const injector = new Injector(
    new InjectorProvider(),
    new PrivateBusProvider(bus),
    createHTMLSandboxProviders(),
    createHTMLEditorBrowserProviders(),
    new ApplicationServiceProvider("receiver", ReceiverService),
    createTestSandboxProviders({
      mockFiles: {
        "index.css": `
        .container {
          font-family: Helvetica;
          font-weight: 100;
          line-height: 0.05em;
          font-size: 12pt;
          color: red;
          text-align: justify;
          display: block;
          mix-blend-mode: overlay;
          background: rgba(255, 100, 255, 1), lime overlay;
          box-shadow: inset 1 2 3 4 indianred;
          box-sizing: border-box;
          padding-right: border-box;
          filter: contrast(50%) brightness(200%) drop-shadow(0px 0px 0px #F60);
          left: 10px;
          top: 10px;
        }

        div {
          color: blue;
          width: 100px;
          height: 200px;
          opacity: 0.5;
        }

        span {
          letter-spacing: 0.01em;
          color: red;
          display: block;
        }
        `,
        "index.html": `
          <link rel="stylesheet" href="index.css" />
          <div id="controls">
            Hello World
          </div>
          <span>
            <div class="container" style="color:#444;">
            </div>
          </span>
          <!-- a comment -->
        `
      }
    })
  );

  const app = new ServiceApplication(injector);
  await app.initialize();

  const workspace = injector.inject(new Workspace());
  const browser = workspace.browser = new SyntheticBrowser(injector, new NoopRenderer());
  await browser.open({ url: "index.html" });

  const document = browser.document;

  document.querySelector("#controls").metadata.set(MetadataKeys.HOVERING, true);
  workspace.select([document.querySelector(".container")]);

  return <RootApplicationComponent bus={bus} injector={injector}>
    <div className="editor flex">
      <GutterComponent className="left">
        <LayersPaneComponent workspace={workspace} />
      </GutterComponent>
      <div className="center">
        center
      </div>
      <GutterComponent className="right">
        <ElementAttributesPaneComponent workspace={workspace} />
        <ElementCSSInspectorComponent workspace={workspace} />
      </GutterComponent>
    </div>
  </RootApplicationComponent>
});