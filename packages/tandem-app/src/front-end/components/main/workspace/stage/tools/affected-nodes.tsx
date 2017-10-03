import "./affected-nodes.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { Workspace, SyntheticBrowser } from "front-end/state";

type AffectedNodesToolOuterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  zoom: number;
};

const AffectedNodesToolBase = (props: AffectedNodesToolOuterProps) => {
  return <div className="m-affected-nodes">
    AFF
  </div>;
};

export const AffectedNodesTool = compose<AffectedNodesToolOuterProps, AffectedNodesToolOuterProps>(
  pure
)(AffectedNodesToolBase);