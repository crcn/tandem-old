import { 
  loadModuleAST, 
  parseModuleSource, 
  Module, 
  Component, 
  PCExpression,
  PCExpressionType,
  PCElement,
  BKBind,
  transpileBlockExpression,
  PCSelfClosingElement,
  PCTextNode,
  PCBlock
} from "paperclip";
import { camelCase, upperFirst } from "lodash";

export type TranspileOptions = {
}

export const transpile = (source: string) => {
  const module = loadModuleAST(parseModuleSource(source));
  return transpileModule(module);
};

const transpileModule = (module: Module) => {
  let content = ``;

  content += `const React = require("react");\n\n`;

  // link imports are global, so they need to be exported as well
  for (let i = 0, {length} = module.imports; i < length; i++) {
    content += `Object.assign(exports, require("${module.imports[i]}"));\n`
  }

  // TODO
  // for (let i = 0, {length} = module.globalStyles; i < length; i++) {
  //   const _import = module.imports[i];
  //   content += `Object.assign(exports, require("${_import.href}"));`
  // }
  
  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(module.components[i]);
  }

  return content;
};


const transpileComponent = (component: Component) => {
  let content = ``;
  const className = upperFirst(camelCase(component.id));

  content += `` +
  `class ${className} extends React.Component {\n` +
  `  render() {\n` +

      (
        component.properties.length ? 
      `    const { ${component.properties.map(({name}) => name).join(", ")}} = this.props;\n` : ``
      ) +

  `    return ${transpileFragment(component.template.content)}` +
  `  }\n` +
  `}`;
  
  return content;
};


const transpileFragment = (nodes: PCExpression[]) => {
  let content = `` +
  `<span>\n` + 
  `  ${nodes.map(transpileNode).join("\n")}\n` +
  `</span>\n`;

  return content;
};

const transpileNode = (node: PCExpression) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return transpileTextNode(node as PCTextNode);
    case PCExpressionType.BLOCK: return transpileTextBlock(node as PCBlock);
  }
  return ``;
};


const transpileTextNode = (node: PCTextNode) => `${node.value}`;
const transpileTextBlock = (node: PCBlock) => {
  return `{${transpileBlockExpression((node.value as BKBind).value)}}`;
};