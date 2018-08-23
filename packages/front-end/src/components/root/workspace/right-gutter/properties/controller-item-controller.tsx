import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  componentControllerItemClicked,
  openControllerButtonClicked
} from "actions";
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
  onMouseOver: any;
  onMouseLeave: any;
  dispatch: Dispatch<any>;
  relativePath: string;
};

type InnerProps = {
  onClick: any;
  onOpenClick: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHoveringState,
  withHandlers({
    onClick: ({ dispatch, relativePath }) => () => {
      dispatch(componentControllerItemClicked(relativePath));
    },
    onOpenClick: ({ dispatch, relativePath }) => event => {
      event.stopPropagation();
      dispatch(openControllerButtonClicked(relativePath));
    }
  }),
  (Base: React.ComponentClass<BaseControllerItemProps>) => ({
    onClick,
    relativePath,
    selected,
    onOpenClick,
    hovering,
    onMouseOver,
    onMouseLeave
  }: InnerProps) => {
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
);
