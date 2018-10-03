import * as React from "react";
import { BaseBackgroundItemProps } from "./backgrounds.pc";
import { PCVariable } from "paperclip";
import { mapPCVariablesToColorSwatchOptions } from "../../state";
import { getColorSwatchOptionsFromValues } from "../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange: any;
  documentColors: string[];
  onChangeComplete: (value: string) => any;
};

export default (Base: React.ComponentClass<BaseBackgroundItemProps>) =>
  class BackgroundItemController extends React.PureComponent<Props> {
    render() {
      const { documentColors, value, onChange, onChangeComplete } = this.props;
      return (
        <Base
          colorInputProps={{
            swatchOptions: getColorSwatchOptionsFromValues(documentColors),
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
