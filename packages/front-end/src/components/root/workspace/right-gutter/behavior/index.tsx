import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure, withHandlers, lifecycle, withState } from "recompose";
import { PaneComponent } from "../../../../pane";
import {
  getSyntheticNodeById,
  getSyntheticSourceNode,
  getSourceNodeElementRoot,
  PCVisibleNode
} from "paperclip";
import { getAttribute, EMPTY_OBJECT, stringifyStyle } from "tandem-common";
import {
  rawCssTextChanged,
  slotToggleClick,
  nativeNodeTypeChange,
  textValueChanged
} from "../../../../..";
import { VariantInput } from "../variant-input";

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

const BaseBehaviorPaneComponent = ({
  dispatch,
  root,
  onSlotToggleClick,
  onNativeTypeKeyDown,
  onTextInputKeyDown,
  value
}: StylePaneInnerProps) => {
  const selectedNodeId = root.selectedNodeIds[0];
  if (!selectedNodeId) {
    return null;
  }
  const syntheticNode = getSyntheticNodeById(selectedNodeId, root.browser);
  const sourceNode = getSyntheticSourceNode(
    selectedNodeId,
    root.browser
  ) as PCVisibleNode;
  const sourceRoot = getSourceNodeElementRoot(
    sourceNode.id,
    root.browser
  ) as PCVisibleNode;
  const isSlotContainer = Boolean(sourceNode.attributes.undefined.container);
  const nativeType = sourceNode.attributes.undefined.container || "div";
  const textValue = getAttribute(sourceNode, "value");

  return (
    <PaneComponent header="Behavior" className="m-behavior-pane">
      {sourceRoot.name === "component" ? (
        <button onClick={onSlotToggleClick}>
          {isSlotContainer
            ? "Remove child override"
            : "Make children overridable"}
        </button>
      ) : null}
      <div>
        {sourceNode.name !== "component" && sourceNode.name !== "text" ? (
          <span>
            native type:{" "}
            <input defaultValue={nativeType} onKeyDown={onNativeTypeKeyDown} />{" "}
          </span>
        ) : null}
      </div>
      <div>
        {sourceNode.name === "text" ? (
          <span>
            text:{" "}
            <input defaultValue={textValue} onKeyDown={onTextInputKeyDown} />{" "}
          </span>
        ) : null}
      </div>
      <VariantInput root={root} node={syntheticNode} dispatch={dispatch} />
    </PaneComponent>
  );
};

const getSelectedNodeStyle = (root: RootState) => {
  const node = getSyntheticNodeById(root.selectedNodeIds[0], root.browser);
  return (
    node &&
    stringifyStyle(getAttribute(node, "style") || EMPTY_OBJECT)
      .split(";")
      .join(";\n")
  );
};

export const BehaviorPaneComponent = compose<
  StylePaneInnerProps,
  StylePaneOuterProps
>(
  pure,
  withHandlers({
    onSlotToggleClick: ({ dispatch, setValue }) => (
      event: React.ChangeEvent<any>
    ) => {
      dispatch(slotToggleClick());
      event.stopPropagation();
    },
    onNativeTypeKeyDown: ({ dispatch }) => (
      event: React.KeyboardEvent<any>
    ) => {
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
