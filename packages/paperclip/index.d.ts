export enum VirtualNodeType {
  Element = "Element",
  Text = "Text",
  Fragment = "Fragment"
}

type VirtualBaseNode<TType extends VirtualNodeType> = {
  type: VirtualNodeType.Element;
};

export type VirtualAttribute = {
  name: string;
  value: string;
};
export type VirtualElement = {
  attributes: VirtualAttribute[];
  children: VirtualNode;
} & VirtualBaseNode<VirtualNodeType.Element>;

export type VirtualText = {
  value: string;
} & VirtualBaseNode<VirtualNodeType.Element>;

export type VirtualNode = VirtualElement | VirtualText;

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

export class Engine {
  startRuntime(paperclipFilePath: string);
  stopRuntime(paperclipFilePath: string);
  updateVirtualFileContent(filePath: string, content: string);
  drainEvents(): EngineEvent[];
  onEvent(listener: (event: EngineEvent) => void): () => void;
}
