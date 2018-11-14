import * as React from "react";
import {
  getSyntheticNodeById,
  SyntheticDocument,
  getSyntheticVisibleNodeDocument,
  getPCNodeDependency,
  getGlobalVariables,
  getSyntheticNodeStyleColors,
  getInspectorSyntheticNode,
  InspectorTreeNodeName,
  InspectorContent
} from "paperclip";
import {
  memoize,
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  EMPTY_OBJECT
} from "tandem-common";
import { RightGutterTab } from "./tab.pc";
import * as cx from "classnames";
import { InspectorNode } from "paperclip";
import { BaseRightGutterProps } from "./view.pc";
import { RootState, getGlobalFileUri } from "../../../../state";
import { Dispatch } from "redux";

const TAB_NAMES = ["styles", "properties"];
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
      const globalFileUri =
        root.projectInfo && getGlobalFileUri(root.projectInfo);
      const { currentTab } = this.state;
      const { setTab } = this;

      const { fontFamilies, projectInfo } = root;
      const projectOptions =
        (projectInfo && projectInfo.config && projectInfo.config.options) ||
        EMPTY_OBJECT;

      const globalVariables = getGlobalVariables(root.graph);

      const selectedInspectorNodes = root.selectedInspectorNodes;
      const hasInspectorNodes = Boolean(selectedInspectorNodes.length);
      const availableTabs = hasInspectorNodes
        ? TAB_NAMES
        : INSPECTOR_NODE_TAB_NAMES;
      const availableCurrentTab =
        availableTabs.indexOf(currentTab) !== -1
          ? currentTab
          : availableTabs[0];

      const selectedSyntheticNodes = hasInspectorNodes
        ? selectedInspectorNodes
            .map(node => getInspectorSyntheticNode(node, root.documents))
            .filter(Boolean)
        : EMPTY_ARRAY;

      const syntheticDocument = selectedSyntheticNodes.length
        ? getSyntheticVisibleNodeDocument(
            getInspectorSyntheticNode(
              root.selectedInspectorNodes[0],
              root.documents
            ).id,
            root.documents
          )
        : null;
      const documentColors =
        (syntheticDocument && getSyntheticNodeStyleColors(syntheticDocument)) ||
        EMPTY_ARRAY;

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
            unselectedNodes: selectedInspectorNodes.length === 0
          })}
          variablesSectionProps={{
            dispatch,
            show: selectedInspectorNodes.length === 0,
            globalFileUri,
            globalVariables,
            fontFamilies
          }}
          stylesProps={{
            projectOptions,
            visible: availableCurrentTab === TAB_NAMES[0],
            documentColors,
            dispatch,
            fontFamilies,
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
            rootInspectorNode,
            visible: availableCurrentTab === TAB_NAMES[1],
            sourceNodeUri:
              selectedInspectorNodes[0] &&
              getPCNodeDependency(
                selectedInspectorNodes[0].name === InspectorTreeNodeName.CONTENT
                  ? (selectedInspectorNodes[0] as InspectorContent)
                      .sourceSlotNodeId
                  : selectedInspectorNodes[0].sourceNodeId,
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
