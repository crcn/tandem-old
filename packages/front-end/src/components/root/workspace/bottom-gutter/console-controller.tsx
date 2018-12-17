import * as React from "react";
import { BaseConsoleProps } from "./view.pc";

export type Props = {};

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
