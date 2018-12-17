import * as React from "react";
import {
  BaseBuildButtonProps,
  BuildButtonOption,
  BuildButtonMenu
} from "./view.pc";
import { Dispatch } from "redux";
import {
  buildButtonStartClicked,
  buildButtonConfigureClicked
} from "../../../actions";

export type Props = {
  dispatch: Dispatch<any>;
};

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
      this.closeMenu();
    };
    onStartClick = () => {
      this.props.dispatch(buildButtonStartClicked());
      this.closeMenu();
    };
    onConfigureClick = () => {
      this.props.dispatch(buildButtonConfigureClicked());
      this.closeMenu();
    };
    closeMenu() {
      this.setState({ open: false });
    }
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
