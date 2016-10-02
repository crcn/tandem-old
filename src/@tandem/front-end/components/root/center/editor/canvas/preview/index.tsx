import "./index.scss";

import * as React from "react";
import RegisteredComponent from "@tandem/front-end/components/registered";
import { FrontEndApplication } from "@tandem/front-end/application";
import { ISyntheticDocumentRenderer } from "@tandem/runtime";

export default class PreviewComponent extends React.Component<{ app: FrontEndApplication, renderer: ISyntheticDocumentRenderer }, any> {
  shouldComponentUpdate(props) {
    return this.props.renderer !== props.renderer;
  }

  componentDidUpdate() {
    this._update();
  }

  _update() {
    const container: HTMLElement = (this.refs as any).container;
    container.innerHTML = "";
    container.appendChild(this.props.renderer.element);
  }

  componentDidMount() {
    this._update();
  }
  render() {
    return (<div className="m-editor-stage-preview">
      <div ref="container"></div>
    </div>);
  }
}
