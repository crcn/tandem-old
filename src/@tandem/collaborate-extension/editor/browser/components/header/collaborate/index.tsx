import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent, inject } from "@tandem/common";
import ColorHash = require("color-hash");
import { ShareWorkspaceRequest, RootCollaboratorStoreProvider, CollaborateRootStore } from "@tandem/collaborate-extension/editor/common";

export class CollaborateHeaderComponent extends BaseApplicationComponent<any, any> {

  @inject(RootCollaboratorStoreProvider.ID)
  private _root: CollaborateRootStore;

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

    const ca = new ColorHash();
    return <div className="collaborate-header">
      <ul className="peers">
        {
          this._root.collaborators.map((collaborator) => {
            return <li style={{ borderColor: ca.hex(collaborator.id), color: ca.hex(collaborator.id) }}></li>;
          })
        }
      </ul>
      <a href="#" className="share-button" onClick={this.share}>
        Share
      </a>
    </div>
  }
}