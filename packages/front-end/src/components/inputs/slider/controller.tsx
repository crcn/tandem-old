import { clamp } from "lodash";
import * as React from "react";
import { startDOMDrag } from "tandem-common";
import { lifecycle, compose, pure, withHandlers, withState } from "recompose";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

export default compose(
  pure,
  withState(
    `percent`,
    `setPercent`,
    ({ min = DEFAULT_MIN, max = DEFAULT_MAX, value }: any) =>
      clamp((value || 0) / (max - min), 0, 1)
  ),
  withHandlers(() => {
    let _slider: HTMLDivElement;
    return {
      setSlider: () => slider => {
        _slider = slider;
      },
      onMouseDown: ({
        min = DEFAULT_MIN,
        max = DEFAULT_MAX,
        setPercent,
        onChange,
        onChangeComplete
      }) => event => {
        const changeCallback = callback => {
          return (event: MouseEvent) => {
            const sliderRect = _slider.getBoundingClientRect();
            const relativeLeft = event.clientX - sliderRect.left;
            let percent = relativeLeft / sliderRect.width;
            const change = max - min;
            percent = clamp(
              ((relativeLeft / sliderRect.width) * change) / change,
              0,
              1
            );
            percent = Number(percent.toFixed(3));
            setPercent(percent);
            if (callback) {
              callback(percent);
            }
          };
        };

        startDOMDrag(
          event,
          () => {},
          changeCallback(onChange),
          changeCallback(onChangeComplete)
        );
      }
    };
  }),
  Base => ({ percent, setSlider, onMouseDown }) => {
    return (
      <span ref={setSlider}>
        <Base
          onMouseDown={onMouseDown}
          grabberProps={{ style: { left: `${percent * 100}%` } }}
        />
      </span>
    );
  }
);
