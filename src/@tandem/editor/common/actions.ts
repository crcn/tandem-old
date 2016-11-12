import {
  IActor,
  Action,
  defineProtectedAction,
  serialize,
  deserialize,
  definePublicAction,
  ISourceLocation,
  ISourcePosition
} from "@tandem/common";
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
  serialize({ filePath, selection }: OpenFileAction) {
    return { filePath, selection };
  },
  deserialize({ filePath, selection }, injector) {
    return new OpenFileAction(filePath, selection);
  }
})
export class OpenFileAction extends Action {
  static readonly OPEN_FILE = "openSourceFile";
  constructor(readonly filePath: string, readonly selection?: ISourceLocation) {
    super(OpenFileAction.OPEN_FILE);
  }
  static execute(filePath: string, selection: ISyntheticSourceInfo, bus: IActor) {
    // TODO - RESOLVE HERE
    return bus.execute(new OpenFileAction(filePath, selection));
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
