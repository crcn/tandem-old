/*

TODOS:

- [ ] transpile component prop types
- [ ] infer types based on how they are used in component
*/

import { upperFirst, camelCase } from "lodash";
import * as path from "path";
import { loadModuleAST, parseModuleSource, Module, Component, loadModuleDependencyGraph, DependencyGraph, Dependency, traversePCAST, PCElement, getStartTag, isTag, getChildComponentInfo, getComponentDependency, getUsedDependencies, PCExpression, PCExpressionType, PCFragment, PCSelfClosingElement, getElementModifiers, getPCElementModifier, BKExpressionType, getElementChildNodes, PCBlock, BKExpression, BKOperation, BKPropertyReference, BKVarReference, BKArray, BKBind, BKRepeat, BKIf, BKElse, BKElseIf, getElementAttributes, inferComponentPropTypes, InferredTypeKind } from "paperclip";
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

  let content = ``;
  const classPropsName = propTypesName;

  content += `` +
  `export type ${classPropsName} = ${transpileInferredTypeKinds(inferComponentPropTypes(component))}`;

  console.log(content);

  // props first

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

const transpileInferredTypeKinds = ([type, props]) => {
  if (type === InferredTypeKind.ANY) {
    return `any`;
  } else if (type & InferredTypeKind.OBJECT) { 
    let content = `{\n`;
    for (const key in props) {
      content += `${key}: ${transpileInferredTypeKinds(props[key])};\n`
    }
    content += `}`;
    return content;
  } else {
    let content = ``;
    const buffer = [];
    if (type & InferredTypeKind.STRING) {
      buffer.push("string");
    } else if (type & InferredTypeKind.NUMBER) {
      buffer.push("number");
    } else if (type & InferredTypeKind.BOOLEAN) {
      buffer.push("boolean");
    }
    return buffer.join(" | ");
  }
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
