import { serializable } from "@tandem/common";
import { EditorFamilyType } from "@tandem/editor/common";
import { IMessage, ChannelBus, IBus } from "@tandem/mesh";
import { ChildProcess } from "child_process";

@serializable("SpawnWorkerRequest")
export class SpawnWorkerRequest implements IMessage {
  static readonly SPAWN_WORKER = "spawnWorker";
  readonly type =  SpawnWorkerRequest.SPAWN_WORKER;
  constructor(readonly env: any) {

  }
}

export class SpawnedWorkerMessage implements IMessage {
  static readonly SPAWNED_WORKER = "spawnedWorker";
  readonly type =  SpawnedWorkerMessage.SPAWNED_WORKER;
  constructor(readonly bus: IBus<any>, readonly process: ChildProcess) {

  }
}
