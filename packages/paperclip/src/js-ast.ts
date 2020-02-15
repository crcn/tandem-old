import {} from "./ast";

export enum StatementKind {
  Node = "Node",
  Reference = "Reference"
}

type BaseStatement<TKind extends StatementKind> = {
  jsKind: TKind;
};

export type JsNode = BaseStatement<StatementKind.Node> & Node;
export type Reference = {
  path: string[];
} & BaseStatement<StatementKind.Reference>;

export type Statement = Reference | JsNode;
