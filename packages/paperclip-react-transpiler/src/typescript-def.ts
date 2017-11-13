// TODO - hydration func here, scan for all modules

import { loadModuleAST, parseModuleSource, Module, Component } from "paperclip";
import { upperFirst, camelCase } from "lodash";

export const transpileToTypeScriptDefinition = (source: string) => {
  const module = loadModuleAST(parseModuleSource(source));
  return transpileModule(module);
};

const transpileModule = (module: Module) => {
  let content = ``;

  const importNames = [];

  for (let i = 0, {length} = module.imports; i < length; i++) {
    const _import = module.imports[i];
    const _importName = "import_" + i;
    importNames.push(_importName);
    content += `import * as ${_importName} from "${_import.href}.d.ts"\n;`;
  }

  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(module.components[i]);
  }

  // TODO - add components in this file
  content += `export type HigherOrderComponentFactories = ${importNames.map(importName => `${importName}.HigherOrderComponentFactories`).join(" & ")}`;

  content += `export type HydratedComponents = ${importNames.map(importName => `${importName}.HydratedComponents`).join(" & ")}`;

  content += `export const hydrateComponents = (hocfs: HigherOrderComponentFactories) => HydratedComponents;`

  return content;
}

const transpileComponent = (component: Component) => {
  let content = ``;
  const className = upperFirst(camelCase(component.id));
  const classPropsName = `${className}Props`;

  content += `` +
  `type ${classPropsName} = {\n` +
    component.properties.map(({name}) => (
      `  ${name}: any;\n`
    )).join("") +
  `};\n\n` +

  `export class ${className} extends React.Component<${classPropsName}, any> {\n` +
    
  `}`;

  return content;
};