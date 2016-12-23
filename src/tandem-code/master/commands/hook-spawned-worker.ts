import { BaseStudioMasterCommand } from "./base";
import { SpawnedWorkerMessage } from "@tandem/editor/master";

export class HookSpawnedWorkerCommand extends BaseStudioMasterCommand {
  execute(message: SpawnedWorkerMessage) {
    console.log("HOOKED");
  }
}