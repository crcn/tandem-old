import * as React from "react";
import * as cx from "classnames";
import { BaseVariablesTabProps } from "./view.pc";
import { Dispatch } from "redux";
import { PCVariable } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  globalFileUri: string;
  globalVariables: PCVariable[];
}

export default (Base: React.ComponentClass<BaseVariablesTabProps>) => class VariablesTabController extends React.PureComponent<Props> {
  render() {
    const {dispatch, globalFileUri, globalVariables, ...rest} = this.props;
    return <Base {...rest} variant={cx({
      noGlobalFile: !globalFileUri
    })} variablesInputProps={{
      dispatch,
      globalVariables
    }} />;
  }
}