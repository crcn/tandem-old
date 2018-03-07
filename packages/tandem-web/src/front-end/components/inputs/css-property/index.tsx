/*
TODOS:
preview
input

*/

import "./index.scss";
import * as React from "react";
import { FocusComponent } from "front-end/components/focus";
import { compose, pure, withHandlers, withState } from "recompose";

export type CSSInputComponentOuterProps = {
  value: string;
};

export type CSSInputComponentInnerProps = {
  active: boolean;
  onFocus: () => any;
  onBlur: () => any;
} & CSSInputComponentOuterProps;

const BaseCSSInputComponent = ({ value, active, onFocus, onBlur }: CSSInputComponentInnerProps) => {
  const tokens = [{ type: "string", value }];
  return <div className="m-css-property-input" tabIndex={0} onFocus={onFocus} onBlur={onBlur}>
  {
    active ? <FocusComponent><input type="text" defaultValue={value} /></FocusComponent> : tokens.map(({ type, value }) => (
      <span>{value}</span>
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