import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import { PCSourceTagNames, getPCNode } from "paperclip";

export type PropertiesControllerOuterProps = {};

export default compose(
  pure,
  Base => ({ className, ...rest }) => {
    const { selectedInspectorNodes, graph } = rest;

    if (!selectedInspectorNodes.length) {
      return null;
    }

    const selectedNode = selectedInspectorNodes[0];

    const sourceNode = getPCNode(selectedNode.assocSourceNodeId, graph);

    return (
      <Base
        className={className}
        {...rest}
        variant={cx({
          bindings: !selectedNode.immutable,
          slot: sourceNode.name === PCSourceTagNames.SLOT,
          component: sourceNode.name === PCSourceTagNames.COMPONENT,
          text: sourceNode.name === PCSourceTagNames.TEXT,
          element: sourceNode.name !== PCSourceTagNames.TEXT
        })}
        slotProps={rest}
        bindingsProps={rest}
        controllersPaneProps={rest}
        textProps={rest}
        elementProps={rest}
      />
    );
  }
);
