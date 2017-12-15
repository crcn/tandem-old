/*

TODOS:

- [ ] transpile component prop types
- [ ] type-loader
*/

import { upperFirst, camelCase, repeat } from "lodash";
import * as path from "path";
import { loadModuleAST, Module, Component, loadModuleDependencyGraph, DependencyGraph, Dependency, traversePCAST, PCElement, getStartTag, isTag, getChildComponentInfo, getComponentDependency, getUsedDependencies, PCExpression, PCExpressionType, PCFragment, PCSelfClosingElement, getElementModifiers, getPCElementModifier, BKExpressionType, getElementChildNodes, PCBlock, BKExpression, BKOperation, BKPropertyReference, BKVarReference, BKArray, BKBind, BKRepeat, BKIf, BKElse, BKElseIf, getElementAttributes, getPCASTElementsByTagName, inferNodeProps, Inference, InferenceType } from "paperclip";
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

const transpileComponentTypedInformation = ({ className, component, propTypesName, enhancerName, basePropTypesName }: ComponentTranspileInfo, importTranspileInfo: ImportTranspileInfo[], graph: DependencyGraph) => {

  let content = ``;
  const classPropsName = propTypesName;

  const { inference } = inferNodeProps(component.source);

  content += `` + 
  `export type ${basePropTypesName} = {` +
    `${getTemplateSlotNames(component.template).map((slotName) => (
      `  ${slotName}: any;\n`
    )).join("")}` +
  `};\n\n`;
  
  content += `` +
  `export type ${classPropsName} = ${transpileInferredProps(inference)} & ${basePropTypesName};\n\n`;

  const childComponentDependencies = getChildComponentInfo(component.template, graph);  


  const propTypeMap: any = {};

  for (const childComponentTagName in childComponentDependencies) {

    const componentElements = getPCASTElementsByTagName(component.template, childComponentTagName);

    const childComponentDependency = childComponentDependencies[childComponentTagName];
    const childComponent = getComponentFromModule(childComponentTagName, childComponentDependency.module);

    const childComponentInfo = getComponentTranspileInfo(childComponent);
    const childImport = getImportFromDependency(importTranspileInfo, childComponentDependency);
    let basePropsRef = childImport ? `${childImport.varName}.${childComponentInfo.basePropTypesName}` : `${childComponentInfo.basePropTypesName}`;

    let allEntries = [];

    let childPropTypes: string = "{\n";
    
    for (const element of componentElements) {
      const attrs = getElementAttributes(element);
      for (const attr of attrs) {
        if (attr.name === "key") {
          continue;
        }

        // TODO - get inference types based on value
        childPropTypes += `${attr.name}: any;\n`
      }

      if (getPCElementModifier(element, BKExpressionType.BIND)) {
        childPropTypes += "[identifier: string]: any;\n";
      }
    }

    childPropTypes += "}";

    // const childTable = setSymbolTableEntries(allEntries, symbolTable());

    // const childPropTypes = transpileInferredProps(childTable.context);

    const childTypeName = `${className}Child${childComponentInfo.propTypesName}`;

    propTypeMap[childComponentInfo.className] = childTypeName;

    content += `type ${childTypeName} = ${childPropTypes} & ${basePropsRef};\n\n`;
    childComponentInfo.propTypesName;
    // content += `  ${childComponentInfo.className}: React.StatelessComponent<${refPath}> | React.ComponentClass<${refPath}>;\n`
  }

  const childComponentGettersTypeName = `${className}ChildComponentClasses`;
  
  content += `type ${childComponentGettersTypeName} = {\n`;
  for (const childComponentClassName in propTypeMap) {
    const propTypesName = propTypeMap[childComponentClassName];
    content += `  ${childComponentClassName}: React.StatelessComponent<${propTypesName}> | React.ComponentClass<${propTypesName}>;\n`
  }
  content += `};\n\n`;

  // _all_ component classes here are required to notify engineers of any changes to PC components. This only
  // happens when the typed definition file is regenerated. Internally, Paperclip doesn't care if child components are provides, and will provide the default "dumb" version of components.
  content += `export function hydrate${className}<TOuter>(enhancer: Enhancer<${propTypesName}, TOuter>, childComponentClasses: ${childComponentGettersTypeName}): React.ComponentClass<TOuter>;\n\n`

  return content;
}

const transpileInferredProps = ({ type, properties }: Inference, path: string[] = []) => {
  if (type === InferenceType.ANY) {
    return `any`;
  }  else if (properties.$$each) { 
    let content = transpileInferredProps(properties.$$each, [...path, "$$each"]);

    const buffer = [];

    if (type & InferenceType.ARRAY) {
      buffer.push(`Array<${content}>`);
    }

    if (type & InferenceType.OBJECT) {
      buffer.push(`{ [identifier: string]:${content} }`);
    }

    return buffer.join(" | ");
  } else if (type & InferenceType.OBJECT) { 
    let content = `{\n`;
    for (const key in properties) {
      content += repeat(" ", path.length * 2) + `${key}: ${transpileInferredProps(properties[key], [...path, key])};\n`
    }

    // allow for any props for now. Will eventuall want to request for template 
    content += repeat(" ", (path.length) * 2) + "[identifier: string]: any;\n"

    content += repeat(" ", (path.length - 1) * 2) + `}`;
    return content;
  } else {
    let content = ``;
    const buffer = [];

    if (type & InferenceType.STRING) {
      buffer.push("string");
    } 

    if (type & InferenceType.NUMBER) {
      buffer.push("number");
    }

    if (type & InferenceType.BOOLEAN) {
      buffer.push("boolean");
    }

    return buffer.join(" | ");
  }
}
