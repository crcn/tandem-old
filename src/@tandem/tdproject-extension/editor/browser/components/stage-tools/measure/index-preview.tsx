import { reactEditorPreview } from "@tandem/editor/browser/preview";
import * as React from "react";

import { SyntheticBrowser, BaseRenderer } from "@tandem/synthetic-browser";
import { Injector, InjectorProvider, PrivateBusProvider, BrokerBus } from "@tandem/common";
import { createHTMLSandboxProviders, createHTMLCoreProviders } from "@tandem/html-extension";
import { createTestSandboxProviders } from "@tandem/sandbox/test";
import { createTestMasterApplication } from "@tandem/editor/test";

import { MeasruementStageToolComponent } from "./index";

// TODO - abstract this stuff so that other stage tools be designed in Tandem

class MockRenderer extends BaseRenderer {
  render() {
    console.log("RENDER IT");
  }
}

export const renderPreview = reactEditorPreview(() => {

  const bus = new BrokerBus();

  const injector = new Injector(
    new PrivateBusProvider(bus),
    new InjectorProvider(),
    createHTMLCoreProviders(),
    createHTMLSandboxProviders(),
    createTestSandboxProviders({
      mockFiles: {
        "index.css": `
          .box {

          }
        `,
        "index.html": `
          <link rel="stylesheet" href="index.css" />
          <div class=".box">
          </div>
        `
      }
    })
  );

  const renderer = new MockRenderer();
  renderer.start();
  const browser = new SyntheticBrowser(injector, renderer);

  browser.open({ url: "index.html" }).then((done) => {
    console.log(browser.document.textContent);
  })

  return <div>
    <MeasruementStageToolComponent worksapce={null} />
  </div>
});
