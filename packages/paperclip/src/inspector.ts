import { TreeNode } from "tandem-common";

export enum InspectorNodeName {
  ROOT = "root",
  SOURCE_REP = "source-rep",
  CONTENT = "content",
  SHADOW = "shadow"
}

export type BaseInspectorTreeNode<
  TName extends InspectorNodeName
> = {} & TreeNode<TName>;

export type RootInspectorNode = {} & BaseInspectorTreeNode<
  InspectorNodeName.ROOT
>;

export type SourceRepNode = {
  sourceNodeId: string;
} & BaseInspectorTreeNode<InspectorNodeName.SOURCE_REP>;

export type ContentInspectorNode = {
  slotId: string;
  sourceNodeId?: string;
} & BaseInspectorTreeNode<InspectorNodeName.CONTENT>;

export type ShadowInspectorNode = {
  componentId: string;
  instanceId: string;
} & BaseInspectorTreeNode<InspectorNodeName.CONTENT>;
