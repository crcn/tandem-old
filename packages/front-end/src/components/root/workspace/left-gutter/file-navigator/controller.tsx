import * as React from "react";
import { BaseFileNavigatorProps } from "./view.pc";
export type Props = {} & BaseFileNavigatorProps;

export default (Base: React.ComponentClass<BaseFileNavigatorProps>) =>
  class FileNavigatorController extends React.PureComponent<Props> {
    render() {
      const { ...rest } = this.props;
      return <Base {...rest} />;
    }
  };
