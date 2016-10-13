import {
  IMarkupDOMCaster,
  SyntheticBrowser,
  SyntheticDOMCasterDependency,
} from "@tandem/synthetic-browser";
import { JS_MIME_TYPE } from "@tandem/common";
import * as _ReactDOM from "react-dom";
import * as _React from "react";


export class ReactDOMNodeCaster implements IMarkupDOMCaster {
  async cast(exports: any, browser: SyntheticBrowser) {

    const { window }   = browser;
    const { document } = window;

    const React = await browser.sandbox.importer.import(JS_MIME_TYPE, "react") as {
      Component: {
        new(props: any): _React.Component<any, any>
      },
      createElement(...rest): any
    };

    const ReactDOM = await browser.sandbox.importer.import(JS_MIME_TYPE, "react-dom") as any;

    const componentClasses = {};

    for (const key in exports) {
      const value = exports[key];
      if (value && value.prototype instanceof React.Component) {
        componentClasses[key] = value;
      }
    }

    class GroupComponent extends React.Component {
      render() {
        const children = [];
        const { componentClasses } = this.props;
        for (const key in componentClasses) {

          // the component is being into the global namespace, so pass the window object as the props
          children.push(React.createElement(componentClasses[key], Object.assign({}, window["reactProps"] || window, { key: key })));
        }

        return <div>
          { children }
        </div>;
      }
    }

    const element = browser.window.document.createElement("div");

    return new Promise((resolve) => {
      ReactDOM.render(<GroupComponent componentClasses={componentClasses} />, element, () => {
        resolve(element);
      });
    });
  }
}

export const reactExtensionDependencies = [
  new SyntheticDOMCasterDependency("react", new ReactDOMNodeCaster())
];