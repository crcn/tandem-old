import * as React from "react";
import { BaseBuildButtonProps } from "./view.pc";

export type Props = {};

type State = {
  open?: boolean;
};

export default (Base: React.ComponentClass<BaseBuildButtonProps>) =>
  class BuildButtonController extends React.PureComponent<Props, State> {
    state = {
      open: false
    };
    onBuildButtonClick = () => {
      this.setState({
        open: true
      });
    };
    onShouldClose = () => {};
    render() {
      const { onShouldClose, onBuildButtonClick } = this;
      const { open } = this.state;
      const { ...rest } = this.props;
      return (
        <Base
          {...rest}
          popoverProps={{
            open,
            onShouldClose,
            centered: true
          }}
          buildButtonProps={{
            onClick: onBuildButtonClick
          }}
          tooltipProps={{
            variant: "right"
          }}
        />
      );
    }
  };
