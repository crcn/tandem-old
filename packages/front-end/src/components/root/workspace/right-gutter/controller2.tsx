import { RightGutter2, BaseRightGutter2Props } from "./view2.pc";
import * as React from "react";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
import {
  getInspectorSourceNode,
  getPCNodeContentNode,
  PCVisibleNode,
  getPCNodeModule,
  computeStyleBlocks
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

      const computedStyleBlocks = computeStyleBlocks(
        selectedInspectorNodes[0],
        root.sourceNodeInspector,
        root.graph
      );

      console.log(computedStyleBlocks);

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
