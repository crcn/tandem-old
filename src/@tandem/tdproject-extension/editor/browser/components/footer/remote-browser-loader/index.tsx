import React =  require("react");
import { Status } from "@tandem/common/status";
import { Workspace } from "@tandem/editor/browser/stores";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic/elements";
import { StatusComponent } from "@tandem/editor/browser/components";

export class RemoteBrowserLoaderComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    if (!workspace) return null;
    workspace.documentQuerier.queriedElements
    const found = (workspace.documentQuerier.queriedElements.filter((element) => element.tagName === "remote-browser") as SyntheticRemoteBrowserElement[]).find((remoteBrowser) => {
      return remoteBrowser.status && (remoteBrowser.status.type === Status.LOADING || remoteBrowser.status.type === Status.ERROR);
    });

    return <StatusComponent status={found && found.status} />

  }
}