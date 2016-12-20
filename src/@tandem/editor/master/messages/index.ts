import { serializable } from "@tandem/common";
import { EditorFamilyType } from "@tandem/editor/common";
import { IMessage, ChannelBus } from "@tandem/mesh";

@serializable("SpawnWorkerRequest")
export class SpawnWorkerRequest implements IMessage {
  static readonly SPAWN_WORKER = "spawnWorker";
  readonly type =  SpawnWorkerRequest.SPAWN_WORKER;
  constructor(readonly env: any) {

  }
}