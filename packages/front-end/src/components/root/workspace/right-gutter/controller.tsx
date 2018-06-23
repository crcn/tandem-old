import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { getSyntheticNodeById, SyntheticDocument, getSyntheticVisibleNodeDocument } from "paperclip";
import { memoize } from "tandem-common";

const getSelectedNoded = memoize(
  (nodeIds: string[], documents: SyntheticDocument[]) => {
    return nodeIds.map(id => getSyntheticNodeById(id, documents));
  }
);

export default compose(pure, Base => ({ root, dispatch }) => {

  if (!root.selectedNodeIds.length) {
    return null;
  }

  const syntheticDocument = getSyntheticVisibleNodeDocument(root.selectedNodeIds[0], root.documents);
  const selectedNodes = getSelectedNoded(root.selectedNodeIds, root.documents);

  return <Base stylerProps={{
    dispatch,
    syntheticDocument,
    selectedNodes
  }}
  propertiesProps={{
    dispatch,
    syntheticDocument,
    selectedNodes
  }} />;
});
