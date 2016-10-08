import { Action } from "./base";
import { IActor } from "@tandem/common/actors";
import { File } from "../models";

export * from "./base";
export * from "./core";

export class SaveAllFilesAction extends Action {
  static readonly SAVE_ALL_FILES = "saveAllFiles";
  constructor() {
    super(SaveAllFilesAction.SAVE_ALL_FILES);
  }
}

export class OpenProjectAction extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly path: string) {
    super(OpenProjectAction.OPEN_PROJECT_FILE);
  }
  static async execute({ path }: { path: string }, bus: IActor): Promise<boolean> {
    return (await bus.execute(new OpenProjectAction(path)).read()).value;
  }
}

export class GetPrimaryProjectFilePathAction extends Action {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async execute(bus: IActor): Promise<string> {
    return (await bus.execute(new GetPrimaryProjectFilePathAction()).read()).value;
  }
}

export class EntityAction extends Action {
  static readonly ENTITY_STALE = "entityStale";
  static readonly ENTITY_DIRTY = "entityDirty";
}

export class EntityLoaderAction extends Action {
  static readonly ENTITY_CONTENT_FORMATTED = "entityContentFormatted";
  constructor(type: string) {
    super(type);
  }
}

export class EntityRuntimeAction extends Action {
  static readonly RUNTIME_OPENED_MAIN_ENTRY = "runtimeEvaluated";
  constructor(type: string) {
    super(type);
  }
}

export class ResolveAction extends Action {
  static readonly RESOLVE = "resolve";
  constructor(readonly filePath: string, readonly relativeFilePath?: string) {
    super(ResolveAction.RESOLVE);
  }
  static async execute(path: string, relativeFile: string, bus: IActor): Promise<string> {
    return (await bus.execute(new ResolveAction(path, relativeFile)).read()).value;
  }
}

