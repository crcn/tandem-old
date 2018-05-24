/*
TODOS:
preview
input

*/

import "./index.scss";
import * as React from "react";
import { FocusComponent } from "../../focus";
import { TextInputComponent } from "../../inputs/text";
import { compose, pure, withHandlers, withState } from "recompose";

export type CSSInputComponentOuterProps = {
  value: string;
};

export type CSSInputComponentInnerProps = {
  active: boolean;
  onFocus: () => any;
  onBlur: () => any;
} & CSSInputComponentOuterProps;

type MeasurementInputOuterProps = {
  value?: string;
  onChange?: () => any;
}

const MeasurementInput = ({ value }: MeasurementInputOuterProps) => {
  return <div className="measurement">
    px
  </div>
};

const BaseCSSInputComponent = ({ value, active, onFocus, onBlur }: CSSInputComponentInnerProps) => {
  const tokens = [{ type: "string", value }];
  return <div className="m-css-property-input" tabIndex={0} onFocus={onFocus} onBlur={onBlur}>
  {
    active ? <FocusComponent><TextInputComponent /></FocusComponent> : tokens.map(({ type, value }) => (
      <span className="m-input text">
        100
        <MeasurementInput />
      </span>
    ))
  }
</div>;
}

const enhance = compose<CSSInputComponentInnerProps, CSSInputComponentOuterProps>(
  pure,
  withState("active", "setActive", false),
  withHandlers({
    onFocus: ({ setActive }) => () => {
      setActive(true);
    },
    onBlur: ({ setActive }) => () => {
      setActive(false);
    }
  })
)

export const CSSInputComponent = enhance(BaseCSSInputComponent);