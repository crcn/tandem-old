import "./index.scss";

import * as React from "react";
import RegisteredComponent from "tandem-front-end/components/registered";
import { FrontEndApplication } from "tandem-front-end/application";

export default class PreviewComponent extends React.Component<{ app: FrontEndApplication }, any> {
  componentDidMount() {
    (this.refs as any).container.appendChild(this.props.app.editor.browser.renderer.element);

  }
  render() {
    return (<div className="m-editor-stage-preview">
      <div ref="container"></div>
    </div>);
  }
}
