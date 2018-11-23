import * as fs from "fs";
import * as fsa from "fs-extra";
import * as path from "path";
import {
  loadFSDependencyGraphSync,
  PCConfig,
  getAllVariableRefMap,
  getGlobalVariables,
  getPCNode,
  PCVariable,
  DependencyGraph,
  replacePCNode,
  getAllPCComponents,
  getPCNodeDependency
} from "paperclip";
import { identity } from "lodash";
import {
  translatePaperclipModuleToHTMLRenderers,
  stringifyVirtualNode
} from "./html-compiler";
import { bundleDependencyGraph, evaluateBundle } from "./bundler";
import { KeyValue } from "tandem-common";
import * as crypto from "crypto";

export type TranslatePageConfig = {
  fileName: string;
  component: {
    name?: string;
    id?: string;
    filePath: string;
  };
  variables: {
    [identifier: string]: string;
  };
};

export type TranslateHTMLConfig = {
  outputDirectory?: string;
  project: PCConfig;
  pages: TranslatePageConfig[];
};

export const translatePaperclipModuleToStaticHTML = (
  config: TranslateHTMLConfig,
  cwd: string
) => {
  for (const page of config.pages) {
    translatePage(page, config, cwd);
  }
};

const translatePage = (
  page: TranslatePageConfig,
  config: TranslateHTMLConfig,
  cwd: string
) => {
  const outputFile = config.outputDirectory
    ? resolvePath(path.join(config.outputDirectory, page.fileName), cwd)
    : resolvePath(page.fileName, cwd);
  const outputDir = path.dirname(outputFile);
  console.log(`Creating ${outputFile}`);
  let graph = loadFSDependencyGraphSync(config.project, cwd, identity);
  graph = injectVaraibles(page.variables, graph);

  const component = page.component.id
    ? getPCNode(page.component.id, graph)
    : page.component.name
      ? getAllPCComponents(graph).find(
          component => component.label === page.component.name
        )
      : null;

  if (!component) {
    console.error(
      `Could not find component : ${JSON.stringify(page.component)}.`
    );
    return;
  }

  const componentDep = getPCNodeDependency(component.id, graph);

  const bundle = bundleDependencyGraph(graph);

  let externalDepOutputFilePaths = {};

  const evaluatedModule = evaluateBundle(componentDep.uri, bundle, uri => {
    if (externalDepOutputFilePaths[uri]) {
      return externalDepOutputFilePaths[uri];
    }

    const outputPath = path.join(
      outputDir,
      crypto
        .createHash("md5")
        .update(uri)
        .digest("hex") + path.extname(uri)
    );
    return path.relative(
      outputDir,
      (externalDepOutputFilePaths[uri] = outputPath)
    );
  });

  let vnode = evaluatedModule[`_${component.id}`]({})({});

  vnode = {
    id: "html",
    name: "html",
    attributes: {},
    children: [
      {
        id: "head",
        name: "head",
        attributes: {},
        children: []
      },
      {
        id: "body",
        name: "body",
        attributes: {},
        children: [vnode]
      }
    ]
  };

  const html = stringifyVirtualNode(vnode);

  try {
    fsa.mkdirpSync(path.dirname(outputFile));
  } catch (e) {}

  fs.writeFileSync(outputFile, html);

  for (const sourceFilePath in externalDepOutputFilePaths) {
    fsa.copyFileSync(
      sourceFilePath,
      externalDepOutputFilePaths[sourceFilePath]
    );
  }
};

const injectVaraibles = (
  injections: KeyValue<string>,
  graph: DependencyGraph
) => {
  const variables = getGlobalVariables(graph);
  for (const labelOrId in injections) {
    let variable = (getPCNode(labelOrId, graph) ||
      variables.find(variable => variable.label === labelOrId)) as PCVariable;

    if (!variable) {
      console.error(`Variable ${labelOrId} does not exist.`);
      continue;
    }

    variable = {
      ...variable,
      value: injections[labelOrId]
    };

    graph = replacePCNode(variable, variable, graph);
  }

  return graph;
};

function resolvePath(relPath, cwd) {
  return relPath.charAt(0) === "/" ? relPath : path.join(cwd, relPath);
}
