import * as React from "react";
import { BaseBackgroundItemProps } from "./backgrounds.pc";

export type Props = {
  value: string;
  onChange: any;
  onChangeComplete: (value: string) => any;
};

export default (Base: React.ComponentClass<BaseBackgroundItemProps>) =>
  class BackgroundItemController extends React.PureComponent<Props> {
    render() {
      const { value, onChange, onChangeComplete } = this.props;
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
  };
