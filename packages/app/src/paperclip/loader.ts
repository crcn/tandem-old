import { Dependency, DependencyGraph } from "./loader-state";

export type FileLoader = (uri: string) => Promise<string>;

export type LoadEntryOptions = {
  openFile: FileLoader;
};

export type LoadEntryResult = {
  entry: Dependency;
  graph: DependencyGraph
};


export const loadEntry = async (entryFileUri: string, options: LoadEntryOptions): Promise<LoadEntryResult> => { 
  return Promise.resolve(null);
};