import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import * as React from "react";

import { SyntheticBrowser, BaseRenderer, getMatchingCSSStyleRules, MatchedCSSStyleRule, SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser";
import { Injector, InjectorProvider, PrivateBusProvider, BrokerBus, BoundingRect } from "@tandem/common";
import { createHTMLSandboxProviders, createHTMLCoreProviders } from "@tandem/html-extension";
import { createTestSandboxProviders } from "@tandem/sandbox/test";
import { createTestMasterApplication } from "@tandem/editor/test";

import { MeasurementStageToolComponent } from "./index";

// TODO - abstract this stuff so that other stage tools be designed in Tandem

function parseUnit(unit) {
  return (unit && parseInt(unit.match(/^\d+/)[0] || 0)) || 0;
}
class MockRenderer extends BaseRenderer {
  render() {
    const styleSheet = this.document.styleSheets[0];

    this.element.innerHTML = `<style>
      ${styleSheet.cssText}
    </style>
    <div>
      ${this.document.body.innerHTML}
    </div>`;

    const rects: { [Identifier: string]: BoundingRect } = {};
    const styles = {};

    this.document.querySelectorAll("*").forEach((element) => {
      const rules = getMatchingCSSStyleRules(element);

      if (!rules) return;


      const rect = [BoundingRect.zeros()].concat(rules.reverse() as any).reduce((rect: any, rule: any) => {
        const { width, height, left, top } = rule.rule.style;
        const newRect = new BoundingRect(parseUnit(left) || rect.left, parseUnit(top) || rect.top, 0, 0);
        newRect.width = parseUnit(width) || rect.width;
        newRect.height = parseUnit(height) || rect.height;

        return newRect;
      }) as BoundingRect;

      styles[element.uid] = new SyntheticCSSStyleDeclaration();
      rects[element.uid] = rect;
    });


    this.setRects(rects, styles);
  }
}

class MockPreviewComponent extends React.Component<{ renderer: MockRenderer }, any> {
  componentDidMount() {
    (this.refs["container"] as HTMLElement).appendChild(this.props.renderer.element);
  }
  render() {
    return <span ref="container">
    </span>;
  }
}

class MockRootComponent extends React.Component<{ browser: SyntheticBrowser }, any> {
  componentDidMount() {
    this.props.browser.observe({
      dispatch: () => this.forceUpdate()
    });
  }
  render() {
    return <span>
      { React.Children.map(this.props.children, React.cloneElement) }
    </span>;
  }
}

export const renderPreview = reactEditorPreview(async () => {

  const bus = new BrokerBus();

  const injector = new Injector(
    new PrivateBusProvider(bus),
    new InjectorProvider(),
    createHTMLCoreProviders(),
    createHTMLSandboxProviders(),
    createTestSandboxProviders({
      mockFiles: {
        "index.css": `

          .box, .box1, .box2, .box3, .box4, .box5, .box6 {
            position: absolute;
            width: 100px;
            height: 100px;
            background: orange;
          }

          .box1 {
            left: 300px;
            top: 100px;
          }

          .box2 {
            left: 500px;
            top: 210px;
          }

          .box3 {
            left: 100px;
            top: 500px;
            width: 200px;
          }

          .box4 {
            background: #CCC;
            left: 330px;
            top: 150px;
            width: 200px;
            height: 200px;
          }

          .box5 {
            left: 600px;
            top: 650px;
            width: 300px;
          }

          .box6 {
            left: 630px;
            top: 100px;
          }
        `,
        "index.html": `
          <link rel="stylesheet" href="index.css" />

          <div class="box4">
            box4
          </div>
          <div class="box1">
            box1
          </div>

          <div class="box2">
            box2
          </div>

          <div class="box3">
            box3
          </div>

          <div class="box5">
            box5
          </div>

          <div class="box6">
            box6
          </div>
        `
      }
    })
  );

  const renderer = new MockRenderer();
  renderer.start();
  const browser = new SyntheticBrowser(injector, renderer);
  const workspace = new Workspace();
  workspace.browser = browser;

  browser.open({ url: "index.html" }).then(() => {

    workspace.select(browser.document.querySelector(".box6"));
    browser.document.querySelector(".box1").metadata.set(MetadataKeys.HOVERING, true);

  });

  return <MockRootComponent browser={browser}>
    <MeasurementStageToolComponent workspace={workspace} />
    <MockPreviewComponent renderer={renderer} />
  </MockRootComponent>
});
