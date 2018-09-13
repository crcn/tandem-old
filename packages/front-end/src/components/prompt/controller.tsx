import * as React from "react";
import { BasePromptProps } from "./view.pc";

export type Props = {
  label: string;
  onOk?: any;
  onCancel?: any;
};


type State = {
  value: string;
}

export default (Base: React.ComponentClass<BasePromptProps>) => class PromptController extends React.PureComponent<Props, State> {
  state = {
    value: null
  };
  onOk = () => {
    this.props.onOk(this.state.value);
  }
  onInputChange = (value) => {
    this.setState({ ...this.state, value });
  }
  render() {
    const {label, onCancel} = this.props;
    const {onInputChange, onOk} = this;
    return <Base textProps={{text: label}} okButtonProps={{onClick: onOk}} cancelButtonProps={{onClick: onCancel}} inputProps={{
      onChange: onInputChange,
      onChangeComplete: onOk,
      focus: true
    }} />
  }
}