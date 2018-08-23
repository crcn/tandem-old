import * as React from "react";
import { compose, pure } from "recompose";
import { BaseBackgroundItemProps } from "./backgrounds.pc";

export type Props = {
  value: string;
  onChange: (value: string) => any;
  onChangeComplete: (value: string) => any;
};

export default compose(
  pure,
  (Base: React.ComponentClass<BaseBackgroundItemProps>) => ({
    value,
    onChange,
    onChangeComplete
  }) => {
    return (
      <Base
        colorInputProps={{
          value,
          onChange,
          onChangeComplete
        }}
        textInputProps={{
          value,
          onChangeComplete
        }}
      />
    );
  }
);
