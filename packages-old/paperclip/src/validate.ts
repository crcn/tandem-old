import { loadModuleDependencyGraph, IO, ComponentModule, PCModuleType } from "./loader";
import { Diagnostic } from "./parser-utils";
import { parseModuleSource } from "./parser";
import { lintDependencyGraph } from "./linting";
import { inferNodeProps } from "./inferencing";

export const validatePaperclipSource = async (entry: string, io: Partial<IO>) => {
  let allDiagnostics: Diagnostic[] = [];
  
  const { diagnostics: dgDiagnostics, graph } = await loadModuleDependencyGraph(entry, io);

  allDiagnostics.push(...dgDiagnostics);

  let hasInferDiagnostics = false;

  if (dgDiagnostics.length) {
    for (const filePath in graph) {
      const { module } = graph[filePath];
      if (module.type === PCModuleType.COMPONENT) {
        const componentModule = module as ComponentModule;
        for (const component of componentModule.components) {
          const { diagnostics: inferDiagnostics } = inferNodeProps(component.source, filePath);
          allDiagnostics.push(...inferDiagnostics);
          hasInferDiagnostics = hasInferDiagnostics || Boolean(inferDiagnostics.length);
        }
      }
    }
  }

  for (const filePath in graph) {
    const { module } = graph[filePath];
    if (module.type === PCModuleType.COMPONENT) {
      const componentModule = module as ComponentModule;
      for (const component of componentModule.components) {
        const { diagnostics: inferDiagnostics } = inferNodeProps(component.source, filePath);
        allDiagnostics.push(...inferDiagnostics);
        hasInferDiagnostics = hasInferDiagnostics || Boolean(inferDiagnostics.length);
      }
    }
  }

  return allDiagnostics;
}