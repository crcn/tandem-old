import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  getSyntheticVisibleNodeDocument,
  getSyntheticSourceUri,
  getPCNodeDependency
} from "paperclip";
import { memoize, EMPTY_ARRAY, getNestedTreeNodeById } from "tandem-common";
const { RightGutterTab } = require("./tab.pc");
import * as cx from "classnames";
import { InspectorNode } from "state/pc-inspector-tree";

const getSelectedSyntheticNodes = memoize(
  (nodeIds: string[], documents: SyntheticDocument[]) => {
    return nodeIds.map(id => getSyntheticNodeById(id, documents));
  }
);

const getSelectedInspectorNodes = memoize(
  (nodeIds: string[], sourceInspector: InspectorNode): InspectorNode[] => {
    return nodeIds
      .map(id => getNestedTreeNodeById(id, sourceInspector))
      .filter(Boolean);
  }
);

const TAB_NAMES = ["styles", "properties"];
const INSPECTOR_NODE_TAB_NAMES = ["properties"];

export default compose(
  pure,
  withState("currentTab", "setTab", TAB_NAMES[0]),
  withHandlers({
    onTabClick: ({ setTab }) => tabName => {
      setTab(tabName);
    }
  }),
  Base => ({ root, dispatch, setTab, currentTab, ...rest }) => {
    if (!root.selectedInspectorNodeIds.length) {
      return null;
    }

    const hasSyntheticNodes = root.selectedSyntheticNodeIds.length;
    const availableTabs = hasSyntheticNodes
      ? TAB_NAMES
      : INSPECTOR_NODE_TAB_NAMES;
    const availableCurrentTab =
      availableTabs.indexOf(currentTab) !== -1 ? currentTab : availableTabs[0];

    const syntheticDocument = hasSyntheticNodes
      ? getSyntheticVisibleNodeDocument(
          root.selectedSyntheticNodeIds[0],
          root.documents
        )
      : null;

    const selectedSyntheticNodes = hasSyntheticNodes
      ? getSelectedSyntheticNodes(root.selectedSyntheticNodeIds, root.documents)
      : EMPTY_ARRAY;

    const selectedInspectorNodes = getSelectedInspectorNodes(
      root.selectedInspectorNodeIds,
      root.sourceNodeInspector
    );

    const tabs = availableTabs.map(tabName => {
      return (
        <RightGutterTab
          key={tabName}
          variant={cx({ selected: availableCurrentTab === tabName })}
          onClick={() => setTab(tabName)}
        >
          {tabName}
        </RightGutterTab>
      );
    });

    return (
      <Base
        {...rest}
        variant={cx({
          stylesTab: availableCurrentTab === TAB_NAMES[0],
          propertiesTab: availableCurrentTab === TAB_NAMES[1]
        })}
        stylesProps={{
          dispatch,
          syntheticDocument,
          fontFamilies: root.fontFamilies,
          selectedNodes: selectedSyntheticNodes,
          selectedInspectorNodes,
          selectedVariant: root.selectedVariant,
          graph: root.graph,
          selectedInheritComponentId: root.selectedInheritComponentId
        }}
        tabsProps={{
          children: tabs
        }}
        propertiesProps={{
          selectedControllerRelativePath: root.selectedControllerRelativePath,
          sourceNodeUri:
            selectedInspectorNodes[0] &&
            getPCNodeDependency(
              selectedInspectorNodes[0].assocSourceNodeId,
              root.graph
            ).uri,
          dispatch,
          syntheticDocument,
          graph: root.graph,
          selectedNodes: selectedSyntheticNodes,
          selectedInspectorNodes
        }}
      />
    );
  }
);
