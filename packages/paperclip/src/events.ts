import { VirtualNode } from "./virt";
import { Node } from "./ast";
import { SourceLocation } from "./base-ast";

export enum EngineEventKind {
  Evaluated = "Evaluated",
  Error = "Error",
  NodeParsed = "NodeParsed"
}

export enum EngineErrorKind {
  Graph = "Graph",
  Runtime = "Runtime"
}

export enum ParseErrorKind {
  EndOfFile = "EndOfFile"
}

type BaseEngineEvent<KKind extends EngineEventKind> = {
  kind: KKind;
};

export type EvaluatedEvent = {
  filePath: string;
  node?: VirtualNode;
} & BaseEngineEvent<EngineEventKind.Evaluated>;

export type NodeParsedEvent = {
  filePath: string;
  node?: Node;
} & BaseEngineEvent<EngineEventKind.NodeParsed>;

export type BaseEngineErrorEvent<TErrorType extends EngineErrorKind> = {
  filePath: string;
  errorKind: TErrorType;
} & BaseEngineEvent<EngineEventKind.Error>;

export enum GraphErrorInfoType {
  Syntax = "Syntax",
  IncludeNotFound = "IncludeNotFound",
  NotFound = "NotFound"
}

type BaseGraphErrorInfo<KKind extends GraphErrorInfoType> = {
  kind: KKind;
};

export type SyntaxGraphErrorInfo = {
  kind: ParseErrorKind;
  message: string;
  location: SourceLocation;
} & BaseGraphErrorInfo<GraphErrorInfoType.Syntax>;

export type IncludNotFoundErrorInfo = {
  filePath: string;
  message: string;
  location: SourceLocation;
} & BaseGraphErrorInfo<GraphErrorInfoType.IncludeNotFound>;

export type GraphErrorInfo = SyntaxGraphErrorInfo | IncludNotFoundErrorInfo;

export type GraphErrorEvent = {
  info: GraphErrorInfo;
} & BaseEngineErrorEvent<EngineErrorKind.Graph>;

export type RuntimeErrorEvent = {
  filePath: string;
  message: string;
  location: SourceLocation;
} & BaseEngineErrorEvent<EngineErrorKind.Runtime>;

export type EngineErrorEvent = GraphErrorEvent | RuntimeErrorEvent;
export type EngineEvent = EvaluatedEvent | EngineErrorEvent | NodeParsedEvent;
