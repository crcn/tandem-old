import "./index.scss";

import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import { pure, compose, withHandlers } from "recompose";
import {
  toolbarToolClicked,
  editorTabClicked,
  editorTabCloseButtonClicked
} from "actions";
import { ToolType, Editor } from "../../../../../state";
import { Dispatch } from "redux";
const { EditorTab } = require("./tab.pc");

export type ToolbarOuterProps = {
  editor: Editor;
  dispatch: Dispatch<any>;
};

type ToolbarInnerProps = {
  onPointerClick: any;
  onTextClick: any;
  onTabClick: any;
  onComponentClick: any;
  onElementClick: any;
  onTabCloseButtonClick: any;
} & ToolbarOuterProps;

export default compose<ToolbarInnerProps, ToolbarOuterProps>(
  pure,
  withHandlers({
    onTabClick: ({ dispatch }) => uri => {
      dispatch(editorTabClicked(uri));
    },
    onTabCloseButtonClick: ({ dispatch }) => (uri, event) => {
      dispatch(editorTabCloseButtonClicked(uri));
      event.stopPropagation();
    },
    onPointerClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.POINTER));
    },
    onTextClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.TEXT));
    },
    onComponentClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.COMPONENT));
    },
    onElementClick: ({ dispatch }) => () => {
      dispatch(toolbarToolClicked(ToolType.ELEMENT));
    }
  }),
  Base => ({
    editor,
    onTabClick,
    onTabCloseButtonClick,
    onPointerClick,
    onTextClick,
    onComponentClick,
    onElementClick
  }: ToolbarInnerProps) => {
    const tabs = editor.tabUris.map(uri => {
      return (
        <EditorTab
          className={cx("tab", { selected: editor.activeFilePath === uri })}
          xButtonProps={{
            className: "x-button",
            onClick: event => onTabCloseButtonClick(uri, event)
          }}
          labelProps={{
            text: path.basename(uri)
          }}
          key={uri}
          onClick={() => onTabClick(uri)}
        />
      );
    });

    return (
      <Base
        className="m-toolbar"
        pointerProps={{
          onClick: onPointerClick
        }}
        textProps={{
          onClick: onTextClick
        }}
        componentProps={{
          onClick: onComponentClick
        }}
        elementProps={{
          onClick: onElementClick
        }}
        tabsProps={{
          children: tabs
        }}
      />
    );
  }
);
