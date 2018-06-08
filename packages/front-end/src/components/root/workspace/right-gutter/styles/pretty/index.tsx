import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export default compose(pure, Base => props => {
  return <Base {...props} codePaneProps={props} layoutPaneProps={props} />;
});
