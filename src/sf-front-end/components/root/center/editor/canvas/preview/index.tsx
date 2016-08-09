import "./index.scss";

import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { CANVAS_SIZE } from "sf-front-end/constants";


export default class PreviewComponent extends React.Component<any, any> {
  render() {

    const style = {
      zoom: this.props.zoom,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE
    };

    return (<div className="m-editor-stage-preview" style={style}>
      <div className="m-editor-stage-preview-inner">
        <RegisteredComponent {...this.props} ns="components/preview" />
      </div>
    </div>);
  }
}
