import "reflect-metadata";
import "@tandem/editor/browser/style.ts"

import "./preview.scss";
import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { GutterComponent } from "@tandem/uikit";
import { ReceiverService } from "@tandem/editor/common";
// import { WorkspaceComponent } from "@tandem/editor/browser/components/pages";
import { WorkspaceTitlebarComponent } from "@tandem/editor/browser/components/pages/workspace/titlebar";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { createTestSandboxProviders } from "@tandem/sandbox/test";
import { createTestMasterApplication } from "@tandem/editor/test";
import { SyntheticBrowser, NoopRenderer, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { ServiceApplication, ApplicationServiceProvider } from "@tandem/core";
import { createHTMLSandboxProviders, createHTMLCoreProviders } from "@tandem/html-extension";
import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/stores";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { Injector, PrivateBusProvider, BrokerBus, InjectorProvider, RootApplicationComponent } from "@tandem/common";
import {
  LayersPaneComponent,
  HTMLStylePaneComponent,
  ElementCSSPaneComponent,
  ElementCSSInspectorComponent,
  ElementAttributesPaneComponent,
  CSSAnimationComponent,
} from "@tandem/html-extension/editor/browser/components";

export const createBodyElement = reactEditorPreview(async () => {

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

        @font-face {
          font-family: "Test Family 1";
          src: url(./font.ttf);
        }

        @font-face {
          font-family: "Test Family 2";
          src: url(./font2.ttf);
        }
        
        .container {
          font-family: Helvetica;
          font-weight: 100;
          line-height: 0.05em;
          font-size: 12pt;
          color: red;
          text-align: justify;
          display: flex;
          mix-blend-mode: overlay;
          background: rgba(255, 100, 255, 1), lime overlay;
          box-shadow: inset 1px 2px 3px 4px indianred;
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

        * {
          padding: 0;
        }

        span, .container {
          color: red;
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
  await browser.open({ uri: "index.html" });

  const document = browser.document;

  document.querySelector("#controls").metadata.set(MetadataKeys.HOVERING, true);
  (document.querySelector(".container") as SyntheticHTMLElement).metadata.set(MetadataKeys.HOVERING, true);
  workspace.select([document.querySelector(".container")]);


  return <RootApplicationComponent bus={bus} injector={injector}>
    <div className="td-workspace">
      <WorkspaceTitlebarComponent />
      <div className="td-workspace-mid">
        <GutterComponent className="left">
          <LayersPaneComponent workspace={workspace} />
        </GutterComponent>
        <div className="m-editor-stage">
          <div className="content">
            content
          </div>
          <GutterComponent className="bottom hide">
            <CSSAnimationComponent workspace={workspace} />
          </GutterComponent>
        </div>
        <GutterComponent className="right">
          <ElementAttributesPaneComponent workspace={workspace} />
          <ElementCSSInspectorComponent workspace={workspace} rule={new MergedCSSStyleRule(document.querySelector(".container") as any)} />
        </GutterComponent>
      </div>
    </div>
  </RootApplicationComponent>
});