import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";

type InputComponentProps = {
  value: any;
  onChange?: () => any;
};

type LabeledInputComponentProps = {
  label: string;
} & InputComponentProps;


export type RawColorInputOuterProps = {
} & InputComponentProps;


const InputComponent = ({ value, label, onChange }: LabeledInputComponentProps) => {
  return <div className="field">
    <input className="m-input" type="text" onChange={onChange} />
    <label>{label}</label>
  </div>;
};

const HexInputComponent = ({ value }: InputComponentProps) => {
  return <div className="fields">
    <InputComponent label="hex" value={0} />
  </div>
};

const RGBAInputComponent = ({ value }: InputComponentProps) => {
  return <div className="fields">
    <InputComponent label="r" value={0} />
    <InputComponent label="g" value={0} />
    <InputComponent label="b" value={0} />
    <InputComponent label="a" value={0} />
  </div>
};

const BaseRawColorInputComponent = ({ value }: RawColorInputOuterProps) => {
  return <div className="m-raw-color-input">
    <RGBAInputComponent value={value} />
    <div className="switcher">
      <i className="ion-arrow-up-b" />
      <i className="ion-arrow-down-b" />
    </div>
  </div>
}

const enhance = compose<RawColorInputOuterProps, RawColorInputOuterProps>(
  pure
);

export const RawColorInputComponent = enhance(BaseRawColorInputComponent);