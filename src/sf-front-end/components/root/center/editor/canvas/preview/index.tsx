import "./index.scss";

import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";

export default class PreviewComponent extends React.Component<{ zoom: number, entity: any }, any> {
  render() {
    return (<div className="m-editor-stage-preview reset-all">
        <RegisteredComponent {...this.props} ns="components/preview" />
    </div>);
  }
}
