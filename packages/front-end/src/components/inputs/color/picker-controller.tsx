import * as React from "react";
import { pure, compose, lifecycle } from "recompose";

export default compose(pure, lifecycle({}), Base => props => {
  return <Base />;
});
