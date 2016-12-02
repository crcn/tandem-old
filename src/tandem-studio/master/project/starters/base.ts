export interface IProjectStarterResult {
  workspaceFilePath: string;
}

export abstract class BaseProjectStarter {
  abstract start(directoryPath: string): Promise<IProjectStarterResult>;
}