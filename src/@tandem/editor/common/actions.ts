import { IActor, Action, defineProtectedAction, serialize, deserialize, definePublicAction, ISourceLocation, ISourcePosition } from "@tandem/common";
import { ISyntheticSourceInfo } from "@tandem/sandbox";

definePublicAction()
export class GetServerPortAction extends Action {
  static readonly GET_SERVER_PORT = "getServerPort";
  constructor() {
    super(GetServerPortAction.GET_SERVER_PORT);
  }
  static async execute(bus: IActor) {
    return (await bus.execute(new GetServerPortAction()).read()).value;
  }
}

@definePublicAction({
  serialize({ filePath, position }: OpenSourceFileAction) {
    return { filePath, position };
  },
  deserialize({ filePath, position }, injector) {
    return new OpenSourceFileAction(filePath, position);
  }
})
export class OpenSourceFileAction extends Action {
  static readonly OPEN_SOURCE_FILE = "openSourceFile";
  constructor(readonly filePath: string, readonly position: ISourcePosition) {
    super(OpenSourceFileAction.OPEN_SOURCE_FILE);
  }
  static execute({ filePath, start }: ISyntheticSourceInfo, bus: IActor) {
    // TODO - RESOLVE HERE
    return bus.execute(new OpenSourceFileAction(filePath, start));
  }
}

@definePublicAction()
export class OpenProjectAction extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly filePath: string) {
    super(OpenProjectAction.OPEN_PROJECT_FILE);
  }
  static async execute({ filePath }: { filePath: string }, bus: IActor): Promise<boolean> {
    return (await bus.execute(new OpenProjectAction(filePath)).read()).value;
  }
}

@definePublicAction({
  serialize({ filePath, ranges }: SelectSourceAction) {
    return {
      filePath: filePath,
      ranges: ranges
    }
  },
  deserialize({ filePath, ranges }): SelectSourceAction {
    return new SelectSourceAction(filePath, ranges);
  }
})
export class SelectSourceAction extends Action {
  static readonly SELECT_SOURCE = "selectSource";
  constructor(readonly filePath: string, readonly ranges: ISourceLocation[]) {
    super(SelectSourceAction.SELECT_SOURCE);
  }
}
