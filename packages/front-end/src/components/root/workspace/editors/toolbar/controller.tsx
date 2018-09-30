import "./index.scss";

import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import {
  toolbarToolClicked,
  editorTabClicked,
  editorTabCloseButtonClicked
} from "../../../../../actions";
import { ToolType, EditorWindow } from "../../../../../state";
import { Dispatch } from "redux";
import { BaseToolbarProps } from "./view.pc";
import { EditorTab } from "./tab.pc";

export type Props = {
  editorWindow: EditorWindow;
  dispatch: Dispatch<any>;
};

type InnerProps = {
  onPointerClick: any;
  onTextClick: any;
  onTabClick: any;
  onComponentClick: any;
  onElementClick: any;
  onTabCloseButtonClick: any;
} & Props;

export default (Base: React.ComponentClass<BaseToolbarProps>) =>
  class ToolbarController extends React.PureComponent<Props> {
    onTabClick = uri => {
      this.props.dispatch(editorTabClicked(uri));
    };
    onTabCloseButtonClick = (uri, event) => {
      this.props.dispatch(editorTabCloseButtonClicked(uri));
      event.stopPropagation();
    };
    onPointerClick = () => {
      this.props.dispatch(toolbarToolClicked(ToolType.POINTER));
    };
    onTextClick = () => {
      this.props.dispatch(toolbarToolClicked(ToolType.TEXT));
    };
    onComponentClick = () => {
      this.props.dispatch(toolbarToolClicked(ToolType.COMPONENT));
    };
    onElementClick = () => {
      this.props.dispatch(toolbarToolClicked(ToolType.ELEMENT));
    };

    render() {
      const { editorWindow } = this.props;
      const {
        onTabCloseButtonClick,
        onTabClick,
        onPointerClick,
        onTextClick,
        onComponentClick,
        onElementClick
      } = this;

      const tabs = editorWindow.tabUris.map(uri => {
        return (
          <EditorTab
            className="tab"
            variant={cx({ selected: editorWindow.activeFilePath === uri })}
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
  };
