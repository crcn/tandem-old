import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { PCVariable, PCVariableType } from "paperclip";
import { BaseVariableRowItemProps } from "./view.pc";
import { DropdownMenuOption } from "../../../../inputs/dropdown/controller";
import {
  variableLabelChanged,
  variableValueChanged
} from "../../../../../actions";
import { EMPTY_ARRAY } from "tandem-common";
import { FontFamily } from "../../../../../state";
import { getFontFamilyOptions } from "../styles/pretty/panes/typography-controller";

export type Props = {
  dispatch: Dispatch<any>;
  variable: PCVariable;
  fontFamilies: FontFamily[];
};

export default (Base: React.ComponentClass<BaseVariableRowItemProps>) =>
  class VariableRowItemController extends React.PureComponent<Props> {
    onValueChange = value => {
      this.props.dispatch(variableValueChanged(this.props.variable, value));
    };
    onLabelChange = value => {
      this.props.dispatch(variableLabelChanged(this.props.variable, value));
    };
    render() {
      const { onValueChange, onLabelChange } = this;
      const { variable, fontFamilies, ...rest } = this.props;
      const limited = variable.type === PCVariableType.FONT;
      const color = variable.type === PCVariableType.COLOR;
      const unlimited =
        variable.type === PCVariableType.NUMBER ||
        variable.type === PCVariableType.UNIT;

      let limitedOptions: DropdownMenuOption[] = EMPTY_ARRAY;

      if (variable.type === PCVariableType.FONT) {
        limitedOptions = getFontFamilyOptions(fontFamilies);
      }

      return (
        <Base
          {...rest}
          variant={cx({
            unlimited,
            limited,
            color
          })}
          limitedInputProps={{
            options: limitedOptions,
            onChange: onValueChange,
            value: variable.value
          }}
          unlimitedInputProps={{
            onChange: onValueChange,
            value: variable.value
          }}
          nameInputProps={{
            focus: !variable.label,
            onChangeComplete: onLabelChange,
            value: variable.label
          }}
          colorInputProps={{
            swatchOptions: EMPTY_ARRAY,
            onChange: onValueChange,
            onChangeComplete: onValueChange,
            value: variable.value
          }}
        />
      );
    }
  };
