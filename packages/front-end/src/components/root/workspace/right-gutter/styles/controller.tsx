import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export default compose(
  pure,
  Base => props => {
    return <Base variantsProps={props} prettyProps={props} />
  }
);