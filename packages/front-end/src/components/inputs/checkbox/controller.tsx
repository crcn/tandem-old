import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export type Props = {
  value: boolean;
  onChangeComplete?: (value: boolean) => any;
};

type InnerProps = {
  onClick: any;
} & Props;

export default compose<any, Props>(
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
  (Base: React.ComponentClass<any>) => ({ onClick, ...rest }: InnerProps) => {
    return <Base onClick={onClick} {...rest} />;
  }
);
