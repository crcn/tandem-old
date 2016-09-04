import "./index.scss";

import * as React from "react";
import { Editor } from "tandem-front-end/models";
import RegisteredComponent from "tandem-front-end/components/registered";

class FooterComponent extends React.Component<{ editor: Editor }, any> {
  render() {

    // TODO - add more project information here such as file name
    // TODO - ability to edit canvas width & height in the footer
    // TODO - each one of these should be slideable, or be their own button
    const { scale } = this.props.editor.transform;

    return (<div className="m-preview-footer">
      {Math.round((scale || 0) * 100)}%

      <RegisteredComponent {...this.props} ns="components/stage/footer" />
    </div>);
  }
}

export default FooterComponent;
