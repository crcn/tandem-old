import { RightGutter2, BaseRightGutter2Props } from "./view2.pc";
import * as React from "react";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
import {
  getInspectorSourceNode,
  getPCNodeContentNode,
  computeStyleBlocks,
  PCVisibleNode,
  getPCNodeModule
} from "paperclip";

export type Props = {
  root: RootState;
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseRightGutter2Props>) => {
  return class RightGutter2Controller extends React.Component<Props> {
    render() {
      const { root, dispatch } = this.props;
      const selectedInspectorNodes = root.selectedInspectorNodes;
      if (!selectedInspectorNodes.length) {
        return null;
      }
      const sourceNode = getInspectorSourceNode(
        selectedInspectorNodes[0],
        root.sourceNodeInspector,
        root.graph
      ) as PCVisibleNode;
      const computedStyleBlocks = computeStyleBlocks(
        sourceNode,
        getPCNodeContentNode(
          sourceNode.id,
          getPCNodeModule(sourceNode.id, root.graph)
        ) as PCVisibleNode
      );

      return (
        <Base
          stylesSectionProps={{
            computedStyleBlocks,
            dispatch
          }}
        />
      );
    }
  };
};
