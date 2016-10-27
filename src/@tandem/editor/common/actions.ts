import { IActor, Action, defineProtectedAction, definePublicAction } from "@tandem/common";

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
