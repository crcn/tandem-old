import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import { openControllerButtonClicked } from "actions";
import { Dispatch } from "redux";
import { BaseControllerItemProps } from "./controller-item.pc";

const withHoveringState = compose(
  withState("hovering", "setHovering", false),
  withHandlers({
    onMouseOver: ({ setHovering }) => () => {
      setHovering(true);
    },
    onMouseLeave: ({ setHovering }) => () => {
      setHovering(false);
    }
  })
);

export type Props = {
  selected: boolean;
  hovering: boolean;
  onClick: any;
  dispatch: Dispatch<any>;
  relativePath: string;
};

type InnerProps = {
  onClick: any;
  onOpenClick: any;
} & Props;

type State = {
  hovering: boolean;
};

export default (Base: React.ComponentClass<BaseControllerItemProps>) => {
  return class ControllerItemController extends React.PureComponent<
    Props,
    State
  > {
    constructor(props) {
      super(props);
      this.state = { hovering: false };
    }
    onClick = () => {
      this.props.onClick(this.props.relativePath);
    };
    onOpenClick = (event: React.MouseEvent<any>) => {
      event.stopPropagation();
      const { dispatch, relativePath } = this.props;
      dispatch(openControllerButtonClicked(relativePath));
    };
    onMouseOver = () => {
      this.setState({ hovering: true });
    };
    onMouseLeave = () => {
      this.setState({ hovering: false });
    };
    render() {
      const { onOpenClick, onMouseOver, onMouseLeave, onClick } = this;
      const { relativePath, selected, hovering } = this.props;
      return (
        <Base
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          openButtonProps={{ onClick: onOpenClick }}
          labelProps={{ text: relativePath }}
          variant={cx({ selected, hovering })}
        />
      );
    }
  };
};
