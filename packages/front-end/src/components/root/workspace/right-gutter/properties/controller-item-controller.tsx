import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";

export default compose(
  pure,
  withHandlers({
    onClick: ({ dispatch }) => () => {}
  }),
  Base => ({ relativePath }) => {
    const selected = true;
    return <Base labelProps={relativePath} variant={cx({ selected })} />;
  }
);
