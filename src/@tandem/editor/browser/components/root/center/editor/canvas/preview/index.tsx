import "./index.scss";

import * as React from "react";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { ISyntheticDocumentRenderer } from "@tandem/synthetic-browser";

export default class PreviewComponent extends React.Component<{ renderer: ISyntheticDocumentRenderer }, any> {

  shouldComponentUpdate(props) {
    return this.props.renderer !== props.renderer;
  }

  componentDidUpdate() {
    this._update();
  }

  _update() {
    const container = (this.refs as any).container;
    container.innerHTML = "";

    // shadow root to ensure that any imported CSS doesn't foo with the rest
    // of the application
    const div = document.createElement("div") as any;
    div.createShadowRoot();
    div.shadowRoot.appendChild(this.props.renderer.element);
    this.props.renderer.start();
    container.appendChild(div);
  }

  componentDidMount() {
    this._update();
  }


  render() {
    return (<div ref="container" className="m-editor-stage-preview">
    </div>);
  }
}
