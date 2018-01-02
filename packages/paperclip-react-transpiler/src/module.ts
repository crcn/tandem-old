/*

TODOS:

- CSS piercing
- :host styles
- style components
*/

import { 
  loadModuleAST, 
  parseModuleSource, 
  Module, 
  inferNodeProps,
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
  hasPCStartTagAttribute,
  CSSSheet,
  getElementModifiers,
  getElementChildNodes,
  getUsedDependencies,
  ChildComponentInfo,
  getChildComponentInfo,
  getComponentDependency,
  getModuleComponent,
  ComponentModule
} from "paperclip";
import { compileScopedCSS } from "slim-dom";
import { camelCase, uniq } from "lodash";
import { getComponentTranspileInfo, ComponentTranspileInfo, getComponentFromModule, getImportsInfo, ImportTranspileInfo, getImportFromDependency, getTemplateSlotNames, getSlotName } from "./utils";

type ConditionTranspileInfo = {
  modifier: BKIf;
  varName: string;
};

export const transpileToReactComponents = (graph: DependencyGraph, entryUri: string) => {
  return transpileModule(graph[entryUri] as Dependency<ComponentModule>, graph);
};

const transpileModule = (entry: Dependency<ComponentModule>, graph: DependencyGraph) => {
  let content = ``;
  const { module } = entry;

  const componentInfo = module.components.map(getComponentTranspileInfo);

  content += `import * as React from "react";\n`;

  const allDeps = getUsedDependencies(entry, graph);
  const allImports: ImportTranspileInfo[] = getImportsInfo(entry, allDeps);

  const imported: any = {};

  allImports.forEach(({ varName, relativePath, dependency }) => {
    imported[dependency.module.uri] = true;
    content += `import * as ${varName} from "${relativePath}";\n`;
  });

  // include remaining imports that are explicitly defined
  // so that they can inject content into the page
  for (const importUri in entry.resolvedImportUris) {
    const dep = graph[entry.resolvedImportUris[importUri]];
    if (imported[dep.module.uri]) continue;
    content += `import "${importUri}";\n`;
  }

  content += `\n`;

  content += `const identity = value => value;\n\n`;
  content += `` +
  `const defaults = (initial, overrides) => {\n` +
  `  const result = Object.assign({}, initial);\n` +
  `  for (const key in overrides) {\n` +
  `    const value = overrides[key];\n` +
  `    if (value != null) {\n` +
  `      result[key] = value;\n` +
  `    }\n` +
  `  }\n` +
  `  return result;\n` +
  `};\n\n`;

  content += `` +
  `const __getDataProps = (props) => {\n` +
  `  const ret = {};\n` +
  `  for (const key in props) {\n` +
  `    if (props[key]) {\n` +
  `      ret["data-" + key] = true;\n` +
  `    }\n` + 
  `  }\n` +
  `  return ret;\n` +
  `};\n\n`;

  // TODO - inject styles into the document body.
  for (let i = 0, {length} = module.globalStyles; i < length; i++) {
    content += transpileStyle(module.globalStyles[i]);
  }

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

  const childComponentInfo = getChildComponentInfo(component.template, graph);
  const context: TranspileElementContext = {
    scopeClass: className,
    scope: component.template,
    elementFactoryName: "React.createElement",
    graph,
    imports,
    childComponentInfo
  };

  content += transpileStyle(component.style, context.scopeClass, component, childComponentInfo);

  content += `export const hydrate${className} = (enhance, hydratedChildComponentClasses = {}) => {\n`;

  if (Object.keys(childComponentInfo).length) {

    // provide defaults if child components are not provided in the hydration function. This 
    // here partially to ensure that newer updates don't bust application code. (i.e: if a designer adds a new view, they chould be able to compile the application without needing enhancement code)

    content += `  const baseComponentClasses = {\n`;

    for (const id in childComponentInfo) {
      const childDep = childComponentInfo[id];
      const info = getComponentTranspileInfo(getComponentFromModule(id, childDep.module));
      const _import = getImportFromDependency(imports, childDep);

      content += `    ${info.className}: ${_import ? _import.varName + "." : ""}Base${info.className},\n`;
    }
    
    content += `  };\n\n`;
    content += `  const childComponentClasses = defaults(baseComponentClasses, hydratedChildComponentClasses);`;
  }

  const componentPropertyNames = Object.keys(inferNodeProps(component.source).inference.properties);

  const hostContent = `${context.elementFactoryName}("span", Object.assign({ className: "${context.scopeClass}_host " + (props.className || "") }, __getDataProps(props)), ` + 
  `  ${component.template.childNodes.map(node => transpileNode(node, context)).filter(Boolean).join(",")}` +
  `)`;

  content += ``;

  const fnInner = wrapRenderFunctionInner(hostContent, component.template.childNodes, context);

  const deconstructPropNames = [
    ...componentPropertyNames,
    ...getTemplateSlotNames(component.template)
  ];

  content += `  return enhance((props) => {` +
  (deconstructPropNames.length ? `  const { ${deconstructPropNames.join(", ")} } = props;` : "") +
  `  ${fnInner}` +
  `});\n`;

  content += `};\n\n`;

  content += `let _Base${className};\n`;
  content += `export const Base${className} = (props) => (_Base${className} || (_Base${className} = hydrate${className}(identity)))(props);\n\n`;
  
  return content;
};

const transpileStyle = (style: PCElement, scopeClass?: string, component?: Component, childComponentInfo = {}) => {
  let aliases = {};
  for (const componentId in childComponentInfo) {
    const dep: Dependency<ComponentModule> = childComponentInfo[componentId];
    aliases[componentId] = "." + getComponentTranspileInfo(getModuleComponent(componentId, dep.module)).className;
  }

  let componentProps = component && Object.keys(inferNodeProps(component.source).inference.properties) || [];

  if (!style) {
    return "";
  }

  const sheet = style.childNodes[0] as any as CSSSheet;
  if (!sheet) return "";

  let content = `` + 
  `if (typeof document != "undefined") {\n` + 

  // enclose from colliding with other transpiled sheets
  `  (() => {\n` +
  `    const style = document.createElement("style");\n` +
  `    style.textContent = ${JSON.stringify(transpileCSSSheet(sheet, (selectorText, i) => {
        const scopedSelectorText = scopeClass ? compileScopedCSS(selectorText, scopeClass, aliases) : selectorText;
        return scopedSelectorText;
      }))}\n\n` +
  `    document.body.appendChild(style);\n` +
  `  })();\n` +
  `}\n\n`;

  return content;
}

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

const transpileNode = (node: PCExpression, context: TranspileElementContext) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return transpileTextNode(node as PCTextNode);
    case PCExpressionType.SELF_CLOSING_ELEMENT: return transpileUnslottedElement(node as PCSelfClosingElement, context);
    case PCExpressionType.ELEMENT: return transpileUnslottedElement(node as PCElement, context);
    case PCExpressionType.BLOCK: return transpileTextBlock(node as PCBlock);
  }
  return ``;
};


const transpileTextNode = (node: PCTextNode) => {
  const value = node.value;
  if (node.value.trim() === "") return null;
  return JSON.stringify(value);
};

const transpileUnslottedElement = (element: PCElement | PCSelfClosingElement, context: TranspileElementContext) => {
  return !hasPCStartTagAttribute(element, "slot") ? transpileModifiedElement(element, context) : null;
};

const transpileModifiedElement = (element: PCElement | PCSelfClosingElement, context: TranspileElementContext) => {
  return transpileElementModifiers(element, transpileElement(element, context), context);
};

const transpileElement = (element: PCElement | PCSelfClosingElement, context: TranspileElementContext) => {

  const startTag = getStartTag(element);

  const tagName = startTag.name;
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
  let content = `React.createElement(${tagContent}, ${transpileAttributes(element, context, Boolean(componentInfo))}, ` +
    getElementChildNodes(element).map(node => transpileNode(node, context)).filter(Boolean).join(", ") +
  `)`;

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
      _elseif = value as BKElseIf;
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

    content = newContent;
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

const ATTRIBUTE_MAP = {
  "class": "className",

  // events - https://developer.mozilla.org/en-US/docs/Web/Events

  // Mouse events
  "mouseenter": "onMouseEnter",
  "mouseover": "onMouseOver",
  "mousemove": "onMouseMove",
  "onmousedown": "onMouseDown",
  "onmouseup": "onMouseUp",
  "auxclick": "onAuxClick",
  "onclick": "onClick",
  "ondblclick": "onDoubleClick",
  "oncontextmenu": "onContextMenu",
  "onmousewheel": "onMouseWheel",
  "onmouseleave": "onMouseLeave",
  "onmouseout": "onMouseOut",
  "onselect": "onSelect",
  "pointerlockchange": "onPointerLockChange",
  "pointerlockerror": "onPointerLockError",

  // DND
  "ondragstart": "onDragStart",
  "ondrag": "onDrag",
  "ondragend": "onDragEnd",
  "ondragenter": "onDragEnter",
  "ondragover": "onDragOver",
  "ondragleave": "onDragLeave",
  "ondrop": "onDrop",

  // Keyboard
  "onkeydown": "onKeyDown",
  "onkeypfress": "onKeyPress",
  "onkeyup": "onKeyUp",

  // Form
  "onreset": "onReset",
  "onsubmit": "onSubmit",

  // Focus
  "onfocus": "onFocus",
  "onblur": "onBlur",
};


const transpileAttributes = (element: PCElement | PCSelfClosingElement, context: TranspileElementContext, isComponent?: boolean) => {

  const { attributes, modifiers } = getStartTag(element);

  let addedScopeStyle = false;
  let content = `{`;

  for (let i = 0, {length} = attributes; i < length; i++) {
    const attr = attributes[i];
    let name = ATTRIBUTE_MAP[attr.name.toLocaleLowerCase()] || attr.name;
    let value = attr.value ? transpileAttributeValue(attr.value) : "true";

    // skip slots
    if (name === "slot") {
      continue;
    }

    if (name === "className") {
      if (!isComponent) {
        value = `"${context.scopeClass} " + ${value}`;
        addedScopeStyle = true;
      }
    }
    content += `"${name}": ${value},`
  }

  if (!addedScopeStyle) {
    content += `"className": "${context.scopeClass}",`
  }

  // check immediate children for slots (slots cannot be nested), and add
  // those slots as attributes to this element.
  if (element.type === PCExpressionType.ELEMENT) {
    const slottedElements: PCElement[] = (element as PCElement).childNodes.filter((child) => isTag(child) && hasPCStartTagAttribute(child as PCElement, "slot")) as PCElement[];

    slottedElements.forEach((element) => {
      content += `"${getSlotName(getPCStartTagAttribute(element, "slot"))}": ${transpileModifiedElement(element, context)},`
    });
  }

  content += `}`;

  // check for spreads
  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i];
    if (modifier.value.type === BKExpressionType.BIND) {
      content = `Object.assign(${content}, ${transpileBlockExpression((modifier.value as BKBind).value)})`;
    }
  }

  return content;
};

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