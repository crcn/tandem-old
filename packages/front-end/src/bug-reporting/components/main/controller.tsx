import * as React from "react";
import { BaseMainProps } from "./view.pc";

export type Props = {};

export default (Base: React.ComponentClass<BaseMainProps>) =>
  class BaseReporterController extends React.PureComponent<Props> {
    onResetClick = () => {
      window.location.reload();
    };

    render() {
      const { onResetClick } = this;
      const { ...rest } = this.props;
      return <Base {...rest} restartButtonProps={{ onClick: onResetClick }} />;
    }
  };
