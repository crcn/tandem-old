import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { getSyntheticNodeById, SyntheticDocument, getSyntheticVisibleNodeDocument } from "paperclip";
import { memoize } from "tandem-common";
const { RightGutterTab } = require("./tab.pc");

const getSelectedNoded = memoize(
  (nodeIds: string[], documents: SyntheticDocument[]) => {
    return nodeIds.map(id => getSyntheticNodeById(id, documents));
  }
);

const TAB_NAMES = ["styles", "properties"];

export default compose(
  pure,
  withState("currentTab", "setTab", TAB_NAMES[0]),
  withHandlers({
    onTabClick: ({ setTab }) => (tabName) => {
      setTab(tabName);
    }
  }),
  Base => ({ root, dispatch, setTab, currentTab }) => {

  if (!root.selectedNodeIds.length) {
    return null;
  }

  const syntheticDocument = getSyntheticVisibleNodeDocument(root.selectedNodeIds[0], root.documents);
  const selectedNodes = getSelectedNoded(root.selectedNodeIds, root.documents);

  const tabs = TAB_NAMES.map(tabName => {
    return <RightGutterTab key={tabName} onClick={() => setTab(tabName)}>{tabName}</RightGutterTab>;
  });

  return <Base stylesProps={{
    dispatch,
    syntheticDocument,
    selectedNodes,
    graph: root.graph,
    style: {
      display: currentTab === TAB_NAMES[0] ? "block": "none"
    }
  }}
  tabsProps={{
    children: tabs
  }}
  propertiesProps={{
    dispatch,
    syntheticDocument,
    selectedNodes,
    style: {
      display: currentTab === TAB_NAMES[1] ? "block": "none"
    }
  }} />;
});
