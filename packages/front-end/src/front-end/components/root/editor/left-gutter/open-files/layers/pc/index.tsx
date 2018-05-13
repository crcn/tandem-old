import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { RootState } from "../../../../../../../state";
import { SyntheticWindow, SyntheticBrowser, SyntheticNode, SyntheticDocument, SyntheticObjectType, EDITOR_NAMESPACE } from "../../../../../../../../paperclip";
import { compose, pure, withHandlers } from "recompose"
import { createTreeLayerComponents } from "../../../../../../layers";
import { getAttribute, EMPTY_ARRAY, getNestedTreeNodeById } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { pcLayerClick, pcLayerMouseOut, pcLayerMouseOver, pcLayerExpandToggleClick, pcLayerDroppedNode, RESIZER_STOPPED_MOVING } from "../../../../../../../actions";
import { StructReference } from "../../../../../../../../common";

const DRAG_TYPE = "SYNTHETIC_NODE";

const {TreeNodeLayerComponent} = createTreeLayerComponents({
  actionCreators: {
    treeLayerDroppedNode: pcLayerDroppedNode,
    treeLayerClick: pcLayerClick,
    treeLayerExpandToggleClick: pcLayerExpandToggleClick,
    treeLayerMouseOut: pcLayerMouseOut,
    treeLayerMouseOver: pcLayerMouseOver
  },
  dragType: DRAG_TYPE
});

type SyntheticWindowLayersOuterProps = {
  hoveringNodeIds: string[];
  selectedReferences: string[];
  dispatch: Dispatch<any>;
  window: SyntheticWindow;
  browser: SyntheticBrowser;
};

type SyntheticWindowLayersInnerProps = {

} & SyntheticWindowLayersOuterProps;

const BaseSyntheticWindowLayersComponent = ({ hoveringNodeIds, selectedReferences, dispatch, window, browser }: SyntheticWindowLayersInnerProps) => {
  if(!window) {
    return null;
  }
  return <div className="m-synthetic-window-layers">
    {
      (window.documents || EMPTY_ARRAY).map(document => {
        return <TreeNodeLayerComponent key={document.id} node={document.root} depth={0} hoveringNodeIds={hoveringNodeIds} selectedNodeIds={selectedReferences} dispatch={dispatch} />
      })
    }
  </div>;
};

export const SyntheticWindowLayersComponent = compose<SyntheticWindowLayersInnerProps, SyntheticWindowLayersOuterProps>(
  pure
)(BaseSyntheticWindowLayersComponent);