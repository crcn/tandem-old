import "./index.scss";

import * as React from "react";
import RegisteredComponent from "sf-front-end/components/registered";
import { PreviewFacade } from "sf-front-end/facades";

class FooterComponent extends React.Component<{ preview: PreviewFacade }, any> {
  render() {

    // TODO - add more project information here such as file name
    // TODO - ability to edit canvas width & height in the footer
    // TODO - each one of these should be slideable, or be their own button
    const { zoom } = this.props.preview;

    return (<div className="m-preview-footer">
      {Math.round((zoom || 0) * 100)}%

      <RegisteredComponent {...this.props} ns="components/stage/footer" />
    </div>);
  }
}

export default FooterComponent;
