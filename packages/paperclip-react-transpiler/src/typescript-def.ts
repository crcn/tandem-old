// TODO - hydration func here, scan for all modules

import { upperFirst, camelCase } from "lodash";
import * as path from "path";
import { loadModuleAST, parseModuleSource, Module, Component, loadModuleDependencyGraph, DependencyGraph, Dependency, traversePCAST, PCElement, getStartTag, isTag } from "paperclip";
import { basename, relative } from "path";
import { ComponentTranspileInfo, getComponentTranspileInfo, getChildComponentInfo, getComponentClassName, getComponentFromModule, getComponentIdDependency, getUsedDependencies, getImportsInfo, ImportTranspileInfo, getImportFromDependency } from "./utils";

export const transpileToTypeScriptDefinition = (graph: DependencyGraph, uri: string) => {
  return transpileModule(graph[uri], graph);
};

const transpileModule = (entry: Dependency, graph: DependencyGraph) => {
  let content = ``;
  const { module } = entry;

  const baseName = getImportBaseName(module.uri);
  const allDeps = getUsedDependencies(entry, graph);
  const importTranspileInfo: ImportTranspileInfo[] = getImportsInfo(entry, allDeps);

  content += `import * as React from "react";\n`;

  importTranspileInfo.forEach(({ varName, relativePath }) => {
    content += `import * as ${varName} from "${relativePath}";\n`;
  });

  content += `\n`;
  
  content += `type Enhancer<T> = (BaseComponent: React.ComponentClass<T>) => React.ComponentClass<T>;\n\n`;

  const componentTranspileInfo = module.components.map(getComponentTranspileInfo);

  componentTranspileInfo.forEach((info) => {
    content += transpileComponentTypedInformation(info, importTranspileInfo, graph)
  });

  return content;
};

const getImportBaseName = (href: string) => upperFirst(camelCase(path.basename(href).split(".").shift()));

const transpileComponentTypedInformation = ({ className, component, propTypesName, enhancerName }: ComponentTranspileInfo, importTranspileInfo: ImportTranspileInfo[], graph: DependencyGraph) => {

  // props first
  let content = ``;
  const classPropsName = propTypesName;

  content += `` +
  `export type ${classPropsName} = {\n` +
    component.properties.map(({name}) => (
      `  ${name}: any;\n`
    )).join("") +
  `};\n\n`;

  content += `` +
  `export type ${enhancerName} = Enhancer<${propTypesName}>;\n\n`;

  // then hydrator
  const childComponentDependencies = getChildComponentInfo(component.template.content, graph);

  const childComponentClassesTypeName = `${className}ChildComponentClasses`;

  content += `type ${childComponentClassesTypeName} = {\n`;
  for (const childComponentTagName in childComponentDependencies) {
    const childComponentDependency = childComponentDependencies[childComponentTagName];
    const childComponent = getComponentFromModule(childComponentTagName, childComponentDependency.module);
    const childComponentInfo = getComponentTranspileInfo(childComponent);
    const childImport = getImportFromDependency(importTranspileInfo, childComponentDependency);
    let refPath = childImport ? `${childImport.varName}.${childComponentInfo.propTypesName}` : childComponentInfo.propTypesName;
    content += `  ${childComponentInfo.className}: React.ComponentClass<${refPath}>;\n`
  }
  content += `};\n\n`;

  // _all_ component classes here are required to notify engineers of any changes to PC components. This only
  // happens when the typed definition file is regenerated. Internally, Paperclip doesn't care if child components are provides, and will provide the default "dumb" version of components.
  content += `export function hydrate${className}(enhancer: Enhancer<${propTypesName}>, childComponentClasses: ${childComponentClassesTypeName}): React.ComponentClass<${propTypesName}>;\n\n`

  return content;
}

const transpileComponentPropTypes = ({ className, component }: ComponentTranspileInfo) => {
  let content = ``;
  const classPropsName = `${className}Props`;

  content += `` +
  `export type ${classPropsName} = {\n` +
    component.properties.map(({name}) => (
      `  ${name}: any;\n`
    )).join("") +
  `};\n\n`;

  return content;
};