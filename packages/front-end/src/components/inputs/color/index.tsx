/*

TODO:

- [ ] draggable hue picker
- [ ] hex view
- [ ] rgba view
- [ ] swaps - make them selectable (like figma)

*/

import "./index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  compose,
  pure,
  lifecycle,
  withState,
  withPropsOnChange,
  withHandlers
} from "recompose";
import { PresetComponent } from "./presets";
import { DraggableComponent } from "../../draggable";
import { RawColorInputComponent } from "./raw-input";

export type ColorPickerComponentOuterProps = {
  value: string;
  swaps?: string[];
};

type Position = {
  left: number;
  top: number;
};

export type ColorPickerComponentInnerProps = {
  rgba: [number, number, number, number];
  hslKnobPosition: Position;
  spectrumKnobPosition: number;
  opacityKnobPosition: number;
  onHslKnobDrag: () => any;
  onSpectrumKnobDrag: () => any;
  onOpacityKnobDrag: () => any;
  setHslKnobPosition: (pos: Position) => any;
  setSpectrumKnobPosition: (pos: Position) => any;
  setOpacityKnobPosition: (pos: Position) => any;
} & ColorPickerComponentOuterProps;

const SPECTRUM_HEIGHT = 30;

const PRESET_VALUES = [
  { name: "--background-color", value: "red" },
  { name: "test", value: "red" }
];

const BaseColorPickerComponent = ({
  onHslKnobDrag,
  onSpectrumKnobDrag,
  onOpacityKnobDrag,
  hslKnobPosition,
  spectrumKnobPosition,
  opacityKnobPosition,
  value
}: ColorPickerComponentInnerProps) => (
  <div className="m-color-picker">
    <div className="content">
      <DraggableComponent onDrag={onHslKnobDrag}>
        <div className="hsl palette">
          <canvas ref="hsl" />
          <div
            className="knob"
            style={{
              left: `${hslKnobPosition.left}%`,
              top: `${hslKnobPosition.top}%`
            }}
          />
        </div>
      </DraggableComponent>
      <div className="settings">
        <DraggableComponent onDrag={onSpectrumKnobDrag}>
          <div className="spectrum palette">
            <canvas ref="spectrum" />
            <div
              className="knob"
              style={{ left: `${spectrumKnobPosition}%` }}
            />
          </div>
        </DraggableComponent>
        <DraggableComponent onDrag={onOpacityKnobDrag}>
          <div className="opacity palette">
            <canvas ref="opacity" />
            <div className="knob" style={{ left: `${opacityKnobPosition}%` }} />
          </div>
        </DraggableComponent>
        <RawColorInputComponent value={value} />
      </div>
    </div>
    <PresetComponent values={PRESET_VALUES} />
  </div>
);

const enhance = compose<
  ColorPickerComponentInnerProps,
  ColorPickerComponentOuterProps
>(
  pure,
  withPropsOnChange(["value"], ({ value }: ColorPickerComponentOuterProps) => ({
    rgba: parseRGBA(value)
  })),
  withState("hslKnobPosition", "setHslKnobPosition", { left: 0, top: 0 }),
  withState("spectrumKnobPosition", "setSpectrumKnobPosition", 0),
  withState("opacityKnobPosition", "setOpacityKnobPosition", 0),
  withHandlers({
    onHslKnobDrag: ({ setHslKnobPosition }) => ({ px, py, width, height }) => {
      const ax = Math.round(width * px);
      const ay = Math.round(height * py);
      setHslKnobPosition({ left: px * 100, top: py * 100 });
      const context = (this.refs.hsl as HTMLCanvasElement).getContext("2d");

      const hsl = rgbToHsl(context.getImageData(ax, ay, 1, 1).data as any);
    },
    onSpectrumKnobDrag: ({ setSpectrumKnobPosition }) => ({ px }) => {
      setSpectrumKnobPosition(px * 100);
    },
    onOpacityKnobDrag: ({ setOpacityKnobPosition }) => ({ px }) => {
      setOpacityKnobPosition(px * 100);
    }
  }),
  lifecycle<ColorPickerComponentInnerProps, any>({
    componentDidMount() {
      const { width: hslWidth } = (this.refs
        .hsl as HTMLCanvasElement).parentElement.getBoundingClientRect();

      const { width: spectrumWidth } = (this.refs
        .spectrum as HTMLCanvasElement).parentElement.getBoundingClientRect();

      const hue = rgbToHsl(this.props.rgba)[0] * 360; // TODO - calculate this

      drawHSL(this.refs.hsl as HTMLCanvasElement, hue, hslWidth, hslWidth / 2);
      drawSpectrum(
        this.refs.spectrum as HTMLCanvasElement,
        spectrumWidth,
        SPECTRUM_HEIGHT
      );
      drawOpacity(
        this.refs.opacity as HTMLCanvasElement,
        hue,
        spectrumWidth,
        SPECTRUM_HEIGHT
      );
    }
  })
);

export const ColorPickerComponent = enhance(BaseColorPickerComponent);

const parseRGBA = (value: string): [number, number, number, number] => {
  if (value.indexOf("rgba") !== -1) {
    return ((value.match(/[\d\.]+/g) as any) || [0, 0, 0, 1]).map(Number) as [
      number,
      number,
      number,
      number
    ];
  }
  var result =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value) ||
    /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(value);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        1
      ]
    : [0, 0, 0, 1];
};

const drawHSL = (
  canvas: HTMLCanvasElement,
  hue: number,
  width: number,
  height: number
) => {
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  for (var row = 0; row <= height; row++) {
    var grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(1, `hsl(${hue}, 0%, ${(height - row) / height * 100}%)`);
    grad.addColorStop(0, `hsl(${hue}, 100%, ${(height - row) / height * 50}%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, row, width, 1);
  }
};

const drawSpectrum = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  for (var row = 0; row <= width; row++) {
    ctx.fillStyle = `hsl(${(row - width) / width * 360}, 100%, 50%)`;
    ctx.fillRect(row, 0, 1, height);
  }
};

const drawOpacity = (
  canvas: HTMLCanvasElement,
  hue: number,
  width: number,
  height: number
) => {
  var ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  for (var row = 0; row <= width; row++) {
    ctx.fillStyle = `hsl(${hue}, 100%, ${(width - row) / width * 50 + 50}%)`;
    ctx.fillRect(row, 0, 1, height);
  }
};

const rgbToHsl = ([r, g, b]: [number, number, number, number]) => {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const getColorHSL = color => rgbToHsl(parseRGBA(color));
