import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { RootReactComponentDependency } from "sf-front-end/dependencies";

export default class RootEditorComponent extends React.Component<any, any> {
  render() {
    return (<div className="m-editor">
      <CenterComponent {...this.props}  />
    </div>);
  }
}

export const dependency = new RootReactComponentDependency(RootEditorComponent);
