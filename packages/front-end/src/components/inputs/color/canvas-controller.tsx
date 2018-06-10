import * as React from "react";
import { noop } from "lodash";
import { startDOMDrag } from "tandem-common";
import { compose, pure, withHandlers, withState, lifecycle } from "recompose";

export enum GrabberAxis {
  X = 1,
  Y = X << 1
}

export default compose(
  pure,
  withState(`canvas`, `setCanvas`, null),
  withState(`grabberPoint`, `setGrabberPoint`, null),
  withHandlers(() => {
    let _canvas: HTMLCanvasElement;
    return {
      onCanvas: ({ setCanvas, draw }) => (canvas: HTMLCanvasElement) => {
        setCanvas((_canvas = canvas));
        if (canvas) {
          const {
            width,
            height
          } = canvas.parentElement.getBoundingClientRect();
          draw(canvas, width, height);
        }
      },
      onMouseDown: ({
        grabberAxis,
        setGrabberPoint,
        onChange,
        onChangeComplete
      }) => event => {
        const rect = _canvas.getBoundingClientRect();

        const handleChange = callback => event => {
          const point = {
            left:
              grabberAxis & GrabberAxis.X
                ? Math.max(0, Math.min(rect.width, event.clientX - rect.left))
                : 0,
            top:
              grabberAxis & GrabberAxis.Y
                ? Math.max(0, Math.min(rect.height, event.clientY - rect.top))
                : 0
          };
          if (callback) {
            const imageData = _canvas
              .getContext("2d")
              .getImageData(point.left, point.top, 1, 1).data;
            callback(imageData);
          }

          setGrabberPoint(point);
        };

        startDOMDrag(
          event,
          noop,
          handleChange(onChange),
          handleChange(onChangeComplete)
        );
      }
    };
  }),
  lifecycle({
    componentDidUpdate({
      setGrabberPoint,
      getGraggerPoint,
      draw,
      canvas,
      value
    }: any) {
      if (canvas && this.props.draw !== draw) {
        const { width, height } = canvas.parentElement.getBoundingClientRect();
        this.props.draw(canvas, width, height);
      }

      if (canvas && this.props.value !== value) {
        const { width, height } = canvas.parentElement.getBoundingClientRect();
        setGrabberPoint(getGraggerPoint(this.props.value, width, height));
      }
    }
  }),
  Base => ({ onMouseDown, grabberPoint, onCanvas, ...rest }) => {
    return (
      <Base
        {...rest}
        grabberProps={{
          style: grabberPoint
        }}
        onMouseDown={onMouseDown}
        canvasProps={{
          ref: onCanvas
        }}
      />
    );
  }
);
