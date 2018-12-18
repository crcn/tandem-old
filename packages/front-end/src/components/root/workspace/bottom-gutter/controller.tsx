import * as React from "react";
import { BaseBottomGutterProps } from "./view.pc";
import { Dispatch } from "redux";
import { ScriptProcess } from "../../../../state";

export type Props = {
  show: boolean;
  scriptProcesses: ScriptProcess[];
  dispatch: Dispatch<any>;
};

export default (Base: React.ComponentClass<BaseBottomGutterProps>) =>
  class BottomGutterController extends React.PureComponent<Props> {
    render() {
      const { show, dispatch, scriptProcesses, ...rest } = this.props;
      if (!show) {
        return false;
      }
      return (
        <Base
          {...rest}
          consoleProps={{
            scriptProcesses,
            dispatch
          }}
        />
      );
    }
  };
