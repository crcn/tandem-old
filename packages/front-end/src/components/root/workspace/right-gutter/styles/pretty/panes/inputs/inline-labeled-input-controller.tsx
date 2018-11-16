import * as React from "react";
import { BaseInlineLabeledInputProps } from "./view.pc";

export type Props = {
  onChange?: any;
  onChangeComplete?: any;
  value: any;
};

export default (Base: React.ComponentClass<BaseInlineLabeledInputProps>) =>
  class InlineLabeledInputController extends React.PureComponent<Props> {
    render() {
      const { value, onChange, onChangeComplete, ...rest } = this.props;
      return (
        <Base
          {...rest}
          textInputProps={{ value, onChange, onChangeComplete }}
        />
      );
    }
  };
