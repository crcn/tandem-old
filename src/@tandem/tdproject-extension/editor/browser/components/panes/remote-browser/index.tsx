import  "./index.scss";
import React =  require("react");
import { TextInputComponent } from "@tandem/uikit";
import { BaseApplicationComponent } from "@tandem/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { InjectComponent } from "./inject";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";
import { RemoteBrowserPaneSizeComponent } from "./size";

export class RemoteBrowserPaneComponent extends BaseApplicationComponent<{ workspace }, any> {

  get selectedRemoteBrowser() {
    const { selection } = this.props.workspace;
    if (selection.length !== 1 || selection[0].nodeName !== "remote-browser") return null;
    
    return selection[0] as SyntheticRemoteBrowserElement;
  }

  render() {
    const remoteBrowser = this.selectedRemoteBrowser;
    if (!remoteBrowser) return null;
    
    return <div>
      <InjectComponent remoteBrowser={remoteBrowser} />
      <hr />
      < RemoteBrowserPaneSizeComponent workspace={this.props.workspace} remoteBrowser={remoteBrowser} />
    </div>
  }
}