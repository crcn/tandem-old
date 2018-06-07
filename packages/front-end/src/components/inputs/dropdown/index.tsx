import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export default compose(
  pure,
  withHandlers({
    onClick: () => () => {
      console.log("CLICK");
    }
  }),
  Base => props => {
    return <Base {...props} />;
  }
);
