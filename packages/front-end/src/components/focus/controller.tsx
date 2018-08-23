import * as React from "react";
import { pure, compose } from "recompose";
import { FocusComponent } from "./index";

export default compose(
  pure,
  (Base: React.ComponentClass<any>) => props => {
    return (
      <FocusComponent {...props}>
        <Base {...props} />
      </FocusComponent>
    );
  }
);
