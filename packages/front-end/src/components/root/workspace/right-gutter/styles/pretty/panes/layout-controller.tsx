import * as React from "react";
import { BaseLayoutProps } from "./layout.pc";
import { memoize, getParentTreeNode } from "tandem-common";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import {
  DropdownMenuOption,
  dropdownMenuOptionFromValue
} from "../../../../../../inputs/dropdown/controller";
import {
  SyntheticVisibleNode,
  isSyntheticVisibleNodeMovable,
  isSyntheticVisibleNodeResizable,
  SyntheticDocument,
  isSyntheticElement,
  DependencyGraph,
  getPCNodeModule,
  isPCContentNode,
  filterVariablesByType,
  PCNode,
  InspectorNode,
  InspectorTreeNodeName,
  PCVariant,
  PCVariable,
  PCVariableType
} from "paperclip";
import { Dispatch } from "redux";
import { ComputedStyleInfo, computeStyleInfo } from "../../state";
import { mapVariablesToCSSVarDropdownOptions } from "./utils";

export const DISPLAY_MENU_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "none",
  "inline"
].map(dropdownMenuOptionFromValue);

export const POSITION_MENU_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "static",
  "relative",
  "absolute",
  "fixed"
].map(dropdownMenuOptionFromValue);

const FLEX_WRAP_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "nowrap",
  "wrap",
  "wrap-reverse"
].map(dropdownMenuOptionFromValue);
const FLEX_DIRECTION_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "row",
  "row-reverse",
  "column",
  "column-reverse"
].map(dropdownMenuOptionFromValue);
const JUSTIFY_CONTENT_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly"
].map(dropdownMenuOptionFromValue);
const ALIGN_ITEMS_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "flex-start",
  "flex-end",
  "center",
  "stretch",
  "baseline"
].map(dropdownMenuOptionFromValue);
const ALIGN_CONTENT_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "stretch"
].map(dropdownMenuOptionFromValue);
const ALIGN_SELF_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch"
].map(dropdownMenuOptionFromValue);

export type Props = {
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
  rootInspectorNode: InspectorNode;
  computedStyleInfo: ComputedStyleInfo;
  selectedInspectorNodes: InspectorNode[];
  globalVariables: PCVariable[];
};

export type InnerProps = {
  onPropertyChangeComplete: any;
  onPropertyChange: any;
} & Props;

export default (Base: React.ComponentClass<BaseLayoutProps>) =>
  class LayoutController extends React.PureComponent<Props> {
    onClick = () => {};
    onPropertyChange = (name, value) => {
      this.props.dispatch(cssPropertyChanged(name, value));
    };

    onPropertyChangeComplete = (name, value) => {
      this.props.dispatch(cssPropertyChangeCompleted(name, value));
    };

    render() {
      const { computedStyleInfo, globalVariables, rootInspectorNode, selectedVariant, selectedInspectorNodes, graph, ...rest } = this.props;
      const { onPropertyChange, onPropertyChangeComplete } = this;

      // computeStyleInfo

      const node = computedStyleInfo.sourceNodes[0];
      if (!node) {
        return null;
      }
      const inspectorNode = selectedInspectorNodes[0];
      const module = getPCNodeModule(node.id, graph);
      
      const showMoveInputs = isPCContentNode(node, graph) ||  /fixed|relative|absolute/.test(computedStyleInfo.style.position || "static"); 
      const showSizeInputs = showMoveInputs || /block|inline-block|flex|inline-flex/.test(computedStyleInfo.style.display || "inline");
      const showParentFlexInputs =
      computedStyleInfo.style.display === "flex" || computedStyleInfo.style.display === "inline-flex";
      
      let parentInspectorNode: InspectorNode;
      let currentInspectorNode: InspectorNode = inspectorNode;
      while(1) {
        parentInspectorNode = getParentTreeNode(currentInspectorNode.id, rootInspectorNode);
        if (parentInspectorNode.name === InspectorTreeNodeName.SOURCE_REP) {
          break;
        }
        currentInspectorNode = parentInspectorNode;
      }

      const parentComputedInfo = parentInspectorNode && computeStyleInfo([parentInspectorNode], rootInspectorNode, selectedVariant, graph);

      const showChildFlexInputs = parentInspectorNode && 
        (parentComputedInfo.style.display === "flex" ||
        parentComputedInfo.style.display === "inline-flex");

      return (
        <Base
          {...rest}
          displayInputProps={{
            value: computedStyleInfo.style.display,
            options: DISPLAY_MENU_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "display",
              onPropertyChangeComplete
            )
          }}
          positionInputProps={{
            value: computedStyleInfo.style.position,
            options: POSITION_MENU_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "position",
              onPropertyChangeComplete
            )
          }}
          leftInputProps={{
            value: computedStyleInfo.style.left,
            onChangeComplete: propertyChangeCallback(
              "left",
              onPropertyChangeComplete
            )
          }}
          topInputProps={{
            value: computedStyleInfo.style.top,
            onChangeComplete: propertyChangeCallback(
              "top",
              onPropertyChangeComplete
            )
          }}
          widthInputProps={{
            value: computedStyleInfo.style.width,
            onChange: propertyChangeCallback("width", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "width",
              onPropertyChangeComplete
            )
          }}
          heightInputProps={{
            value: computedStyleInfo.style.height,
            onChange: propertyChangeCallback("height", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "height",
              onPropertyChangeComplete
            )
          }}
          sizeControlsProps={{
            style: {
              display: showSizeInputs ? "flex" : "none"
            }
          }}
          moveControlsProps={{
            style: {
              display: showMoveInputs ? "flex" : "none"
            }
          }}
          flexDirectionInputProps={{
            value: computedStyleInfo.style["flex-direction"],
            options: FLEX_DIRECTION_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "flex-direction",
              onPropertyChangeComplete
            )
          }}
          flexWrapInputProps={{
            value: computedStyleInfo.style["flex-wrap"],
            options: FLEX_WRAP_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "flex-wrap",
              onPropertyChangeComplete
            )
          }}
          justifyContentInputProps={{
            value: computedStyleInfo.style["justify-content"],
            options: JUSTIFY_CONTENT_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "justify-content",
              onPropertyChangeComplete
            )
          }}
          alignItemsInputProps={{
            value: computedStyleInfo.style["align-items"],
            options: ALIGN_ITEMS_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "align-items",
              onPropertyChangeComplete
            )
          }}
          alignContentInputProps={{
            value: computedStyleInfo.style["align-content"],
            options: ALIGN_CONTENT_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "align-content",
              onPropertyChangeComplete
            )
          }}
          flexBasisInputProps={{
            value: computedStyleInfo.style["flex-basis"],
            onChange: propertyChangeCallback("flex-basis", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "flex-basis",
              onPropertyChangeComplete
            )
          }}
          flexGrowInputProps={{
            value: computedStyleInfo.style["flex-grow"],
            onChange: propertyChangeCallback("flex-grow", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "flex-grow",
              onPropertyChangeComplete
            )
          }}
          flexShrinkInputProps={{
            value: computedStyleInfo.style["flex-shrink"],
            onChange: propertyChangeCallback("flex-shrink", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "flex-shrink",
              onPropertyChangeComplete
            )
          }}
          alignSelfInputProps={{
            value: computedStyleInfo.style["align-self"],
            options: ALIGN_SELF_OPTIONS,
            onChangeComplete: propertyChangeCallback(
              "align-self",
              onPropertyChangeComplete
            )
          }}
          parentFlexboxControlsProps={{
            style: {
              display: showParentFlexInputs ? "block" : "none"
            }
          }}
          childFlexboxControlsProps={{
            style: {
              display: showChildFlexInputs ? "block" : "none"
            }
          }}
        />
      );
    }
  };

const propertyChangeCallback = memoize((name: string, listener) => value =>
  listener(name, value)
);
