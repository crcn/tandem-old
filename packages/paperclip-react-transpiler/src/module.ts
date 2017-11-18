/*

TODOS:

- scoped styles
- spread operators
- slots specified as parameters

*/

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
  Dependency,
  traversePCAST,
  isTag,
  getStartTag,
  getPCElementModifier,
  BKExpressionType,
  BKIf,
  BKElseIf,
  BKRepeat,
  BKElse,
  getPCParent,
  getPCStartTagAttribute,
  hasPCStartTagAttribute
} from "paperclip";
import { camelCase, uniq } from "lodash";
import { getComponentTranspileInfo, ComponentTranspileInfo, getChildComponentInfo, ChildComponentInfo, getComponentIdDependency, getComponentFromModule, getUsedDependencies, getImportsInfo, ImportTranspileInfo, getImportFromDependency, getTemplateSlotNames, getSlotName } from "./utils";

type ConditionTranspileInfo = {
  modifier: BKIf;
  varName: string;
};

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

  content += `const identity = value => value;\n\n`;

  // TODO - inject styles into the document body.
  for (let i = 0, {length} = module.components; i < length; i++) {
    content += transpileComponent(getComponentTranspileInfo(module.components[i]), graph, allImports);
  }

  return content;
};

export type TranspileElementContext = {
  scopeClass?: string;
  scope: PCElement;
  graph: DependencyGraph;
  elementFactoryName: string;
  imports: ImportTranspileInfo[];
  childComponentInfo: ChildComponentInfo;
}

const transpileComponent = ({ component, className }: ComponentTranspileInfo, graph: DependencyGraph, imports: ImportTranspileInfo[]) => {
  let content = ``;

  const childComponentInfo = getChildComponentInfo(component.template.childNodes, graph);
  const context: TranspileElementContext = {
    scopeClass: className,
    scope: component.template,
    elementFactoryName: "React.createElement",
    graph,
    imports,
    childComponentInfo
  };

  content += `export const hydrate${className} = (enhance, hydratedChildComponentClasses = {}) => {\n`;

  if (Object.keys(childComponentInfo).length) {

    // provide defaults if child components are not provided in the hydration function. This 
    // here partially to ensure that newer updates don't bust application code. (i.e: if a designer adds a new view, they chould be able to compile the application without needing enhancement code)
    content += `  const childComponentClasses = Object.assign({}, hydratedChildComponentClasses, {\n`;
    for (const id in childComponentInfo) {
      const childDep = childComponentInfo[id];
      const info = getComponentTranspileInfo(getComponentFromModule(id, childDep.module));
      const _import = getImportFromDependency(imports, childDep);

      content += `    ${info.className}: ${_import ? _import.varName : "exports"}.Base${info.className},\n`;
    }

    content += `  });\n\n`
  }

  const hostContent = `${context.elementFactoryName}("span", { className: "${context.scopeClass} host" }, [` + 
  `  ${component.template.childNodes.map(node => transpileNode(node, context)).filter(Boolean).join(",")}` +
  `])`;

  content += ``;

  const fnInner = wrapRenderFunctionInner(hostContent, component.template.childNodes, context);

  const deconstructPropNames = [
    ...component.properties.map(({name}) => name),
    ...getTemplateSlotNames(component.template)
  ];

  content += `  return enhance((props) => {` +
  `  const { ${deconstructPropNames.join(", ")} } = props;` +
  `  ${fnInner}` +
  `});\n`;

  content += `};\n\n`;

  content += `let _Base${className};\n`;
  content += `export const Base${className} = (props) => (_Base${className} || (_Base${className} = hydrate${className}(identity)))(props);\n\n`;
  
  return content;
};

const conditionMemo = Symbol();

const getConditionTranspileInfo = (element: PCExpression): ConditionTranspileInfo[] => {
  if (element[conditionMemo]) return element[conditionMemo];
  const info: ConditionTranspileInfo[] = [];
  
  let i = 0;
  traversePCAST(element, child => {
    if (isTag(child) && getPCElementModifier(child as PCElement, BKExpressionType.IF)) {
      const modifier = getPCElementModifier(child as PCElement, BKExpressionType.IF).value as BKIf;
      info.push({
        varName: `conditionPassed_` + (++i),
        modifier
      });
    }
  });
 

  return element[conditionMemo] = info;
};

const wrapRenderFunction = (childContent: string, childNodes: PCExpression[], context: TranspileElementContext, deconstructScopeNames: string[] = []) => {
  return `(props = {}) => {${wrapRenderFunctionInner(childContent, childNodes, context, deconstructScopeNames)}}`;
};  

const wrapRenderFunctionInner = (childContent: string, childNodes: PCExpression[], context: TranspileElementContext, deconstructScopeNames: string[] = []) => {
  
    const conditionInfo = getConditionTranspileInfo(context.scope);
  
    let content = ``;
  
    conditionInfo.forEach((info) => {
      content += `let ${info.varName};`
    });
  
    content += 
    `return ${childContent};`;
  
  
    return content;
  };  

const transpileFragment = (nodes: PCExpression[], context: TranspileElementContext) => {
  let content = `` +
  `${context.elementFactoryName}("span", { className: "${context.scopeClass} host" }, [\n` + 
  `  ${nodes.map(node => transpileNode(node, context)).filter(Boolean).join(",")}\n` +
  `])\n`;

  return content;
};

const transpileNode = (node: PCExpression, context: TranspileElementContext) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return transpileTextNode(node as PCTextNode);
    case PCExpressionType.ELEMENT: return transpileUnslottedElement(node as PCElement, context);
    case PCExpressionType.BLOCK: return transpileTextBlock(node as PCBlock);
  }
  return ``;
};


const transpileTextNode = (node: PCTextNode) => {
  const value = node.value.trim();
  if (value === "") return null;
  return JSON.stringify(value);
};

const transpileUnslottedElement = (element: PCElement, context: TranspileElementContext) => {
  return !hasPCStartTagAttribute(element, "slot") ? transpileModifiedElement(element, context) : null;
};

const transpileModifiedElement = (element: PCElement, context: TranspileElementContext) => {
  return transpileElementModifiers(element, transpileElement(element, context), context);
};

const transpileElement = (element: PCElement, context: TranspileElementContext) => {

  const tagName = element.startTag.name;
  const componentInfo = context.childComponentInfo[tagName];

  if (tagName === "slot") {
    const slotName = getPCStartTagAttribute(element, "name");
    return `${ slotName ? getSlotName(slotName) : "children" }`;
  }

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
  let content = `React.createElement(${tagContent}, ${transpileAttributes(element, context, Boolean(componentInfo))}, [` +
    element.childNodes.map(node => transpileNode(node, context)).filter(Boolean).join(", ") +
  `])`;

  return content;
};

const transpileElementModifiers = (element: PCElement | PCSelfClosingElement, content: string, context: TranspileElementContext) => {

  const startTag = getStartTag(element);

  let newContent = content;

  let _if: BKIf;
  let _else: BKElse;
  let _elseif: BKElseIf;
  let _repeat: BKRepeat;

  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const {value} = startTag.modifiers[i];
    if (value.type == BKExpressionType.IF) {
      _if = value as BKIf;
    } else if (value.type === BKExpressionType.ELSEIF) {
      _else = value as BKElseIf;
    } else if (value.type === BKExpressionType.ELSE) {
      _else = value as BKElse;
    } else if (value.type === BKExpressionType.REPEAT) {
      _repeat = value as BKRepeat;
    }
  }

  if (_repeat) {
    newContent = `${transpileBlockExpression(_repeat.each)}.map((${transpileBlockExpression(_repeat.asValue)}, ${_repeat.asKey ? transpileBlockExpression(_repeat.asKey) : "$$i"}) => {`;

    newContent += wrapRenderFunctionInner(content, [element], {
      ...context,
      scope: element as PCElement
    })

    newContent += "})";
  } 

  if (_if || _elseif || _else) {
    const conditionInfo = getConditionTranspileInfo(context.scope);
    const siblings = getPCParent(context.scope, element).childNodes;
    const index = siblings.indexOf(element);
    let _mainIf: BKIf;
    for (let i = index + 1; i--;) {
      const sibling = siblings[i];
      if (!isTag(sibling)) continue;
      const ifModifierBlock = getPCElementModifier(sibling as PCElement, BKExpressionType.IF);
      if (ifModifierBlock) {
        _mainIf = ifModifierBlock.value as BKIf;
        break;
      }
    }

    if (!_mainIf) {
      throw new Error(`Conditional elseif / else specified without a higher [[if]] block`);
    }

    const conditionalVarName = conditionInfo.find(({modifier}) => modifier === _mainIf).varName;

    newContent = `!${conditionalVarName} && (${_else ? "true" : transpileBlockExpression((_if || _elseif).condition)}) && (${conditionalVarName} = true) ? ${content} : null`;
  }

  return newContent;
}


const transpileAttributes = (element: PCElement | PCSelfClosingElement, context: TranspileElementContext, isComponent?: boolean) => {

  const { attributes } = getStartTag(element);

  
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

  if (element.type === PCExpressionType.ELEMENT) {
    const slottedElements: PCElement[] = (element as PCElement).childNodes.filter((child) => isTag(child) && hasPCStartTagAttribute(child as PCElement, "slot")) as PCElement[];

    slottedElements.forEach((element) => {
      content += `"${getSlotName(getPCStartTagAttribute(element, "slot"))}": ${transpileModifiedElement(element, context)},`
    });
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