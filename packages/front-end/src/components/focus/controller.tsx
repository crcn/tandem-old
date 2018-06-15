import * as React from "react";
import { pure, compose } from "recompose";
import { FocusComponent } from "./index";

export default compose(pure, Base => props => {
  return (
    <FocusComponent {...props}>
      <Base {...props} />
    </FocusComponent>
  );
});
