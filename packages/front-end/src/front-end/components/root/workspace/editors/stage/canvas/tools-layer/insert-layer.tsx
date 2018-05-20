import "./insert-layer.scss";
import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { Canvas, ToolType, Editor } from "../../../../../../../state";
import { CANVAS_MOTION_RESTED, insertToolFinished } from "../../../../../../../actions";
import { Dispatch } from "redux";
import { startDOMDrag, Bounds, getBoundsSize } from "../../../../../../../../common";
import { SyntheticWindow } from "../../../../../../../../paperclip";

type InsertLayerOuterProps = {
  toolType: ToolType;
  editor: Editor;
  window: SyntheticWindow;
  dispatch: Dispatch<any>;
};

type InsertLayerInnerProps = {
  previewBounds: Bounds;
  setPreviewBounds: (bounds: Bounds) => any;
  onMouseDown: (event: React.MouseEvent<any>) => any;
} & InsertLayerOuterProps;

const CURSOR_MAP = {
  [ToolType.ARTBOARD]: "crosshair",
  [ToolType.RECTANGLE]: "crosshair",
  [ToolType.TEXT]: "text"
};

const TEXT_PADDING = 5;

const BaseInsertLayer = ({ toolType, editor, onMouseDown, previewBounds }: InsertLayerInnerProps) => {
  if (toolType == null) {
    return null;
  }
  const translate = editor.canvas.translate;

  const outerStyle = {
    cursor: CURSOR_MAP[toolType] || "default",
    transform: `translate(${-translate.left / translate.zoom}px, ${-translate.top / translate.zoom}px) scale(${1 / translate.zoom}) translateZ(0)`,
    transformOrigin: `top left`
  };


  let preview;

  if (previewBounds) {
    const { width, height } = getBoundsSize(previewBounds);
    preview = <div>
      <div className="preview" style={{
        left: previewBounds.left,
        top: previewBounds.top,
        width,
        height
      }} />
      <div className="preview-text" style={{
        left: previewBounds.left + width + TEXT_PADDING,
        top: previewBounds.top + height + TEXT_PADDING
      }}>
        {width} x {height}
      </div>
    </div>;
  }

  return <div className="m-insert-layer" style={outerStyle} onMouseDown={onMouseDown}>
    {
      preview
    }
  </div>;
};

const enhance = compose<InsertLayerInnerProps, InsertLayerOuterProps>(
  pure,
  withState("previewBounds", "setPreviewBounds", null),
  withHandlers({
    onMouseDown: ({ toolType, window, setPreviewBounds, dispatch }: InsertLayerInnerProps) => (startEvent: React.MouseEvent<any>) => {

      const startX = startEvent.clientX;
      const startY = startEvent.clientY;

      const getBounds = (delta = { x: 0, y: 0 }) => ({
        left: Math.min(startX, startX + delta.x),
        right: Math.max(startX, startX + delta.x),
        top: Math.min(startY, startY + delta.y),
        bottom: Math.max(startY, startY + delta.y),
      });

      if (toolType === ToolType.TEXT) {
        return dispatch(insertToolFinished(getBounds(), window.location));
      }

      startDOMDrag(startEvent, () => { }, (event: MouseEvent, { delta }) => {
        setPreviewBounds(getBounds(delta));
      }, (event: MouseEvent, { delta}) => {
        setPreviewBounds(null);

        // beat click
        setTimeout(() => {
          dispatch(insertToolFinished(getBounds(delta), window.location));
        });
      });
    }
  })
);

export const InsertLayer = enhance(BaseInsertLayer);