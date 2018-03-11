import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import * as cx from "classnames";
/*

TODO:

validation
*/

export type TextInputComponentOuterProps = {
  value?: string;
  className?: string;
  onChange?: (newValue: string) => any;
};


export const BaseTextInputComponent = ({ value, className }: TextInputComponentOuterProps) => {
  return <input type="text" className={cx("m-text-input", "m-input", className)} defaultValue={value} />
};

const enhance = compose<TextInputComponentOuterProps, TextInputComponentOuterProps>(
  pure
);

export const TextInputComponent = enhance(BaseTextInputComponent);