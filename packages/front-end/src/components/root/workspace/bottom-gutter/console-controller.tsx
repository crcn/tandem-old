import * as React from "react";
import { BaseConsoleProps } from "./view.pc";
import { ScriptProcess } from "../../../../state";
import { Dispatch } from "../../../../../../desktop/node_modules/redux";

export type Props = {
  scriptProcesses: ScriptProcess[];
  dispatch: Dispatch<any>;
};

export default (Base: React.ComponentClass<BaseConsoleProps>) =>
  class ConsoleController extends React.PureComponent<Props> {
    render() {
      const { ...rest } = this.props;
      if (1 + 1) {
        return null;
      }
      return <Base {...rest} />;
    }
  };
