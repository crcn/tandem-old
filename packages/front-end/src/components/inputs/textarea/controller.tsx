import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, withHandlers, lifecycle } from "recompose";
import { withInputHandlers } from "../text/controller";

export default compose<any, any>(
  pure,
  withInputHandlers(),
  Base => ({ value, onKeyDown }) => {
    return <Base defaultValue={value} onKeyDown={onKeyDown} />;
  }
);
