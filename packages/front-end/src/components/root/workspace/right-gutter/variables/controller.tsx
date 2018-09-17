import * as React from "react";
import { BaseVariablesInputProps, VariableRowItem } from "./view.pc";
import { Dispatch } from "redux";
import { addVariableButtonClicked } from "../../../../../actions";
import { PCVariable } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  globalVariables: PCVariable[];
};


export default (Base: React.ComponentClass<BaseVariablesInputProps>) => class VariablesInputController extends React.PureComponent<Props> {
  onVariableButtonClick = () => {
    this.props.dispatch(addVariableButtonClicked());
  };
  render() {
    const {onVariableButtonClick} = this;
    const {dispatch, globalVariables, ...rest} = this.props;

    const items = globalVariables.map(variable => {
      return <VariableRowItem key={variable.id} variable={variable} dispatch={dispatch} />;
    });

    return <Base {...this.props} addVariableButtonProps={{onClick: onVariableButtonClick}} items={items} />
  }
};