import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { componentControllerItemClicked } from "actions";

export default compose(
  pure,
  withHandlers({
    onClick: ({ dispatch, relativePath }) => () => {
      dispatch(componentControllerItemClicked(relativePath));
    }
  }),
  Base => ({ onClick, relativePath, selected }) => {
    return (
      <Base
        onClick={onClick}
        labelProps={{ text: relativePath }}
        variant={cx({ selected })}
      />
    );
  }
);
