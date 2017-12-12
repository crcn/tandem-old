import { loadModuleDependencyGraph, IO } from "./loader";
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
      for (const component of module.components) {
        const { diagnostics: inferDiagnostics } = inferNodeProps(component.source, filePath);
        allDiagnostics.push(...inferDiagnostics);
        hasInferDiagnostics = hasInferDiagnostics || Boolean(inferDiagnostics.length);
      }
    }
  }

  for (const filePath in graph) {
    const { module } = graph[filePath];
    for (const component of module.components) {
      const { diagnostics: inferDiagnostics } = inferNodeProps(component.source, filePath);
      allDiagnostics.push(...inferDiagnostics);
      hasInferDiagnostics = hasInferDiagnostics || Boolean(inferDiagnostics.length);
    }
  }

  return allDiagnostics;
}