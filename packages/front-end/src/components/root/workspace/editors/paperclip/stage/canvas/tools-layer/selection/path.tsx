import "./path.scss";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "../../../../../../../../../state";
import { Dispatch } from "redux";
import {
  resizerPathMoved,
  resizerPathStoppedMoving
} from "../../../../../../../../../actions";
import { startDOMDrag, Point, Bounds } from "tandem-common";

export type PathOuterProps = {
  points: Point[];
  zoom: number;
  pointRadius: number;
  strokeWidth: number;
  root: RootState;
  showPoints?: boolean;
  bounds: Bounds;
  dispatch: Dispatch<any>;
};

// padding prevents the SVG from getting cut off when transform is applied - particularly during zoom.
const PADDING = 10;

export type PathInnerProps = {
  onPointClick: (point: Point, event: React.MouseEvent<any>) => {};
} & PathOuterProps;

export const PathBase = ({
  bounds,
  points,
  zoom,
  pointRadius,
  strokeWidth,
  showPoints = true,
  onPointClick
}: PathInnerProps) => {
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const cr = pointRadius;
  const crz = cr / zoom;
  const cw = cr * 2;
  const cwz = cw / zoom;
  const w = width + PADDING + Math.max(cw, cwz);
  const h = height + PADDING + Math.max(cw, cwz);
  const p = 100;

  const style = {
    width: w,
    height: h,
    left: -PADDING / 2,
    top: -PADDING / 2,
    position: "relative"
  };

  return (
    <svg
      style={style as any}
      viewBox={[0, 0, w, h].join(" ")}
      className="resizer-path"
    >
      {showPoints !== false
        ? points.map((path, key) => (
            <rect
              onMouseDown={event => onPointClick(path, event)}
              className={`point-circle-${path.top * 100}-${path.left * 100}`}
              strokeWidth={0}
              stroke="black"
              fill="transparent"
              width={cwz}
              height={cwz}
              x={path.left * width + PADDING / 2}
              y={path.top * height + PADDING / 2}
              rx={0}
              ry={0}
              key={key}
            />
          ))
        : void 0}
    </svg>
  );
};

const enhancePath = compose<PathInnerProps, PathOuterProps>(
  pure,
  withHandlers({
    onPointClick: ({ bounds, dispatch, zoom, root }: PathOuterProps) => (
      point: Point,
      event: React.MouseEvent<any>
    ) => {
      event.stopPropagation();
      const sourceEvent = { ...event };

      const wrapActionCreator = createAction => (event, info) => {
        const delta = {
          left: info.delta.x / zoom,
          top: info.delta.y / zoom
        };
        dispatch(
          createAction(
            point,
            bounds,
            {
              left: point.left === 0 ? bounds.left + delta.left : bounds.left,
              top: point.top === 0 ? bounds.top + delta.top : bounds.top,
              right:
                point.left === 1 ? bounds.right + delta.left : bounds.right,
              bottom:
                point.top === 1 ? bounds.bottom + delta.top : bounds.bottom
            },
            event
          )
        );
      };

      const svac = wrapActionCreator(resizerPathStoppedMoving);
      startDOMDrag(
        event,
        () => {},
        wrapActionCreator(resizerPathMoved),
        (event, info) => {
          // beat click so that items aren't selected
          setTimeout(() => {
            svac(event, info);
          });
        }
      );
    }
  })
);

export const Path = enhancePath(PathBase as any);
