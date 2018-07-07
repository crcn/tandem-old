import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  getSyntheticVisibleNodeDocument,
  getSyntheticSourceUri
} from "paperclip";
import { memoize } from "tandem-common";
const { RightGutterTab } = require("./tab.pc");
import * as cx from "classnames";

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
    onTabClick: ({ setTab }) => tabName => {
      setTab(tabName);
    }
  }),
  Base => ({ root, dispatch, setTab, currentTab, ...rest }) => {
    if (!root.selectedNodeIds.length) {
      return null;
    }

    const syntheticDocument = getSyntheticVisibleNodeDocument(
      root.selectedNodeIds[0],
      root.documents
    );
    const selectedNodes = getSelectedNoded(
      root.selectedNodeIds,
      root.documents
    );

    const tabs = TAB_NAMES.map(tabName => {
      return (
        <RightGutterTab
          key={tabName}
          variant={cx({ selected: currentTab === tabName })}
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
          stylesTab: currentTab === TAB_NAMES[0],
          propertiesTab: currentTab === TAB_NAMES[1]
        })}
        stylesProps={{
          dispatch,
          syntheticDocument,
          fontFamilies: root.fontFamilies,
          selectedNodes,
          selectedVariant: root.selectedVariant,
          graph: root.graph,
          selectedInheritComponentId: root.selectedInheritComponentId
        }}
        tabsProps={{
          children: tabs
        }}
        propertiesProps={{
          selectedControllerRelativePath: root.selectedControllerRelativePath,
          sourceNodeUri: getSyntheticSourceUri(selectedNodes[0], root.graph),
          dispatch,
          syntheticDocument,
          graph: root.graph,
          selectedNodes
        }}
      />
    );
  }
);
