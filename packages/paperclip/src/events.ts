import { VirtualNode } from "./virt";

export enum EngineEventType {
  Evaluated = "Evaluated",
  ParseError = "ParseError"
}

export enum ParseErrorKind {
  EndOfFile = "EndOfFile"
}

type BaseEngineEvent<TType extends EngineEventType> = {
  type: TType;
};

export type EvaluatedEvent = {
  file_path: String;
  node: VirtualNode;
} & BaseEngineEvent<EngineEventType.Evaluated>;

export type ParseError = {
  kind: ParseErrorKind;
  message: String;
  pos: number;
};

export type ParseErrorEvent = {
  file_path: string;
  error: ParseError;
} & BaseEngineEvent<EngineEventType.ParseError>;

export type EngineEvent = EvaluatedEvent | ParseErrorEvent;
