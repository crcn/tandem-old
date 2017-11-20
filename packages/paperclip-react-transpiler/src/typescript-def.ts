/*

TODOS:

- [ ] transpile component prop types
- [ ] infer types based on how they are used in component
*/

import { upperFirst, camelCase } from "lodash";
import * as path from "path";
import { loadModuleAST, parseModuleSource, Module, Component, loadModuleDependencyGraph, DependencyGraph, Dependency, traversePCAST, PCElement, getStartTag, isTag, getChildComponentInfo, getComponentDependency, getUsedDependencies, PCExpression, PCExpressionType, PCFragment } from "paperclip";
import { basename, relative } from "path";
import { ComponentTranspileInfo, getComponentTranspileInfo, getComponentClassName, getComponentFromModule, getImportsInfo, ImportTranspileInfo, getImportFromDependency, getTemplateSlotNames } from "./utils";

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
  
  content += `type Enhancer<TInner, TOuter> = (BaseComponent: React.ComponentClass<TInner>) => React.ComponentClass<TOuter>;\n\n`;

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

    getTemplateSlotNames(component.template).map((slotName) => (
      `  ${slotName}: any;\n`
    )).join("") +
  `};\n\n`;

  // then hydrator
  const childComponentDependencies = getChildComponentInfo(component.template, graph);

  const childComponentClassesTypeName = `${className}ChildComponentClasses`;

  content += `type ${childComponentClassesTypeName} = {\n`;
  for (const childComponentTagName in childComponentDependencies) {
    const childComponentDependency = childComponentDependencies[childComponentTagName];
    const childComponent = getComponentFromModule(childComponentTagName, childComponentDependency.module);
    const childComponentInfo = getComponentTranspileInfo(childComponent);
    const childImport = getImportFromDependency(importTranspileInfo, childComponentDependency);
    let refPath = childImport ? `${childImport.varName}.${childComponentInfo.propTypesName}` : childComponentInfo.propTypesName;
    content += `  ${childComponentInfo.className}: React.StatelessComponent<${refPath}> | React.ComponentClass<${refPath}>;\n`
  }
  content += `};\n\n`;

  // _all_ component classes here are required to notify engineers of any changes to PC components. This only
  // happens when the typed definition file is regenerated. Internally, Paperclip doesn't care if child components are provides, and will provide the default "dumb" version of components.
  content += `export function hydrate${className}<TOuter>(enhancer: Enhancer<${propTypesName}, TOuter>, childComponentClasses: ${childComponentClassesTypeName}): React.ComponentClass<${propTypesName}>;\n\n`

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

enum InferredType {
  OBJECT,
  ARRAY,
  STRING,
  BOOLEAN,
  NUMBER
};

type InferredDef = {
  type: InferredType;

  // inferred based on || found in AST. To implement in the future
  optional?: boolean;
}

type InferredObject = {
  properties: {
    [property: string]: InferredDef
  }
} & InferredDef;

type InferredArray = {
  items: InferredDef
} & InferredDef;

type InferredTypeDefinition = {

}

/**
 * analyzes the component, and infers types based on how data is used, not by the properties defined. This is to ensure that HOCs have more room to define different types that still work with the component.
 */

const inferComponentTypes = (component: Component) => getInferredNodeTypes(component.template);

const getInferredNodeTypes = (node: PCExpression) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return null;
    // case PCExpressionType.FRAGMENT: return getInferredChildNodeTypes((node as PCFragment).childNodes);
  }
  return null;
}

const getInferredElementTypes = (element: PCElement) => {
  const properties = {};

  const startTag = getStartTag(element);

  for (const modifier of getStartTag(element).modifiers)  {

  }
  
};


const getInferredElementAttributeTypes = (element: PCElement) => {
  const properties = {};

  const startTag = getStartTag(element);

  for (const modifier of getStartTag(element).modifiers)  {

  }
  
};

const getInferredChildTypes = (childNodes: PCExpression[]) => {
  const properties = {};

  for (const child of childNodes) {
    const typeInfo = getInferredNodeTypes(child);
    if (!typeInfo) {
      continue;
    }
  }

  return {
    type: InferredType.OBJECT,
    properties
  }
};