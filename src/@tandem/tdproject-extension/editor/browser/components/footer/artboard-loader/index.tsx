import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic/elements";

export class ArtboardLoaderComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    const { workspace } = this.props;
    if (!workspace) return null;
    workspace.documentQuerier.queriedElements
    const loading = !!(workspace.documentQuerier.queriedElements.filter((element) => element.tagName === "artboard") as SyntheticTDArtboardElement[]).find((artboard) => {
      return artboard.loading;
    });

    return <span className="spinner" style={{display: loading ? "inline-block" : "none", top: "1px" }} />;
  }
}