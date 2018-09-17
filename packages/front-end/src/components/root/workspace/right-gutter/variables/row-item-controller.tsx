import * as React from "react";
import * as cx from "classnames";
import { BaseVariableRowItemProps } from "./view.pc";
import { Dispatch } from "redux";
import { PCVariable } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  variable: PCVariable;
};
const TYPE_OPTIONS = [];

export default (Base: React.ComponentClass<BaseVariableRowItemProps>)  => class VariableRowItemController extends React.PureComponent<Props> {
  onValueChange = (value) => {

  }
  onTypeChange = (value) => {

  }
  onNameChange = (value) => {

  }
  render() {
    const {onValueChange, onNameChange, onTypeChange} = this;
    const {variable, ...rest} = this.props;
    return <Base {...rest} variant={cx({
      unlimited: false,
      limited: false,
      color: true
    })} limitedInputProps={{
      options: [],
      onChange: onValueChange,
      value: variable.value
    }} unlimitedInputProps={{onChange: onValueChange, value: variable.value}} typeInputProps={{onChange: onTypeChange, options: TYPE_OPTIONS, value: variable.type}} nameInputProps={{onChange: onNameChange, value: variable.label}} colorInputProps={{
      onChange: onValueChange,
      onChangeComplete: onValueChange,
      value: variable.value
    }} />;
  }
}