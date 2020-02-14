import { VirtualNode } from "./virt";

export enum EngineEventKind {
  Evaluated = "Evaluated",
  Error = "Error"
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

export type SourceLocation = {
  start: number;
  end: number;
};

export type EvaluatedEvent = {
  filePath: string;
  node: VirtualNode;
} & BaseEngineEvent<EngineEventKind.Evaluated>;

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
export type EngineEvent = EvaluatedEvent | EngineErrorEvent;
