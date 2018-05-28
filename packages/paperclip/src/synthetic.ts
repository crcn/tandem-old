import { KeyValue, generateUID, EMPTY_ARRAY } from "tandem-common";
import { TreeNode, Bounds } from "tandem-common";
import { DependencyGraph } from "./graph";
import {
  getPCNode,
  PCVisibleNode,
  getPCNodeFrame,
  getPCNodeDependency
} from ".";

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: Bounds;
    style: CSSStyleDeclaration;
  };
};

export type SyntheticFrame = {
  id: string;
  root: SyntheticNode;
  container: HTMLIFrameElement;
  computed?: ComputedDisplayInfo;
};

export type SyntheticSource = {
  nodeId: string;
};

export type SyntheticBaseNode = {
  source: SyntheticSource;
} & TreeNode<string>;

export type SyntheticElement = {
  attributes: KeyValue<string>;
  style: KeyValue<any>;
} & SyntheticBaseNode;

export type SyntheticTextNode = {
  value: string;
  style: KeyValue<any>;
} & SyntheticBaseNode;

export type SyntheticNode = SyntheticElement | SyntheticTextNode;

export const createSyntheticElement = (
  name: string,
  source: SyntheticSource,
  style: KeyValue<any> = {},
  attributes: KeyValue<string>,
  children: SyntheticNode[] = []
): SyntheticElement => ({
  id: generateUID(),
  source,
  name,
  attributes,
  style,
  children
});

export const createSyntheticTextNode = (
  value: string,
  source: SyntheticSource,
  style: KeyValue<any> = {}
): SyntheticTextNode => ({
  id: generateUID(),
  value,
  source,
  name,
  style,
  children: EMPTY_ARRAY
});

export const getSyntheticSourceNode = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getPCNode(node.source.nodeId, graph) as PCVisibleNode;
export const getSyntheticSourceFrame = (
  node: SyntheticNode,
  graph: DependencyGraph
) =>
  getPCNodeFrame(
    node.source.nodeId,
    getPCNodeDependency(node.source.nodeId, graph).content
  );
export const isSyntheticNodeRoot = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getSyntheticSourceFrame(node, graph).children[0].id === node.source.nodeId;
