import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { PCVariable } from "paperclip";
import { BaseVariableRowItemProps } from "./view.pc";
import {variableLabelChanged, variableValueChanged, variableTypeChanged} from "../../../../../actions";

export type Props = {
  dispatch: Dispatch<any>;
  variable: PCVariable;
};

const TYPE_OPTIONS = [];

export default (Base: React.ComponentClass<BaseVariableRowItemProps>)  => class VariableRowItemController extends React.PureComponent<Props> {
  onValueChange = (value) => {
    this.props.dispatch(variableValueChanged(this.props.variable, value));
  }
  onTypeChange = (value) => {
    this.props.dispatch(variableTypeChanged(this.props.variable, value));
  }
  onNameChange = (value) => {
    this.props.dispatch(variableLabelChanged(this.props.variable, value));
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