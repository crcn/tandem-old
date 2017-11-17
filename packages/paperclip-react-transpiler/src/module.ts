// TODO - conditionals, repeats, hydrating HOC, scoped styles (use ideas from https://github.com/css-modules/css-modules) - may need to attach scope to each rendered element, export css for SS rendering, 

/*

* {

}

.ScopedComponent {

}

.ScopedComponent.div {

}

.ScopedComponent.div > .ScopedComponent.span {

}

.AnotherComponent.host {

}

class ScopedComponent extends React.Component {
  render() {
    return <div className="ScopedComponent host">
      <span className="ScopedComponent">

        <!-- ignored style_1 never reaches following component --->
        <AnotherComponent />
      </span>
    </div>
  }
}

*/

import { 
  loadModuleAST, 
  parseModuleSource, 
  Module, 
  Component, 
  PCExpression,
  PCStringBlock,
  PCExpressionType,
  transpileCSSSheet,
  PCStartTag,
  PCString,
  PCElement,
  BKBind,
  transpileBlockExpression,
  PCSelfClosingElement,
  PCTextNode,
  PCBlock
} from "paperclip";
import { getComponentTranspileInfo, ComponentTranspileInfo } from "./utils";

export const transpileToReactComponents = (source: string, uri: string) => {
  const module = loadModuleAST(parseModuleSource(source), uri);
  return transpileModule(module);
};

const transpileModule = (module: Module) => {
  let content = ``;

  const componentInfo = module.components.map(getComponentTranspileInfo);

  content += `const React = require("react");\n\n`;

  content += `const baseComponentFactories = {};`;

  // link imports are global, so they need to be exported as well
  for (let i = 0, {length} = module.imports; i < length; i++) {
    const varName = `import_${i}`;
    content += `const ${varName} = require("${module.imports[i].href}");\n`;
    content += `Object.assign(baseComponentFactories, ${varName}.baseComponentFactories);\n`
  }

  // TODO
  // for (let i = 0, {length} = module.globalStyles; i < length; i++) {
  //   const _import = module.imports[i];
  //   content += `Object.assign(exports, require("${_import.href}"));`
  // }
  
  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(getComponentTranspileInfo(module.components[i]));
  }

  content += `const identity = BaseComponent => BaseComponent;\n`;
  content += `exports.baseComponentFactories = baseComponentFactories;\n`;
  content += `exports.enhanceComponents = (enhancers) => {\n` +
  `  const enhancedComponents = {};\n` +
  `  for (const componentId in baseComponentFactories) {\n` + 
  `    enhancedComponents[componentId] = baseComponentFactories[componentId](enhancedComponents)(enhancers[componentId] || identity);\n` +
  `   }\n` +
  `  return enhancedComponents;\n`+
  `};\n`;

  return content;
};

export type TranspileElementContext = {
  scopeClass?: string;
}

const transpileComponent = ({ component, className }: ComponentTranspileInfo) => {
  let content = ``;

  const context: TranspileElementContext = {
    scopeClass: className
  };

  content += `\n` +
  `baseComponentFactories.${className} = components => enhanceComponent => enhanceComponent(class ${className} extends React.Component {\n` +
  `  render() {\n` +

      (
        component.properties.length ? 
      `    const { ${component.properties.map(({name}) => name).join(", ")}} = this.props;\n` : ``
      ) +

  `    return ${transpileFragment(component.template.content, context)}` +
  `  }\n` +
  `})\n\n`;
  
  return content;
};


const transpileFragment = (nodes: PCExpression[], context: TranspileElementContext) => {
  let content = `` +
  `React.createElement("span", { className: "${context.scopeClass} host" }, [\n` + 
  `  ${nodes.map(node => transpileNode(node, context)).filter(Boolean).join(",")}\n` +
  `])\n`;

  return content;
};

const transpileNode = (node: PCExpression, context: TranspileElementContext) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return transpileTextNode(node as PCTextNode);
    case PCExpressionType.ELEMENT: return transpileElementModifiers(node as PCElement, transpileElement(node as PCElement, context));
    case PCExpressionType.BLOCK: return transpileTextBlock(node as PCBlock);
  }
  return ``;
};


const transpileTextNode = (node: PCTextNode) => {
  const value = node.value.trim();
  if (value === "") return null;
  return JSON.stringify(value);
}
const transpileElement = (element: PCElement, context: TranspileElementContext) => {

  // TODO - need to check if node is component
  let content = `React.createElement("${element.startTag.name}", ${transpileAttributes(element.startTag, context)}, [` +
    element.childNodes.map(node => transpileNode(node, context)).filter(Boolean).join(", ") +
  `])`;
  return content;
};

const transpileElementModifiers = (element: PCElement, content: string) => {
  return content;
}

const transpileAttributes = ({ attributes }: PCStartTag, context: TranspileElementContext) => {
  
  // TODO - need to check if node is component
  let content = `{`;
    for (let i = 0, {length} = attributes; i < length; i++) {
      const attr = attributes[i];
      let name = attr.name;
      let value = transpileAttributeValue(attr.value);

      // TODO - need to 
      if (name === "class") {
        name = "className";
        value = `"${context.scopeClass} " + ${value}`;
      }
      content += `"${name}": ${value},`
    }
  content += `}`;

  return content;
}
const transpileAttributeValue = (value: PCExpression) => {
  
  if (value.type === PCExpressionType.STRING_BLOCK) {
    return `(` + (value as PCStringBlock).values.map(transpileAttributeValue).join(" + ") + `)`;
  } else if (value.type === PCExpressionType.STRING) {
    return JSON.stringify((value as PCString).value);
  } else if (value.type === PCExpressionType.BLOCK) {
    return `(` + transpileBlockExpression(((value as PCBlock).value as BKBind).value) + `)`;
  }

  throw new Error(`Cannot transpile attribute value type ${value.type}`);
}

const transpileTextBlock = (node: PCBlock) => {
  return transpileBlockExpression((node.value as BKBind).value);
};