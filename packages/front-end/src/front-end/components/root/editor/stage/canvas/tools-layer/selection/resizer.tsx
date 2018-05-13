import "./resizer.scss";
import React =  require("react");
import { debounce } from "lodash";
import { pure, compose, withHandlers } from "recompose";
import { RootState, getBoundedSelection, getSelectionBounds } from "../../../../../../../state";
import { resizerMoved, resizerStoppedMoving, resizerMouseDown, resizerStartDrag } from "../../../../../../../actions";
import { startDOMDrag, mergeBounds, moveBounds, Point } from "../../../../../../../../common";
import { Dispatch } from "redux";
import { Path } from "./path";

export type ResizerOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
  zoom: number;
}

export type ResizerInnerProps = {
  onMouseDown: (event: React.MouseEvent<any>) => any;
} & ResizerOuterProps;

const POINT_STROKE_WIDTH = 1;
const POINT_RADIUS       = 4;


export const ResizerBase = ({ root, dispatch, onMouseDown, zoom }: ResizerInnerProps) => {

  const bounds = getSelectionBounds(root);

  // offset stroke
  const resizerStyle = {
    position : "absolute",
    left     : bounds.left,
    top      : bounds.top,
    width    : bounds.right - bounds.left,
    height   : bounds.bottom - bounds.top,
    transform: `translate(-${POINT_RADIUS / zoom}px, -${POINT_RADIUS / zoom}px)`,
    transformOrigin: "top left"
  };

  const points = [
    { left: 0, top: 0 },
    { left: .5, top: 0 },
    { left: 1, top: 0 },
    { left: 1, top: .5 },
    { left: 1, top: 1 },
    { left: .5, top: 1 },
    { left: 0, top: 1 },
    { left: 0, top: 0.5 },
  ];

  return <div className="m-resizer-component" tabIndex={-1}>
    <div
      className="m-resizer-component--selection"
      style={resizerStyle as any}
      onMouseDown={onMouseDown}
    >
      <Path
        zoom={zoom}
        points={points}
        root={root}
        bounds={bounds}
        strokeWidth={POINT_STROKE_WIDTH}
        dispatch={dispatch}
        pointRadius={POINT_RADIUS}
      />
    </div>
  </div>
}

const enhanceResizer = compose<ResizerInnerProps, ResizerOuterProps>(
  pure,
  withHandlers({
    onMouseDown: ({ dispatch, root }: ResizerOuterProps) => (event: React.MouseEvent<any>) => {

      dispatch(resizerMouseDown(event));

      const translate = root.canvas.translate;
      const bounds = getSelectionBounds(root);
      const translateLeft = translate.left;
      const translateTop  = translate.top;
      const onStartDrag = (event) => {
        dispatch(resizerStartDrag(event));
      };

      const calcMousePoint = (delta: any) => ({
        left: bounds.left + delta.x / translate.zoom,
        top: bounds.top + delta.y / translate.zoom,
      });
      const onDrag = (event2, { delta }) => {
        dispatch(resizerMoved(calcMousePoint(delta)));
      };

      // debounce stopped moving so that it beats the stage click event
      // which checks for moving or resizing state.
      const onStopDrag = debounce((event, { delta }) => {
        dispatch(resizerStoppedMoving(calcMousePoint(delta)));
      }, 0);

      startDOMDrag(event, onStartDrag, onDrag, onStopDrag);
    }
  })
);

export const Resizer = enhanceResizer(ResizerBase);
export * from "./path";