import { Node } from "./ast";

export enum StatementKind {
  Node = "Node",
  Reference = "Reference"
}

type BaseStatement<TKind extends StatementKind> = {
  jsKind: TKind;
};

export type JsNode = Node & BaseStatement<StatementKind.Node>;
export type Reference = {
  path: string[];
} & BaseStatement<StatementKind.Reference>;

export type Statement = Reference | JsNode;
