import * as React from "react";
import { compose, pure } from "recompose";

export default compose(
  pure,
  Base => ({ selectedInspectorNodes, graph, ...rest }) => {
    const selectedInspectorNode = selectedInspectorNodes[0];
    return <Base {...rest} />;
  }
);
