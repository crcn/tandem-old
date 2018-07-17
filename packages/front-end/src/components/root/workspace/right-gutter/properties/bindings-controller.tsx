import * as React from "react";
import * as cx from "classnames";
import { compose, pure } from "recompose";
import {
  PCNode,
  Dependency,
  DependencyGraph,
  getSyntheticSourceNode,
  PCSourceTagNames
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

type PropertyBindingOuterProps = {
  alt: boolean;
  fromPropertyName: string;
  toPropertyName: string;
  sourceNode: PCNode;
  graph: DependencyGraph;
  dispatch: Dispatch<any>;
};

const PropertyBinding = compose<PropertyBindingOuterProps, any>(pure)(
  ({
    alt,
    fromPropertyName,
    toPropertyName,
    sourceNode,
    graph
  }: PropertyBindingOuterProps) => {
    return (
      <TableRow variant={cx({ alt })}>
        <TableCell>
          <TextInput value={fromPropertyName} />
        </TableCell>
        <TableCell variant="last">
          <Dropdown
            options={getBindingTargetOptions(sourceNode, graph)}
            value={toPropertyName}
          />
        </TableCell>
      </TableRow>
    );
  }
);

export default compose(
  pure,
  Base => ({
    selectedNodes,
    graph,
    selectedControllerRelativePath,
    onRemoveControllerClick,
    onAddControllerClick,
    dispatch,
    ...rest
  }) => {
    const selectedNode = selectedNodes[0];
    const sourceNode = getSyntheticSourceNode(selectedNode, graph);

    const propertyBindings = [
      { from: "a", to: "b" },
      { from: "a", to: "b" },
      { from: "a", to: "b" },
      { from: "a", to: "b" }
    ];

    const content = [
      <Table>
        <TableRow variant="header">
          <TableCell>From</TableCell>
          <TableCell variant="last">to</TableCell>
        </TableRow>
        {propertyBindings.map(({ from, to }, i) => {
          return (
            <PropertyBinding
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
    return <Base {...rest} contentProps={{ children: content }} />;
  }
);

const VISIBLE_TARGET_OPTIONS = ["style"];

const BASE_ELEMENT_TARGET_OPTIONS = [
  ...VISIBLE_TARGET_OPTIONS,
  "children",
  "attributes"
];

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
    }

    return EMPTY_ARRAY;
  }
);
