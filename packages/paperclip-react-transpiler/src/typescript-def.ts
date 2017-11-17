// TODO - hydration func here, scan for all modules

import { upperFirst, camelCase } from "lodash";
import * as path from "path";
import { loadModuleAST, parseModuleSource, Module, Component } from "paperclip";
import { basename } from "path";
import { ComponentTranspileInfo, getComponentTranspileInfo } from "./utils";

export const transpileToTypeScriptDefinition = (source: string, uri: string) => {
  const module = loadModuleAST(parseModuleSource(source), uri);
  return transpileModule(module);
};

type ImportTranspileInfo = {
  baseName: string;
  varName: string;
};

const transpileModule = (module: Module) => {
  let content = ``;

  const baseName = getImportBaseName(module.uri);
  const importTranspileInfo: ImportTranspileInfo[] = [];

  content += `import * as React from "react";\n`;

  module.imports.forEach((_import, i) => {
    const varName = "imports_" + i;
    importTranspileInfo.push({
      varName, 
      baseName: getImportBaseName(_import.href)
    });
    content += `import * as ${varName} from "${_import.href}";\n`;
  });

  content += `\n`;

  const componentTranspileInfo = module.components.map(getComponentTranspileInfo);

  componentTranspileInfo.forEach((info) => {
    content += transpileComponentPropTypes(info);
  });

  content += `type Enhancer<T> = (BaseComponent: React.ComponentClass<T>) => React.ComponentClass<T>;\n\n`;

  componentTranspileInfo.forEach(({enhancerTypeName, propTypesName}) => {
    content += `export type ${enhancerTypeName} = Enhancer<${propTypesName}>;\n`;
  });

  content += `export type ${baseName}Enhancers = {\n`
  
  componentTranspileInfo.forEach(({ enhancerName, enhancerTypeName }) => {
    content += `  ${enhancerName}: ${enhancerTypeName};\n`;
  });

  content += `} ${importTranspileInfo.map(({varName, baseName}) => `& ${varName}.${baseName}Enhancers`).join(" ")};\n\n`;

  content += `export type Enhanced${baseName}Components = {\n`
  
  componentTranspileInfo.forEach(({className, propTypesName}) => {
    content += `  ${className}: React.ComponentClass<${propTypesName}>;\n`;
  });
  content += `} ${importTranspileInfo.map(({varName, baseName}) => `& ${varName}.Enhanced${baseName}Components`).join(" ")};\n\n`;

  content += `export function enhanceComponents(enhancers: ${baseName}Enhancers): Enhanced${baseName}Components;`

  return content;
};

const getImportBaseName = (href: string) => upperFirst(camelCase(path.basename(href).split(".").shift()));

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