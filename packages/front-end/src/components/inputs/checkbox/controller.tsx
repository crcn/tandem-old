import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export type CheckboxControllerOuterProps = {
  value: boolean;
  onChangeComplete?: (value: boolean) => any;
};

type CheckboxControllerInnerProps = {
  onClick: any;
} & CheckboxControllerOuterProps;

export default compose(
  pure,
  withHandlers({
    onClick: ({ value, onChange, onChangeComplete }) => event => {
      event.stopPropagation();
      if (onChange) {
        onChange(value);
      }
      if (onChangeComplete) {
        onChangeComplete(!value);
      }
    }
  }),
  Base => ({ onClick, ...rest }: CheckboxControllerInnerProps) => {
    return <Base onClick={onClick} {...rest} />;
  }
);
