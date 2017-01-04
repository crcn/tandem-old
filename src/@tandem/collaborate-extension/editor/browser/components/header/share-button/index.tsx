import "./share-button.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";
import { ShareWorkspaceRequest } from "@tandem/collaborate-extension/editor/common";

export class ShareButtonComponent extends BaseApplicationComponent<any, any> {

  share = (event?: React.MouseEvent<any>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.bus.dispatch(new ShareWorkspaceRequest());
  }

  componentDidMount = () => {
    if (window["showShareWorkspacePrompt"]) {
      this.share();
    }
  }

  render() {
    return <a href="#" className="share-button" onClick={this.share}>
      Share
    </a>
  }
}