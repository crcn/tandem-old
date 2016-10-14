import "./index.scss";

import * as React from "react";
import { Editor } from "@tandem/editor/models";
import { RegisteredComponent } from "@tandem/editor/components/common";
import { FooterComponentFactoryDependency } from "@tandem/editor/dependencies";

class FooterComponent extends React.Component<{ editor: Editor }, any> {
  render() {
    const { scale } = this.props.editor.transform;
    return (<div className="m-preview-footer">
      {Math.round((scale || 0) * 100)}%
      <RegisteredComponent {...this.props} ns={FooterComponentFactoryDependency.getNamespace("**")} />
    </div>);
  }
}

export default FooterComponent;
