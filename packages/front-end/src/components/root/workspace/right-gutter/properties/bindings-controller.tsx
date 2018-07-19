import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  PCNode,
  Dependency,
  DependencyGraph,
  getSyntheticSourceNode,
  PCSourceTagNames,
  getPCNodeContentNode,
  getPCNodeModule
} from "paperclip";
import { Dispatch } from "redux";
import {
  memoize,
  EMPTY_ARRAY
} from "../../../../../../node_modules/tandem-common";
const {
  Table,
  TableRow,
  TableCell
} = require("../../../../inputs/table/index.pc");
const { TextInput } = require("../../../../inputs/text/view.pc");
const { Dropdown } = require("../../../../inputs/dropdown/view.pc");
import {
  dropdownMenuOptionFromValue,
  DropdownMenuOption
} from "../../../../inputs/dropdown/controller";
import {
  propertyBindingUpdated,
  propertyBindingAddButtonClicked,
  propertyBindingRemoveButtonClicked
} from "../../../../../actions";

type PropertyBindingOuterProps = {
  alt: boolean;
  index: number;
  fromPropertyName: string;
  toPropertyName: string;
  sourceNode: PCNode;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
  onClick: any;
};

type PropertyBindingInnerProps = {
  onToPropertyChange: any;
  onFromPropertyChange: any;
} & PropertyBindingOuterProps;

const PropertyBinding = compose<PropertyBindingOuterProps, any>(
  pure,
  withHandlers({
    onToPropertyChange: ({
      index,
      dispatch,
      fromPropertyName
    }: PropertyBindingOuterProps) => value => {
      dispatch(propertyBindingUpdated(index, fromPropertyName, value));
    },
    onFromPropertyChange: ({
      index,
      dispatch,
      toPropertyName
    }: PropertyBindingOuterProps) => value => {
      dispatch(propertyBindingUpdated(index, value, toPropertyName));
    },
    onClick: ({ onClick, index }) => () => onClick(index)
  })
)(
  ({
    alt,
    onClick,
    onToPropertyChange,
    onFromPropertyChange,
    fromPropertyName,
    toPropertyName,
    sourceNode,
    graph
  }: PropertyBindingInnerProps) => {
    return (
      <TableRow variant={cx({ alt })} onClick={onClick}>
        <TableCell>
          <TextInput value={fromPropertyName} onChange={onFromPropertyChange} />
        </TableCell>
        <TableCell variant="last">
          <Dropdown
            options={getBindingTargetOptions(sourceNode, graph)}
            value={toPropertyName}
            onChangeComplete={onToPropertyChange}
          />
        </TableCell>
      </TableRow>
    );
  }
);

export default compose(
  pure,
  withState("selectedBindingIndex", "setSelectedBindingIndex", -1),
  withHandlers({
    onAddButtonClick: ({ dispatch }) => () => {
      dispatch(propertyBindingAddButtonClicked());
    },
    onRemoveButtonClick: ({
      dispatch,
      selectedBindingIndex,
      setSelectedBindingIndex
    }) => () => {
      dispatch(propertyBindingRemoveButtonClicked(selectedBindingIndex));
      setSelectedBindingIndex(-1);
    },
    onBindingClick: ({ setSelectedBindingIndex }) => index => {
      setSelectedBindingIndex(index);
    }
  }),
  Base => ({
    selectedNodes,
    graph,
    selectedBindingIndex,
    onRemoveButtonClick,
    onBindingClick,
    selectedControllerRelativePath,
    onRemoveControllerClick,
    onAddControllerClick,
    onAddButtonClick,
    dispatch,
    ...rest
  }) => {
    const selectedNode = selectedNodes[0];
    const sourceNode = getSyntheticSourceNode(selectedNode, graph);
    const contentNode = getPCNodeContentNode(
      sourceNode.id,
      getPCNodeModule(sourceNode.id, graph)
    );

    // bindings _only_ apply for components, so do not show them if the content node
    // is a regular text, element, or component instance.
    if (contentNode.name !== PCSourceTagNames.COMPONENT) {
      return null;
    }

    const propertyBindings =
      (sourceNode.bind && sourceNode.bind.properties) || EMPTY_ARRAY;

    const content = [
      <Table>
        <TableRow variant="header">
          <TableCell>From</TableCell>
          <TableCell variant="last">to</TableCell>
        </TableRow>
        {propertyBindings.map(({ from, to }, i) => {
          return (
            <PropertyBinding
              onClick={onBindingClick}
              key={i}
              index={i}
              alt={i % 2 === 0}
              sourceNode={sourceNode}
              graph={graph}
              dispatch={dispatch}
              fromPropertyName={from}
              toPropertyName={to}
            />
          );
        })}
      </Table>
    ];
    return (
      <Base
        {...rest}
        variant={cx({
          hasSelectedBinding: selectedBindingIndex !== -1
        })}
        addButtonProps={{ onClick: onAddButtonClick }}
        removeButtonProps={{ onClick: onRemoveButtonClick }}
        contentProps={{ children: content }}
      />
    );
  }
);

const VISIBLE_TARGET_OPTIONS = ["style"];

// TODO
const BASE_EVENT_TARGET_OPTIONS = ["onClick"];

const BASE_ELEMENT_TARGET_OPTIONS = [
  ...VISIBLE_TARGET_OPTIONS,
  ...BASE_EVENT_TARGET_OPTIONS
];

// TODO - fill me out
const ELEMENT_BY_TAG_TARGET_OPTIONS = {
  img: [...BASE_ELEMENT_TARGET_OPTIONS, "src"]
};

const TEXT_NODE_TARGET_OPTIONS: DropdownMenuOption[] = [
  ...VISIBLE_TARGET_OPTIONS,
  "text"
].map(dropdownMenuOptionFromValue);

const ELEMENT_TARGET_OPTIONS: DropdownMenuOption[] = [
  ...BASE_ELEMENT_TARGET_OPTIONS
].map(dropdownMenuOptionFromValue);

const getBindingTargetOptions = memoize(
  (sourceNode: PCNode, graph: DependencyGraph) => {
    if (sourceNode.name === PCSourceTagNames.TEXT) {
      return TEXT_NODE_TARGET_OPTIONS;
    } else if (sourceNode.name === PCSourceTagNames.ELEMENT) {
      // TODO - needs to be per tag name
      return ELEMENT_TARGET_OPTIONS;
    } else if (sourceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) {
      // TODO - needs to be per tag name
      return ELEMENT_TARGET_OPTIONS;
    }

    return EMPTY_ARRAY;
  }
);
