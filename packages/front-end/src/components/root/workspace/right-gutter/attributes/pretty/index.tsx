import * as React from "react";
import { compose } from "recompose";
import { uniq } from "lodash";
import { TextSettingsComponent } from "./text";
import { Dispatch } from "redux";
import { SyntheticNode, PCSourceTagNames, SyntheticTextNode } from "paperclip";
import { PaneComponent } from "../../../../../pane";

type PropertiesProps = {
  selectedNodes: SyntheticNode[];
  dispatch: Dispatch<any>;
};

export const PrettyAttributesComponent = ({
  selectedNodes,
  dispatch
}: PropertiesProps) => {
  const nodeNames = uniq(selectedNodes.map(node => node.name));

  let content = null;
  if (nodeNames.length > 1) {
    content = <span>Different node types selected</span>;
  } else {
    const commonNodeName = nodeNames[0];
    if (commonNodeName === PCSourceTagNames.TEXT) {
      content = (
        <TextSettingsComponent
          selectedNodes={selectedNodes as SyntheticTextNode[]}
          dispatch={dispatch}
        />
      );
    }
  }

  return content;
  // return <PaneComponent header="Settings">
  //   {content}
  // </PaneComponent>
};
