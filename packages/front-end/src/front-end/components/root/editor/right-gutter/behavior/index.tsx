import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure, withHandlers, lifecycle, withState } from "recompose";
import { PaneComponent } from "../../../../pane";
import { getSyntheticNodeById, getSyntheticSourceNode, getSourceNodeElementRoot, PCSourceAttributeNames } from "../../../../../../paperclip";
import { getAttribute, EMPTY_OBJECT, stringifyStyle } from "../../../../../../common";
import { rawCssTextChanged, slotToggleClick, nativeNodeTypeChange, textValueChanged } from "../../../../..";

/*
TODO - pretty tab, and source tab
*/

type StylePaneOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
};

type StylePaneInnerProps = {
  onSlotToggleClick: () => any;
  onNativeTypeKeyDown: () => any;
  onTextInputKeyDown: () => any;
  value: any;
} & StylePaneOuterProps;

const BaseBehaviorPaneComponent = ({ root, onSlotToggleClick, onNativeTypeKeyDown, onTextInputKeyDown, value }: StylePaneInnerProps) => {

  const selectedNodeId = root.selectedNodeIds[0];
  if (!selectedNodeId) {
    return null;
  }
  // const syntheticNode = getSyntheticNodeById(selectedNodeId, root.browser);
  const sourceNode = getSyntheticSourceNode(selectedNodeId, root.browser);
  const sourceRoot = getSourceNodeElementRoot(sourceNode.id, root.browser);
  const isSlotContainer = Boolean(getAttribute(sourceNode, PCSourceAttributeNames.CONTAINER));
  const nativeType = getAttribute(sourceNode, PCSourceAttributeNames.NATIVE_TYPE) || "div";
  const textValue = getAttribute(sourceNode, "value");

  return <PaneComponent header="Behavior" className="m-behavior-pane">
    { sourceRoot.name === "component" ? <button onClick={onSlotToggleClick}>{ isSlotContainer ? "Remove child override" : "Make children overridable" }</button> : null }
    <div>
      { sourceNode.name !== "component" && sourceNode.name !== "text" ? <span>native type: <input defaultValue={nativeType} onKeyDown={onNativeTypeKeyDown} /> </span> : null }
    </div>
    <div>
      { sourceNode.name === "text"  ? <span>text: <input defaultValue={textValue} onKeyDown={onTextInputKeyDown} /> </span> : null }
    </div>
  </PaneComponent>;
};

const getSelectedNodeStyle = (root: RootState) => {
  const node = getSyntheticNodeById(root.selectedNodeIds[0], root.browser);
  return node && stringifyStyle(getAttribute(node, "style") || EMPTY_OBJECT).split(";").join(";\n");
}

export const BehaviorPaneComponent = compose<StylePaneInnerProps, StylePaneOuterProps>(
  pure,
  withHandlers({
    onSlotToggleClick: ({ dispatch, setValue }) => (event: React.ChangeEvent<any>) => {
      dispatch(slotToggleClick());
      event.stopPropagation();
    },
    onNativeTypeKeyDown: ({ dispatch }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        dispatch(nativeNodeTypeChange((event.target as any).value));
      }
    },
    onTextInputKeyDown: ({ dispatch }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        dispatch(textValueChanged((event.target as any).value));
      }
    }
  })
)(BaseBehaviorPaneComponent);