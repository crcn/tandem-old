import * as React from "react";
import { compose, pure } from "recompose";

export default compose(pure, Base => props => {
  return <Base {...props} />;
});
