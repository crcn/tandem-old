import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  componentControllerItemClicked,
  openControllerButtonClicked
} from "actions";

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

export default compose(
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
  Base => ({
    onClick,
    relativePath,
    selected,
    onOpenClick,
    hovering,
    onMouseOver,
    onMouseLeave
  }) => {
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
