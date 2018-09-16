import * as React from "react";
import { BaseVariablesInputProps } from "./view.pc";

export type Props = BaseVariablesInputProps;

export default (Base: React.ComponentClass<BaseVariablesInputProps>) => class VariablesInputController extends React.PureComponent<Props> {
  render() {
    return <Base {...this.props} />
  }
};