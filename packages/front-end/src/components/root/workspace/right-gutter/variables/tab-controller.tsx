import * as React from "react";
import * as cx from "classnames";
import { BaseVariablesTabProps } from "./view.pc";
import { Dispatch } from "redux";
import { PCVariable } from "paperclip";
import { FontFamily } from "state";

export type Props = {
  dispatch: Dispatch<any>;
  globalFileUri: string;
  globalVariables: PCVariable[];
  fontFamilies: FontFamily[];
}

export default (Base: React.ComponentClass<BaseVariablesTabProps>) => class VariablesTabController extends React.PureComponent<Props> {
  render() {
    const {dispatch, globalFileUri, globalVariables, fontFamilies, ...rest} = this.props;
    return <Base {...rest} variant={cx({
      noGlobalFile: !globalFileUri
    })} variablesInputProps={{
      dispatch,
      fontFamilies,
      globalVariables
    }} />;
  }
}