import { ApplicationState, AllComponentsPreviewEntry, RegisteredComponent } from "../state";

import { DEFAULT_COMPONENT_PREVIEW_SIZE, DEFAULT_COMPONENT_SOURCE_DIRECTORY, PUBLIC_SRC_DIR_PATH, TMP_DIRECTORY } from "../constants";
import * as glob from "glob";
import * as path from "path";
import * as minimatch from "minimatch";
import { uniq } from "lodash";
import * as md5 from "md5";
import * as fs from "fs";
import * as fsa from "fs-extra";
import { weakMemo, Bounds } from "aerial-common2";
import { parseModuleSource, loadModuleAST, defaultResolveModulePath, loadModuleDependencyGraph, Component, getUsedDependencies, getImportDependencies, getChildComponentInfo, getDependencyChildComponentInfo, getModuleComponent, ChildComponentInfo, getComponentMetadataItem, generatePrettyErrorMessage, DependencyGraph } from "paperclip";

enum ComponentMetadataName {
  PREVIEW = "preview",
  INTERNAL = "internal"
};

// TODO - will eventually want to use app state to check extension
export const isPaperclipFile = (filePath: string, state: ApplicationState) => getModulesFileTester(state)(filePath);


export const getModulesFilePattern = ({ options: {cwd, projectConfig: { sourceFilePattern }}}: ApplicationState) => path.join(cwd, sourceFilePattern);

export const getModulesFileTester = (state: ApplicationState) => {
  return filePath => /\.pc$/.test(filePath);
}

export const getModuleFilePaths = (state: ApplicationState) => glob.sync(getModulesFilePattern(state));

export const getModuleSourceDirectory = (state: ApplicationState) => {
  if (state.fileCache.length) {
    const pcFileCacheItem = state.fileCache.find((item) => (
      minimatch(state.options.projectConfig.sourceFilePattern, item.filePath)
    ));

    if (pcFileCacheItem) {
      return path.dirname(pcFileCacheItem.filePath);
    }
  }
  const sourceFiles = getModuleFilePaths(state);
  if (!sourceFiles.length) {

    if (minimatch(state.options.projectConfig.sourceFilePattern, DEFAULT_COMPONENT_SOURCE_DIRECTORY)) {
      return path.join(state.options.cwd,DEFAULT_COMPONENT_SOURCE_DIRECTORY);
    } else {

      // scan for ALL files and directories if source directory does not match
      const allFiles = glob.sync(state.options.projectConfig.sourceFilePattern.replace(/\.*\w+$/, ""));

      for (const file of allFiles) {
        if (fs.lstatSync(file).isDirectory()) {
          return file;
        }
      }
    }
  }

  return path.dirname(sourceFiles[0]);
}

// side effect code - use in sagas
export const getReadFile = weakMemo((state: ApplicationState) => (filePath: string) => {
  const fileCache = state.fileCache.find((item) => item.filePath === filePath);
  return fileCache ? fileCache.content.toString("utf8") : fs.readFileSync(filePath, "utf8")
});


export const getAllModules = (state: ApplicationState) => {
  const moduleFilePaths = getModuleFilePaths(state);
  const read = getReadFile(state);
  return moduleFilePaths.map((filePath) => {
    const result = parseModuleSource(read(filePath));
    if (!result.root) {
      return;
    }
    const module = loadModuleAST(result.root, filePath);
    return module;
  }).filter(Boolean);
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
    const { graph } = await loadModuleDependencyGraph(moduleFilePath, {
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

export const getPublicFilePath = (filePath: string, state: ApplicationState) => {
  const sourceDirectory = getModuleSourceDirectory(state);
  if (filePath.indexOf(sourceDirectory) === 0) {
    return filePath.replace(sourceDirectory, PUBLIC_SRC_DIR_PATH);
  }
  return null;
}


export const getComponentPreviewUrl = (componentId: string, state: ApplicationState) => `http://localhost:${state.options.port}/components/${componentId}/preview`;

export const getAvailableComponents = (state: ApplicationState, readFileSync: (filePath) => string) => {
  return getModuleFilePaths(state).reduce((components, filePath) => (
    [...components, ...getComponentsFromSourceContent(readFileSync(filePath), filePath, state)]
  ), []);
}

export const getComponentsFromSourceContent = (content: string, filePath: string, state: ApplicationState): RegisteredComponent[] => {
  const moduleId = getModuleId(filePath);
  const result = parseModuleSource(content);

  if (!result.root) {
    console.warn(`Syntax error in ${filePath}`);

    result.diagnostics.forEach((diagnostic) => {
      console.log(diagnostic.message);
    })

    return [];
  }

  const module = loadModuleAST(result.root, filePath);
  
  return module.components.filter(component => !getComponentMetadataItem(component, ComponentMetadataName.PREVIEW) && !getComponentMetadataItem(component, ComponentMetadataName.INTERNAL)).map(({id, source}) => ({
    filePath,
    label: id,
    location: source.location,
    $id: id,
    screenshot: getComponentScreenshot(id, state),
    tagName: id,
    moduleId: moduleId,
  }));
};

export const getComponentScreenshot = (componentId: string, state: ApplicationState) => {
  const ss = state.componentScreenshots[state.componentScreenshots.length - 1];
  return ss && ss.clippings[componentId] && {
    uri: `http://localhost:${state.options.port}/screenshots/${md5(state.componentScreenshots[state.componentScreenshots.length - 1].uri)}`,
    clip: ss.clippings[componentId]
  };
};

export const getAllComponentsPreviewUrl = (state: ApplicationState) => {
  return `http://localhost:${state.options.port}/components/all/preview`;
};

export const getPreviewComponentEntries = (state: ApplicationState): AllComponentsPreviewEntry[] => {
  const allModules = getAllModules(state);

  const entries: AllComponentsPreviewEntry[] = [];

  let currentTop = 0;

  for (const module of allModules) {
    for (const component of module.components) {
      // TODO - check for preview meta

      const previewMeta = getComponentMetadataItem(component, ComponentMetadataName.PREVIEW);
      if (!previewMeta) continue;

      const bounds = { left: 0, top: currentTop, right: Number(previewMeta.params.width || DEFAULT_COMPONENT_PREVIEW_SIZE.width), bottom: currentTop + Number(previewMeta.params.height || DEFAULT_COMPONENT_PREVIEW_SIZE.height) };
      
      entries.push({
        bounds,
        targetComponentId: previewMeta.params.of,
        previewComponentId: component.id,
        relativeFilePath: getPublicSrcPath(module.uri, state)
      });

      currentTop = bounds.bottom;
    }
  }

  return entries;
};

export const getPublicSrcPath = (filePath: string, state: ApplicationState) => {
  return getPublicFilePath(filePath, state);
};

const getStorageFilePath = (workspaceId: string, state: ApplicationState) => {
  return path.join(TMP_DIRECTORY, "storage", workspaceId + ".json");
}

export const getStorageData = (key: string, state: ApplicationState) => {
  const filePath = getStorageFilePath(key, state);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return null;
}

export const setStorageData = (key: string, data: any, state: ApplicationState) => {
  const filePath = getStorageFilePath(key, state);
  if (!fs.existsSync(filePath)) {
    try {
      fsa.mkdirpSync(path.dirname(filePath));
    } catch(e) {

    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data));
};
