import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PCVariant } from "paperclip";

export type OptionControllerOuterProps = {
  variant: PCVariant;
};

export default compose(
  pure,
  withHandlers({

  }),
  Base => ({ variant, ...rest }: OptionControllerOuterProps) => {
    return <Base labelProps={{text: variant.label || "Untitled"}} {...rest} />;
  }
)