import "./frame-controller.scss";
import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { SyntheticVisibleNode, Frame, PCNode, isComponent } from "paperclip";
import { getBoundsSize, Translate } from "tandem-common";
import {
  canvasToolDocumentTitleClicked,
  frameModeChangeComplete,
  canvasToolPreviewButtonClicked
} from "actions";
import {
  DropdownMenuOption,
  dropdownMenuOptionFromValue
} from "../../../../../../../inputs/dropdown/controller";
import { FrameMode } from "../../../../../../../../state";

const MODE_TOGGLE_OPTIONS: DropdownMenuOption[] = [
  FrameMode.PREVIEW,
  FrameMode.DESIGN
].map(dropdownMenuOptionFromValue);

export type FrameOuterProps = {
  frame: Frame;
  sourceNode: PCNode;
  contentNode: SyntheticVisibleNode;
  translate: Translate;
};

type FrameInnerProps = {
  onTitleClick: any;
  onPreviewButtonClick: any;
  onModeChangeComplete: any;
} & FrameOuterProps;

export default compose<FrameOuterProps, FrameInnerProps>(
  pure,
  withHandlers({
    onTitleClick: ({ dispatch, frame }) => (event: React.MouseEvent<any>) => {
      dispatch(canvasToolDocumentTitleClicked(frame, event));
    },
    onPreviewButtonClick: ({ dispatch, frame }) => (
      event: React.MouseEvent<any>
    ) => {
      dispatch(canvasToolPreviewButtonClicked(frame, event));
    },
    onModeChangeComplete: ({ dispatch, frame }) => (mode: FrameMode) => {
      dispatch(frameModeChangeComplete(frame, mode));
    }
  }),
  Base => ({
    frame,
    translate,
    contentNode,
    sourceNode,
    onTitleClick,
    onModeChangeComplete,
    onPreviewButtonClick
  }: FrameInnerProps) => {
    const { width, height } = getBoundsSize(frame.bounds);

    const style = {
      width,
      height,
      left: frame.bounds.left,
      top: frame.bounds.top,
      background: "transparent"
    };

    const hasController =
      sourceNode &&
      isComponent(sourceNode) &&
      sourceNode.controllers &&
      Boolean(sourceNode.controllers.length);

    const titleScale = Math.max(1 / translate.zoom, 0.03);

    const titleStyle = {
      transform: `translateY(-${22 * titleScale}px) scale(${titleScale})`,
      transformOrigin: "top left",
      whiteSpace: "nowrap",

      // some random height to prevent text from getting cut off
      // when zooming.
      height: 30,
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: width * translate.zoom
    };

    // console.log(contentNode.metadata.mode);

    return (
      <Base
        className="m-frame"
        variant={cx({ hasController })}
        style={style}
        topBarProps={{
          style: titleStyle,
          className: "top-bar"
        }}
        titleProps={{
          text: contentNode.label || "Untitled",
          onClick: onTitleClick
        }}
        controlsProps={{
          className: "controls"
        }}
        previewButtonProps={{
          onClick: onPreviewButtonClick
        }}
        modeToggleInputProps={{
          options: MODE_TOGGLE_OPTIONS,
          value: contentNode.metadata.mode || FrameMode.DESIGN,
          onChangeComplete: onModeChangeComplete
        }}
      />
    );
  }
);
