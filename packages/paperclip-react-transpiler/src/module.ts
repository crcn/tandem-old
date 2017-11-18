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
  PCBlock,
  DependencyGraph,
  Dependency
} from "paperclip";
import { getComponentTranspileInfo, ComponentTranspileInfo, getChildComponentInfo, ChildComponentInfo, getComponentIdDependency, getComponentFromModule, getUsedDependencies, getImportsInfo, ImportTranspileInfo, getImportFromDependency } from "./utils";


export const transpileToReactComponents = (graph: DependencyGraph, entryUri: string) => {
  return transpileModule(graph[entryUri], graph);
};

const transpileModule = (entry: Dependency, graph: DependencyGraph) => {
  let content = ``;
  const { module } = entry;

  const componentInfo = module.components.map(getComponentTranspileInfo);

  content += `import * as React from "react";\n`;

  const allDeps = getUsedDependencies(entry, graph);
  const allImports: ImportTranspileInfo[] = getImportsInfo(entry, allDeps);

  allImports.forEach(({ varName, relativePath}) => {
    content += `import * as ${varName} from "${relativePath}";\n`;
  });
  content += `\n`;

  // TODO - inject styles into the document body.
  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(getComponentTranspileInfo(module.components[i]), graph, allImports);
  }

  return content;
};

export type TranspileElementContext = {
  scopeClass?: string;
  graph: DependencyGraph;
  imports: ImportTranspileInfo[];
  childComponentInfo: ChildComponentInfo;
}

const transpileComponent = ({ component, className }: ComponentTranspileInfo, graph: DependencyGraph, imports: ImportTranspileInfo[]) => {
  let content = ``;

  const childComponentInfo = getChildComponentInfo(component.template.content, graph);
  const context: TranspileElementContext = {
    scopeClass: className,
    graph,
    imports,
    childComponentInfo
  };

  content += `exports.hydrate${className} = (enhance, childComponentClasses = {}) => {\n`;

  if (Object.keys(childComponentInfo).length) {

    // provide defaults if child components are not provided in the hydration function. This 
    // here partially to ensure that newer updates don't bust application code. (i.e: if a designer adds a new view, they chould be able to compile the application without needing enhancement code)
    content += `  childComponentClasses = Object.assign({}, childComponentClasses, {\n`;
    for (const id in childComponentInfo) {
      const childDep = childComponentInfo[id];
      const info = getComponentTranspileInfo(getComponentFromModule(id, childDep.module));
      const _import = getImportFromDependency(imports, childDep);

      content += `    ${info.className}: ${(_import ? _import.varName + "." : "") + info.className},\n`;
    }

    content += `  });\n\n`
  }

  content += `` +
  `  return enhance(class ${className} extends React.Component {\n` +
  `    render() {\n` +

        (
          component.properties.length ? 
        `      const { ${component.properties.map(({name}) => name).join(", ")} } = this.props;\n` : ``
        ) +

  `      return ${transpileFragment(component.template.content, context)}` +
  `    }\n` +
  `  })` +
  `};\n\n`;
  
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

  const tagName = element.startTag.name;
  const componentInfo = context.childComponentInfo[tagName];

  let tagContent: string;

  if (componentInfo) {
    const childDep = componentInfo;
    const component = getComponentFromModule(tagName, childDep.module);
    const componentDepInfo = getComponentTranspileInfo(component);
    tagContent = `childComponentClasses.${componentDepInfo.className}`;
  } else {
    tagContent = `"${tagName}"`;
  }

  // TODO - need to check if node is component
  let content = `React.createElement(${tagContent}, ${transpileAttributes(element.startTag, context, Boolean(componentInfo))}, [` +
    element.childNodes.map(node => transpileNode(node, context)).filter(Boolean).join(", ") +
  `])`;

  return content;
};

const transpileElementModifiers = (element: PCElement, content: string) => {
  return content;
}

const transpileAttributes = ({ attributes }: PCStartTag, context: TranspileElementContext, isComponent?: boolean) => {
  
  // TODO - need to check if node is component
  let content = `{`;
    for (let i = 0, {length} = attributes; i < length; i++) {
      const attr = attributes[i];
      let name = attr.name;
      let value = transpileAttributeValue(attr.value);

      // TODO - need to 
      if (name === "class") {
        name = "className";
        // TODO - possibly skip className altogether to conform to scoped styled.

        // Child component cannot share the same scope -- this conforms to the paperclip syntax,
        // along with web standards. 
        if (!isComponent) {
          value = `"${context.scopeClass} " + ${value}`;
        }
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