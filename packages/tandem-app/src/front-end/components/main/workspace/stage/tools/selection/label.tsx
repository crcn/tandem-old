import "./label.scss";

import * as React from "react";
import { compose, pure } from "recompose";
import { 
  Workspace, 
  SyntheticBrowser,
  SyntheticElement,
  getSyntheticNodeById,
  getSyntheticElementLabel,
  getWorkspaceSelectionBounds
} from "front-end/state";
import { SlimVMObjectType } from "slim-dom";

export type SelectionLabelInnerProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  zoom: number;
};

const SelectionLabelBase = ({ workspace, browser, zoom }: SelectionLabelInnerProps) => {

  if (zoom < 0.15) {
    return null;
  }

  const { left, top } = getWorkspaceSelectionBounds(workspace);

  const [type, id] = workspace.selectionRefs[workspace.selectionRefs.length - 1];

  const targetSelectors = workspace.targetCSSSelectors;

  if (type !== SlimVMObjectType.ELEMENT) {
    return null;
  }

  const element = getSyntheticNodeById(browser, id) as SyntheticElement;


  let label = getSyntheticElementLabel(element);

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