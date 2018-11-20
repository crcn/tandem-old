import * as React from "react";
import { BaseVariableQueryOptionsProps } from "./view.pc";
import { PCVariable, PCVariableQueryCondition } from "paperclip";
export type Props = {
  condition: PCVariableQueryCondition;
  globalVariables: PCVariable[];
};

export default (Base: React.ComponentClass<BaseVariableQueryOptionsProps>) =>
  class VariableQueryOptionsController extends React.PureComponent<Props> {
    onSourceVariableChange = (value: PCVariable) => {};
    onEqualsChange = (value: string) => {};
    onNotEqualsChange = (value: string) => {};
    render() {
      const {
        onSourceVariableChange,
        onEqualsChange,
        onNotEqualsChange
      } = this;
      const { ...rest } = this.props;
      return (
        <Base
          {...rest}
          variableInputProps={{
            filterable: true,
            options: [],
            onChangeComplete: onSourceVariableChange
          }}
          equalsInputProps={{
            onChangeComplete: onEqualsChange
          }}
          notEqualsInputProps={{
            onChangeComplete: onNotEqualsChange
          }}
        />
      );
    }
  };
