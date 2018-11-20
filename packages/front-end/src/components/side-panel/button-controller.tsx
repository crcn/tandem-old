import * as React from "react";
import { BaseSidePanelButtonProps, SidePanel } from "./view.pc";
import { Bounds } from "tandem-common";
import * as cx from "classnames";

export type Props = {
  innerContent?: any;
  left?: boolean;
  right?: boolean;
};

type State = {
  open: boolean;
};

export default (Base: React.ComponentClass<BaseSidePanelButtonProps>) =>
  class SidePanelButtonController extends React.PureComponent<Props, State> {
    state = {
      open: false
    };
    onShouldClose = () => {
      this.close();
    };
    onButtonClick = () => {
      this.setState({
        ...this.state,
        open: !this.state.open
      });
    };
    getAnchorRect = (rect: Bounds) => {
      return rect;
    };
    onCloseButtonClick = () => {
      this.close();
    };

    close = () => {
      this.setState({
        ...this.state,
        open: false
      });
    };
    render() {
      const {
        onButtonClick,
        onCloseButtonClick,
        onShouldClose,
        getAnchorRect
      } = this;
      const { innerContent, left, right, ...rest } = this.props;
      const { open } = this.state;

      return (
        <Base
          {...rest}
          buttonOuterProps={{
            onClick: onButtonClick
          }}
          popoverProps={{
            open: open,
            onShouldClose: onShouldClose,
            getAnchorRect: getAnchorRect
          }}
          content={
            <SidePanel
              variant={cx({
                left,
                right
              })}
              content={innerContent}
              closeButtonProps={{
                onClick: onCloseButtonClick
              }}
            />
          }
        />
      );
    }
  };
