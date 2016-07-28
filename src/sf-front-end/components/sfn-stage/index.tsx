import "./index.scss";

import * as React from "react";
import HeaderComponent from "./header/index";
import FooterComponent from "./footer/index";
import CanvasComponent from "./canvas/index";
import { ReactComponentFactoryFragment } from "sf-front-end/fragments/index";
import { PreviewFacade } from "sf-front-end/facades";

export default class StageComponent extends React.Component<any, any> {
  render() {
    var file = this.props.file;
    var entity = file.entity;

    const preview = PreviewFacade.getInstance(this.props.fragments);

    // entity might not have been loaded yet
    if (!entity) return null;
    return (<div className="m-editor-stage noselect">
      <HeaderComponent {...this.props} preview={preview} />
      <CanvasComponent {...this.props} entity={entity}  preview={preview} />
      <FooterComponent {...this.props} preview={preview} />
    </div>);
  }
}


export const fragment = new ReactComponentFactoryFragment("components/stage/sfn", StageComponent);
