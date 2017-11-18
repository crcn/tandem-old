import { ApplicationState } from "../state";
import { PUBLIC_SRC_DIR_PATH } from "../constants";
import { PAPERCLIP_FILE_PATTERN } from "../constants";
import * as glob from "glob";
import * as path from "path";
import { uniq } from "lodash";
import * as md5 from "md5";
import * as fs from "fs";
import { weakMemo } from "aerial-common2";
import { parseModuleSource, loadModuleAST, defaultResolveModulePath, loadModuleDependencyGraph, Component, getUsedDependencies, getImportDependencies, getChildComponentInfo, getDependencyChildComponentInfo, getModuleComponent, ChildComponentInfo } from "paperclip";

// TODO - will eventually want to use app state to check extension
export const isPaperclipFile = (filePath: string, state: ApplicationState) => getModulesFileTester(state)(filePath);

export const getModulesFilePattern = ({ cwd, config: { sourceDirectory }}: ApplicationState) => path.join(sourceDirectory || cwd, "**", PAPERCLIP_FILE_PATTERN);

export const getModulesFileTester = (state: ApplicationState) => {
  return filePath => /\.pc$/.test(filePath);
}

export const getModuleFilePaths = (state: ApplicationState) => glob.sync(getModulesFilePattern(state));

// side effect code - use in sagas
export const getReadFile = weakMemo((state: ApplicationState) => (filePath: string) => {
  const fileCache = state.fileCache.find((item) => item.filePath === filePath);
  return fileCache ? fileCache.content.toString("utf8") : fs.readFileSync(filePath, "utf8")
});


export const getAllModules = (state: ApplicationState) => {
  const moduleFilePaths = getModuleFilePaths(state);
  const read = getReadFile(state);
  return moduleFilePaths.map((filePath) => {
    const ast = parseModuleSource(read(filePath));
    const module = loadModuleAST(ast, filePath);
    return module;
  });
}

export const getAllModuleComponents = (state: ApplicationState) => {
  const components: Component[] = [];
  for (const module of getAllModules(state)) {
    components.push(...module.components);
}
  return components;
}

export const getAssocComponents = async (matchFilePath: string, state: ApplicationState): Promise<ChildComponentInfo> => {
  const allFilePaths = getModuleFilePaths(state);
  const assocComponents: ChildComponentInfo = {};

  const readFileSync = getReadFile(state);

  for (const moduleFilePath of allFilePaths) {
    const graph = await loadModuleDependencyGraph(moduleFilePath, {
      readFile: readFileSync
    });

    const entry = graph[moduleFilePath];

    // first check for affected components
    const childComponentInfo = getDependencyChildComponentInfo(entry, graph);

    for (const tagName in childComponentInfo) {
      const dep = childComponentInfo[tagName];
      if (dep.module.uri === matchFilePath) {
        assocComponents[tagName] = entry;
      }
    }

    // no affected components, check import match. If there's a match, then
    // return all components. (imports may affect child components -- e.g: if there's a global style defined)
    if (!assocComponents.length) {
      const importedDependencies = getImportDependencies(entry, graph);
      for (const globalDep of importedDependencies) {
        if (globalDep.module.uri === matchFilePath) {
          for (const component of entry.module.components) {
            assocComponents[component.id] = entry;
          }
          break;
        }
      }
    }
  }

  return assocComponents;
};


export const getModuleId = (filePath: string) => md5(filePath);

export const getPublicFilePath = (filePath: string, state: ApplicationState) => filePath.indexOf(state.config.sourceDirectory) !== -1 ? filePath.replace(state.config.sourceDirectory, PUBLIC_SRC_DIR_PATH) : null;


export const getComponentPreviewUrl = (componentId: string, state: ApplicationState) => `http://localhost:${state.port}/components/${componentId}/preview`;