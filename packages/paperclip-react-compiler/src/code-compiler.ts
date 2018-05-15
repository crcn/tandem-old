import { DependencyGraph, Dependency, getModuleInfo, Component, Module, TreeNode, PCSourceAttributeNames,  } from "tandem-front-end";
import { getAttribute, getTreeNodePath } from "tandem-front-end/lib/common/state/tree";
import { parseStyle, xmlToTreeNode } from "tandem-front-end/lib/common/utils";
import { camelCase } from "lodash";


type CompileContext = {
  entry: TreeNode;
  currentModule?: Module;
  currentComponent?: Component;
  varNameRefs: {
    [identifier: string]: string[]
  }
};

type VariableGenerator = {

};

// https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
const isVoidTag = (name) => /'(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)'/.test(name);

export const compilePaperclipToReact = (content: string) => {

  let entry;

  try {
    entry = JSON.parse(content);
  } catch(e) {

    // deprecated
    entry = xmlToTreeNode(content);
  }

  return compileModule({
    entry,
    varNameRefs: {}
  });
};

const compileModule = (context: CompileContext) => {
  const info = getModuleInfo(context.entry);
  context.currentModule = info;

  let buffer = `var React = require('react');`;
  buffer += `var __EMPTY_OBJECT = {};`;

  for (const ns in info.imports) {
    buffer += `var ${ns} = require('${info.imports[ns]}');`
  }

  for (const component of info.components) {
    context.currentComponent = component;
    buffer += compileComponent(context);
  }

  return buffer;
};

const compileComponent = (context: CompileContext) => {
  const componentName = getNodeClassName(context.currentComponent.source, context);
  const id = context.currentComponent.id;
  let buffer = `function __${id} (props) {`;
  buffer += `return (` + compileElement(context.currentComponent.template, true, context) + `);`;
  buffer += `}\n`;

  buffer += `exports.__${id} = __${id};`;

  if (componentName) {
    buffer += `var ${componentName} = __${id};`;
    buffer += `exports.${componentName} = ${componentName};`;
  }
  return buffer;
};

const compileElement = (node: TreeNode, isRoot: boolean,context: CompileContext) => {

  if (node.name === "text" && node.namespace == null) {
    return `'${getAttribute(node, "value")}'`;
  }

  const slotContainerName = getAttribute(node, PCSourceAttributeNames.CONTAINER);
  const tagNameStr = getNodeReactComponentRef(node, context)
  let buffer = `React.createElement(${getNodeReactComponentRef(node, context)}, ${compileElementAttributes(node, isRoot, context)}`;
  if (!isVoidTag(tagNameStr)) {
    buffer += `, ${compileElementChildren(node, context)})`;
  } else {
    buffer += `)`;
  }
  return buffer;
};

const compileElementAttributes = (node: TreeNode, isRoot: boolean, context: CompileContext) => {
  const nodeVarName = getNodeVarName(node, context);
  const propsRef = nodeVarName && `props.${getNodeVarName(node, context)}Props`;
  let buffer = `Object.assign({}, ${nodeVarName ? `(${propsRef} || __EMPTY_OBJECT),` : ""} {`;
  const style = getAttribute(node, "style");

  for (const child of node.children) {
    const slotName = getAttribute(child, PCSourceAttributeNames.SLOT);
    if (slotName) {
      buffer += `${slotName}: ${compileElement(child, false, context)},`
    }
  }

  if (style || nodeVarName) {
    buffer += `style: Object.assign({}, `;

    if (style) {
      buffer += JSON.stringify(style);
    }

    if (nodeVarName) {
      if (style) {
        buffer += `,`;
      }
      buffer += `${propsRef} && ${propsRef}.style || __EMPTY_OBJECT`;
    }

    buffer += `)`;
  }

  buffer += `}`;

  if (isRoot) {
    buffer += `, props`;
  }

  buffer += `)`;
  return buffer;
};

const compileElementChildren = (node: TreeNode, context: CompileContext) => {
  const internalContainerName = getAttribute(node, PCSourceAttributeNames.CONTAINER);
  const publicContainerName = getNodeVarName(node, context);

  const base = "[" + node.children.map(child => getAttribute(child, PCSourceAttributeNames.SLOT) ? null : compileElement(child, false, context)).filter(Boolean).join(",") + "]";

  if (internalContainerName) {
    return `props.${publicContainerName}Children || props.${internalContainerName} || ${base}`;
  }

  return base;
};

const defineNodeVarName = (ref: TreeNode,  context: CompileContext) => {
  let varName = getBaseNodeVarName(ref);
  let refs: string[];
  if (!(refs = context.varNameRefs[varName])) {
    refs = context.varNameRefs[varName] = [];
  }
  if (refs.indexOf(ref.id) !== -1) {
    throw new Error(`Cannot redeclare var`);
  }
  refs.push(ref.id);
  return getNodeVarName(ref, context);
};

const getBaseNodeVarName = (node: TreeNode) => camelCase(getAttribute(node, "label"));

const getNodeVarName = (ref: TreeNode, context: CompileContext) => {
  const baseVarName = getBaseNodeVarName(ref);
  const refs = context.varNameRefs[baseVarName];
  return refs ? refs.length === 1 ? baseVarName : `${baseVarName}${refs.indexOf(baseVarName) - 1}` : defineNodeVarName(ref, context);
};

const getNodeReactComponentRef = (ref: TreeNode, context: CompileContext) => {
  const isImport = Boolean(context.currentModule.imports[ref.namespace]);
  const internaComponent = context.currentModule.components.find(component => component.id === ref.name && ref.namespace == null);
  return isImport ? `${ref.namespace}.__${ref.name}` :  (internaComponent ? `__` + internaComponent.id : "'" + (getAttribute(ref, PCSourceAttributeNames.NATIVE_TYPE) || "div") + "'");
};

const getNodeClassName = (ref: TreeNode, context: CompileContext) => {
  const varName = getNodeVarName(ref, context);
  return varName.substr(0, 1).toUpperCase() + varName.substr(1);
};
