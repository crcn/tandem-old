import * as React from "react";
import {
  BaseBuildButtonProps,
  BuildButtonOption,
  BuildButtonMenu
} from "./view.pc";

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
      if (!this.state.open) {
        this.setState({
          open: true
        });
      }
    };
    onShouldClose = () => {
      this.setState({ open: false });
    };
    onStartClick = () => {
      console.log("onStartClick");
    };
    onConfigureClick = () => {
      console.log("onConfigureClick");
    };
    render() {
      const {
        onShouldClose,
        onBuildButtonClick,
        onStartClick,
        onConfigureClick
      } = this;
      const { open } = this.state;
      const { ...rest } = this.props;

      let running = false;
      let errored = false;

      let buildButtonMenuItems = [];

      if (!running) {
        buildButtonMenuItems = [
          <BuildButtonOption
            key="configure"
            labelProps={{ text: "Configure" }}
            onClick={onConfigureClick}
          />,
          <BuildButtonOption
            key="start"
            labelProps={{ text: "Start" }}
            onClick={onStartClick}
          />
        ];
      }

      return (
        <Base
          {...rest}
          popoverProps={{
            open,
            onShouldClose,
            centered: true
          }}
          buildButtonProps={{
            onMouseDown: onBuildButtonClick
          }}
          tooltipProps={{}}
          buildButtonMenuProps={{
            items: buildButtonMenuItems
          }}
        />
      );
    }
  };
