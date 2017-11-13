import { loadModuleAST, parseModuleSource, Module, Component } from "paperclip";
import { upperFirst, camelCase } from "lodash";

export const transpileToTypeScriptDefinition = (source: string) => {
  const module = loadModuleAST(parseModuleSource(source));
  return transpileModule(module);
};

const transpileModule = (module: Module) => {
  let content = ``;

  for (let i = 0, {length} = module.imports; i < length; i++) {
    const _import = module.imports[i];
    content += `export * from "${_import.href}.d.ts"\n;`;
  }

  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(module.components[i]);
  }

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