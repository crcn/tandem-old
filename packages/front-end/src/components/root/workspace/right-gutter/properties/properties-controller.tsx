import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import { PCSourceTagNames, getSyntheticSourceNode } from "paperclip";

export default compose(
  pure,
  Base => ({ className, ...rest }) => {
    const { selectedNodes, graph } = rest;

    if (!selectedNodes.length) {
      return null;
    }

    const selectedNode = selectedNodes[0];

    const sourceNode = getSyntheticSourceNode(selectedNodes[0], graph);

    return (
      <Base
        className={className}
        {...rest}
        variant={cx({
          bindings: !selectedNode.immutable,
          component: sourceNode.name === PCSourceTagNames.COMPONENT,
          text: sourceNode.name === PCSourceTagNames.TEXT,
          element: sourceNode.name !== PCSourceTagNames.TEXT
        })}
        controllersPaneProps={rest}
        textProps={rest}
        elementProps={rest}
      />
    );
  }
);
