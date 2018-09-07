import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { BaseBoxShadowItemProps } from "./box-shadow.pc";
export type BoxShadowInfo = {
  inset: boolean;
  color: string;
  x: string;
  y: string;
  blur: string;
  spread: string;
};

export type Props = {
  selected: boolean;
  value: BoxShadowInfo;
  onChange: any;
  onChangeComplete: any;
};

export type InnerProps = {
  onColorChange: any;
  onColorChangeComplete: any;
  onXChange: any;
  onXChangeComplete: any;
  onYChange: any;
  onYChangeComplete: any;
  onBlurChange: any;
  onBlurChangeComplete: any;
  onSpreadChange: any;
  onSpreadChangeComplete: any;
  onBackgroundClick: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onColorChange: ({ value, onChange }) => color => {
      onChange({ ...value, color });
    },
    onColorChangeComplete: ({ value, onChangeComplete }) => color => {
      onChangeComplete({ ...value, color });
    },
    onXChange: ({ value, onChange }) => x => {
      onChange({ ...value, x });
    },
    onXChangeComplete: ({ value, onChangeComplete }) => x => {
      onChangeComplete({ ...value, x });
    },
    onYChange: ({ value, onChange }) => y => {
      onChange({ ...value, y });
    },
    onYChangeComplete: ({ value, onChangeComplete }) => y => {
      onChangeComplete({ ...value, y });
    },
    onBlurChange: ({ value, onChange }) => blur => {
      onChange({ ...value, blur });
    },
    onBlurChangeComplete: ({ value, onChangeComplete }) => blur => {
      onChangeComplete({ ...value, blur });
    },
    onSpreadChange: ({ value, onChange }) => spread => {
      onChange({ ...value, spread });
    },
    onSpreadChangeComplete: ({ value, onChangeComplete }) => spread => {
      onChangeComplete({ ...value, spread });
    }
  }),
  (Base: React.ComponentClass<BaseBoxShadowItemProps>) => ({
    value: { color, x, y, blur, spread },
    onChange,
    selected,
    onColorChange,
    onColorChangeComplete,
    onXChange,
    onXChangeComplete,
    onYChange,
    onYChangeComplete,
    onBlurChange,
    onBlurChangeComplete,
    onSpreadChange,
    onSpreadChangeComplete,
    onBackgroundClick,
    ...rest
  }: InnerProps) => {
    return (
      <Base
        {...rest}
        variant={cx({ selected })}
        onClick={onBackgroundClick}
        colorInputProps={{
          value: color,
          onClick: stopPropagation,
          onChange: onColorChange,
          onChangeComplete: onColorChangeComplete
        }}
        xInputProps={{
          value: x,
          onClick: stopPropagation,
          onChange: onXChange,
          onChangeComplete: onXChangeComplete
        }}
        yInputProps={{
          value: y,
          onClick: stopPropagation,
          onChange: onYChange,
          onChangeComplete: onYChangeComplete
        }}
        blurInputProps={{
          value: blur,
          onClick: stopPropagation,
          onChange: onBlurChange,
          onChangeComplete: onBlurChangeComplete
        }}
        spreadInputProps={{
          value: spread,
          onClick: stopPropagation,
          onChange: onSpreadChange,
          onChangeComplete: onSpreadChangeComplete
        }}
      />
    );
  }
);

const stopPropagation = event => event.stopPropagation();
