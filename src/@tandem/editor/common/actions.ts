import {
  Action,
  serialize,
  deserialize,
  ISourceLocation,
  ISourcePosition,
  definePublicAction,
  defineProtectedAction,
} from "@tandem/common";
import { ISyntheticSourceInfo } from "@tandem/sandbox";
import { IDispatcher, IStreamableDispatcher, readOneChunk} from "@tandem/mesh";

definePublicAction()
export class GetServerPortAction extends Action {
  static readonly GET_SERVER_PORT = "getServerPort";
  constructor() {
    super(GetServerPortAction.GET_SERVER_PORT);
  }
  static async dispatch(bus: IStreamableDispatcher<any>) {
    return (await readOneChunk(bus.dispatch(new GetServerPortAction()))).value;
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
  static dispatch(filePath: string, selection: ISyntheticSourceInfo, bus: IStreamableDispatcher<any>) {
    // TODO - RESOLVE HERE
    return bus.dispatch(new OpenFileAction(filePath, selection));
  }
}

@definePublicAction()
export class OpenProjectAction extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly filePath: string) {
    super(OpenProjectAction.OPEN_PROJECT_FILE);
  }
  static async dispatch({ filePath }: { filePath: string }, bus: IStreamableDispatcher<any>): Promise<boolean> {
    return (await readOneChunk(bus.dispatch(new OpenProjectAction(filePath)))).value;
  }
}


@definePublicAction({
  serialize({ filePaths, options }: AddFilesAction) {
    return { filePaths, options }
  },
  deserialize({ filePaths, options}) {
    return new AddFilesAction(filePaths, options);
  }
})
export class AddFilesAction extends Action {
  static readonly ADD_FILES = "addFiles";
  constructor(readonly filePaths: string[], readonly options?: { left: number, top: number }) {
    super(AddFilesAction.ADD_FILES);
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
