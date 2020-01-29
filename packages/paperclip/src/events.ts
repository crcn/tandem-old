import { VirtualNode } from "./virt";

export enum EngineEventType {
  Evaluated = "Evaluated"
}

type BaseEngineEvent<TType extends EngineEventType> = {
  type: TType;
};

export type EvaluatedEvent = {
  file_path: String;
  node: VirtualNode;
} & BaseEngineEvent<EngineEventType.Evaluated>;

export type EngineEvent = EvaluatedEvent;
