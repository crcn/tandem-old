/*

TODO:

- [ ] draggable hue picker
- [ ] hex view
- [ ] rgba view
- [ ] swaps - make them selectable

*/

import "./index.scss"
import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle, withState, withPropsOnChange } from "recompose";

export type ColorPickerComponentOuterProps = {
  value: string;
  swaps?: string[];
};


export type ColorPickerComponentInnerProps = {
  rgba: [number, number, number, number];
} & ColorPickerComponentOuterProps;

const SPECTRUM_HEIGHT = 30;

const BaseColorPickerComponent = () => <div className="m-color-picker">
  <div className="hsl">
    <canvas ref="hsl" />
  </div>
  <div className="spectrum">
    <canvas ref="spectrum" />
  </div>
  <div className="opacity">
    <canvas ref="opacity" />
  </div>
</div>;

const enhance = compose<ColorPickerComponentInnerProps, ColorPickerComponentOuterProps>(
  pure,
  withPropsOnChange(['value'], ({ value }: ColorPickerComponentOuterProps) => ({
    rgba: parseRGBA(value)
  })),
  lifecycle<ColorPickerComponentInnerProps, any>({    
    componentDidMount() {
      console.log(this.props["rgba"]);
      const { width } = (this.refs.hsl as HTMLCanvasElement).parentElement.getBoundingClientRect();

      const hue = rgbToHsl(this.props.rgba)[0] * 360; // TODO - calculate this

      drawHSL(this.refs.hsl as HTMLCanvasElement, hue, width, width / 2);
      drawSpectrum(this.refs.spectrum as HTMLCanvasElement, width, SPECTRUM_HEIGHT);
      drawOpacity(this.refs.opacity as HTMLCanvasElement, hue, width, SPECTRUM_HEIGHT);
    }
  })
);

export const ColorPickerComponent = enhance(BaseColorPickerComponent);

const parseRGBA = (value: string): [number, number, number, number] => {
  if (value.indexOf("rgba") !== -1) {
    return (value.match(/[\d\.]+/g) as any || [0, 0, 0, 1]).map(Number) as [number, number, number, number];
  }
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value) || /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(value);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    1
   ] : [0, 0, 0, 1];
};

const drawHSL = (canvas: HTMLCanvasElement, hue: number, width: number, height: number) => {
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  
  for(var row = 0; row <= height; row++) {
    var grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(1, `hsl(${hue}, 0%, ${((height - row) / height) * 100}%)`);
    grad.addColorStop(0, `hsl(${hue}, 100%, ${((height - row) / height) * 50}%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, row, width, 1);
  }
};

const drawSpectrum = (canvas: HTMLCanvasElement, width: number, height: number) => {

  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  for (var row = 0; row <= width; row++) {
    ctx.fillStyle = `hsl(${((row - width) / width) * 360}, 100%, 50%)`;
    ctx.fillRect(row, 0, 1,  height);
  }
};

const drawOpacity = (canvas: HTMLCanvasElement, hue: number, width: number, height: number) => {
  var ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  for (var row = 0; row <= width; row++) {
    ctx.fillStyle = `hsl(${hue}, 100%, ${((width - row)/width) * 50 + 50}%)`;
    ctx.fillRect(row, 0, 1,  height);
  }
};

const rgbToHsl = ([r, g, b]: [number, number, number, number]) => {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min) {
      h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const getColorHSL = (color) => rgbToHsl(parseRGBA(color));