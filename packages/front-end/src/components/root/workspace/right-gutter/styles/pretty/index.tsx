import * as React from "react";
import { compose, pure } from "recompose";
import { SyntheticNode } from "paperclip";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export default compose(
  pure,
  Base => props => {
    return (
      <Base
        {...props}
        inheritPaneProps={props}
        codePaneProps={props}
        layoutPaneProps={props}
        typographyPaneProps={props}
        opacityPaneProps={props}
        backgroundsPaneProps={props}
        spacingPaneProps={props}
        bordersPaneProps={props}
      />
    );
  }
);
