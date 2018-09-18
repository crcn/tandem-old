import * as React from "react";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  getSyntheticVisibleNodeDocument,
  getPCNodeDependency,
  getGlobalVariables
} from "paperclip";
import { memoize, EMPTY_ARRAY, getNestedTreeNodeById } from "tandem-common";
import { RightGutterTab } from "./tab.pc";
import * as cx from "classnames";
import { InspectorNode } from "paperclip";
import { BaseRightGutterProps } from "./index.pc";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";

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

const TAB_NAMES = ["styles", "properties", "variables"];
const INSPECTOR_NODE_TAB_NAMES = ["properties"];

export type Props = {
  root: RootState;
  dispatch: Dispatch;
} & BaseRightGutterProps;

type State = {
  currentTab: string;
};

export default (Base: React.ComponentClass<BaseRightGutterProps>) =>
  class RightGutterController extends React.PureComponent<Props, State> {
    state = {
      currentTab: TAB_NAMES[0]
    };
    setTab = (value: string) => {
      this.setState({ ...this.state, currentTab: value });
    };
    render() {
      const { root, dispatch, ...rest } = this.props;
      const {globalFileUri} = root;
      const { currentTab } = this.state;
      const { setTab } = this;
      if (!root.selectedInspectorNodeIds.length) {
        return null;
      }

      const {fontFamilies} = root;

      const globalVariables = getGlobalVariables(root.graph);

      const hasSyntheticNodes = root.selectedSyntheticNodeIds.length;
      const availableTabs = hasSyntheticNodes
        ? TAB_NAMES
        : INSPECTOR_NODE_TAB_NAMES;
      const availableCurrentTab =
        availableTabs.indexOf(currentTab) !== -1
          ? currentTab
          : availableTabs[0];

      const syntheticDocument = hasSyntheticNodes
        ? getSyntheticVisibleNodeDocument(
            root.selectedSyntheticNodeIds[0],
            root.documents
          )
        : null;

      const selectedSyntheticNodes = hasSyntheticNodes
        ? getSelectedSyntheticNodes(
            root.selectedSyntheticNodeIds,
            root.documents
          )
        : EMPTY_ARRAY;

      const selectedInspectorNodes = getSelectedInspectorNodes(
        root.selectedInspectorNodeIds,
        root.sourceNodeInspector
      );

      const rootInspectorNode = root.sourceNodeInspector;

      const tabs = availableTabs.map((tabName, i) => {
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
            propertiesTab: availableCurrentTab === TAB_NAMES[1],
            variablesTab: availableCurrentTab === TAB_NAMES[2]
          })}
          variablesTabProps={{
            dispatch,
            globalFileUri,
            globalVariables,
            fontFamilies
          }}
          stylesProps={{
            visible: availableCurrentTab === TAB_NAMES[0],
            dispatch,
            syntheticDocument,
            fontFamilies,
            selectedNodes: selectedSyntheticNodes,
            selectedInspectorNodes,
            rootInspectorNode,
            globalVariables,
            selectedVariant: root.selectedVariant,
            graph: root.graph
          }}
          tabsProps={{
            children: tabs
          }}
          propertiesProps={{
            visible: availableCurrentTab === TAB_NAMES[1],
            sourceNodeUri:
              selectedInspectorNodes[0] &&
              getPCNodeDependency(
                selectedInspectorNodes[0].assocSourceNodeId,
                root.graph
              ).uri,
            dispatch,
            graph: root.graph,
            selectedNodes: selectedSyntheticNodes,
            selectedInspectorNodes
          }}
        />
      );
    }
  };
