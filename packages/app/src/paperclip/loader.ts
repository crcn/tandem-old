import { Dependency, DependencyGraph } from "./loader-state";
import { createComponentModule, BaseModule, ModuleType, ComponentModule } from "./dsl";

export type FileLoader = (uri: string) => string | Promise<string>;

export type LoadEntryOptions = {
  openFile: FileLoader;
};

export type LoadEntryResult = {
  entry: Dependency;
  graph: DependencyGraph;
};

export const loadEntry = async (entryFileUri: string, options: LoadEntryOptions): Promise<LoadEntryResult> => { 
  const graph: DependencyGraph = {};
  const queue: string[] = [entryFileUri];
  while(queue.length) {
    const currentUri = queue.shift();
    if (graph[currentUri]) {
      continue;
    }
    const module = await loadModule(currentUri, options);
    if (module.type !== ModuleType.COMPONENT) {
      throw new Error(`Module type ${module.type} is not currently supported`);
    }
    const dependency = createDependency(currentUri, module);
    graph[currentUri] = dependency;
    if (module.type === ModuleType.COMPONENT) {
      const imports = module as ComponentModule;

      // todo - need to make relative
      queue.push(...(Object.values(imports) as string[]));
    }
  }
  
  return {
    entry: graph[entryFileUri],
    graph
  };
};

const createDependency = (uri: string, module: BaseModule): Dependency => ({
  uri,
  module,
  originalModule: module,
});

const loadModule = async (uri: string, options: LoadEntryOptions): Promise<BaseModule> => {
  const content = await options.openFile(uri);


  // TODO - support other extensions in the future like images
  if (/xml$/.test(uri)) {

    // TODO - transform XML to JSON
    throw new Error(`XML is not supported yet`);
  } else if (/json$/.test(uri)) {
    throw new Error(`File extension is not supported yet`);
  } else {
    const moduleSource = JSON.parse(content);
    return createComponentModule(moduleSource);
  }
};