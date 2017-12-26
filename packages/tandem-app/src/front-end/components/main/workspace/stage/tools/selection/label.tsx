import "./label.scss";

import * as React from "react";
import { compose, pure } from "recompose";
import { 
  Workspace, 
  getWorkspaceNode,
  getWorkspaceSelectionBounds
} from "front-end/state";
import { SlimVMObjectType, SlimElement, getElementLabel } from "slim-dom";

export type SelectionLabelInnerProps = {
  workspace: Workspace;
  zoom: number;
};

const SelectionLabelBase = ({ workspace, zoom }: SelectionLabelInnerProps) => {

  if (zoom < 0.15) {
    return null;
  }

  const { left, top } = getWorkspaceSelectionBounds(workspace);

  const [type, id] = workspace.selectionRefs[workspace.selectionRefs.length - 1];

  const targetSelectors = workspace.targetCSSSelectors;

  if (type !== SlimVMObjectType.ELEMENT) {
    return null;
  }

  const element = getWorkspaceNode(id, workspace) as SlimElement;

  let label = getElementLabel(element);

  const titleScale = Math.max(1 / zoom, 0.3);

  const style = {
    left,
    top,
    transform: `translate(${13 * titleScale}px, -${15 * titleScale}px) scale(${titleScale})`
  };
  
  return <div className="m-selection-label" style={style}>
    { label }
  </div>;
};

const enhanceSelectionLabel = compose<SelectionLabelInnerProps, SelectionLabelInnerProps>(
  pure
);

export const SelectionLabel = enhanceSelectionLabel(SelectionLabelBase);