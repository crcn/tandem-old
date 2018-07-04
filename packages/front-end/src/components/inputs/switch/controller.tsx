import * as React from "react";
import { compose } from "recompose";
import * as cx from "classnames";
import {
  default as checkboxController,
  CheckboxControllerOuterProps
} from "../checkbox/controller";

export default compose(
  checkboxController,
  Base => ({ value, ...rest }) => {
    return <Base variant={cx({ on: value })} {...rest} />;
  }
);
