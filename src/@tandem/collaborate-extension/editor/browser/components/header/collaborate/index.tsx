import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent, inject, ApplicationConfigurationProvider, Status } from "@tandem/common";
import ColorHash = require("color-hash");
import cx = require("classnames");
import { 
  ShareWorkspaceRequest, 
  RootCollaboratorStoreProvider, 
  CollaborateRootStore 
} from "@tandem/collaborate-extension/editor/common";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";

export class CollaborateHeaderComponent extends BaseApplicationComponent<any, any> {

  @inject(RootCollaboratorStoreProvider.ID)
  private _root: CollaborateRootStore;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorBrowserConfig;

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
    const disabled = this._root.sharingStatus.type === Status.LOADING;
    return <div className="collaborate-header">
      <ul className="peers">
        {
          this._root.collaborators.map((collaborator) => {
            return <li style={{ borderColor: ca.hex(collaborator.id), color: ca.hex(collaborator.id) }}></li>;
          })
        }
      </ul>
      { this._config.isPeer ? null : <a href="#" className={cx({ "share-button": true, disabled: disabled})} onClick={disabled ? undefined : this.share}>
        Share 
      </a> }
    </div>
  }
}