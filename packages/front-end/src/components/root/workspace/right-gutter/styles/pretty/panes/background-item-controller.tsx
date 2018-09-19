import * as React from "react";
import { BaseBackgroundItemProps } from "./backgrounds.pc";
import { PCVariable } from "paperclip";
import { mapPCVariablesToColorSwatchOptions } from "../../state";

export type Props = {
  value: string;
  onChange: any;
  globalVariables: PCVariable[];
  onChangeComplete: (value: string) => any;
};

export default (Base: React.ComponentClass<BaseBackgroundItemProps>) =>
  class BackgroundItemController extends React.PureComponent<Props> {
    render() {
      const { globalVariables, value, onChange, onChangeComplete } = this.props;
      return (
        <Base
          colorInputProps={{
            swatchOptions: mapPCVariablesToColorSwatchOptions(globalVariables),
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
