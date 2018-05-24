import {
  DependencyGraph,
  Dependency,
  PCModuleNode,
  PCComponentNode,
  getModuleComponents,
  getComponentTemplate,
  PCVisibleNode,
  PCSourceTagNames,
  PCRectangleNode
} from "paperclip";
import {
  getAttribute,
  getTreeNodePath,
  TreeNode,
  TreeNodeAttributes,
  DEFAULT_NAMESPACE,
  parseStyle,
  xmlToTreeNode,
  EMPTY_OBJECT,
  RecursivePartial
} from "tandem-common";
import { camelCase, merge } from "lodash";

type CompileContext = {
  entry: PCModuleNode;
  currentModule?: PCModuleNode;
  currentComponent?: PCComponentNode;
  varNameRefs: {
    [identifier: string]: string[];
  };
};

type VariableGenerator = {};

// https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
const isVoidTag = name =>
  /'(area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)'/.test(
    name
  );

export const compilePaperclipToReact = (content: string) => {
  let entry;

  try {
    entry = JSON.parse(content);
  } catch (e) {
    // deprecated
    entry = xmlToTreeNode(content);
  }

  return compileModule({
    entry,
    varNameRefs: {}
  });
};

const compileModule = (context: CompileContext) => {
  const info = context.entry;
  context.currentModule = info;

  let buffer = `var React = require('react');`;
  buffer += `var __EMPTY_OBJECT = {};`;

  for (const ns in info.attributes.xmlns || EMPTY_OBJECT) {
    buffer += `var ${ns} = require('${info.attributes.xmlns[ns]}');`;
  }

  for (const component of getModuleComponents(info)) {
    context.currentComponent = component;
    buffer += compileComponent(context);
  }

  return buffer;
};

const compileComponent = (context: CompileContext) => {
  const componentName = getNodeClassName(context.currentComponent, context);
  const id = context.currentComponent.attributes.undefined.id;
  let buffer = `function __${id} (props) {`;
  buffer +=
    `return (` +
    compileElement(
      getComponentTemplate(context.currentComponent),
      {
        [DEFAULT_NAMESPACE]: {
          style: getAttribute(context.currentComponent, "style")
        }
      },
      true,
      context
    ) +
    `);`;
  buffer += `}\n`;

  buffer += `exports.__${id} = __${id};`;

  if (componentName) {
    buffer += `var ${componentName} = __${id};`;
    buffer += `exports.${componentName} = ${componentName};`;
  }
  return buffer;
};

const compileElement = (
  node: PCVisibleNode,
  attributes: RecursivePartial<TreeNodeAttributes>,
  isRoot: boolean,
  context: CompileContext
) => {
  node = {
    ...node,
    attributes: merge({}, node.attributes, attributes)
  };

  if (node.name === PCSourceTagNames.TEXT && node.namespace == null) {
    return `'${getAttribute(node, "value")}'`;
  }

  const slotContainerName = (node as PCRectangleNode).attributes.undefined
    .container;
  const tagNameStr = getNodeReactComponentRef(node, context);
  let buffer = `React.createElement(${getNodeReactComponentRef(
    node,
    context
  )}, ${compileElementAttributes(node, isRoot, context)}`;
  if (!isVoidTag(tagNameStr)) {
    buffer += `, ${compileElementChildren(node, context)})`;
  } else {
    buffer += `)`;
  }
  return buffer;
};

const compileElementAttributes = (
  node: PCVisibleNode,
  isRoot: boolean,
  context: CompileContext
) => {
  const nodeVarName = getNodeVarName(node, context);
  const propsRef = nodeVarName && `props.${getNodeVarName(node, context)}Props`;
  let buffer = `Object.assign({}, ${
    nodeVarName ? `(${propsRef} || __EMPTY_OBJECT),` : ""
  } {`;
  const style = getAttribute(node, "style");

  for (const child of node.children as PCVisibleNode[]) {
    const slotName = child.attributes.undefined.slot;
    if (slotName) {
      buffer += `${slotName}: ${compileElement(child, {}, false, context)},`;
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

const compileElementChildren = (
  node: PCRectangleNode,
  context: CompileContext
) => {
  const internalContainerName = node.attributes.undefined.container;
  const publicContainerName = getNodeVarName(node, context);

  const base =
    "[" +
    node.children
      .map(
        child =>
          child.attributes.undefined.slot
            ? null
            : compileElement(child as PCVisibleNode, {}, false, context)
      )
      .filter(Boolean)
      .join(",") +
    "]";

  if (internalContainerName) {
    return `props.${publicContainerName}Children || props.${internalContainerName} || ${base}`;
  }

  return base;
};

const defineNodeVarName = (ref: PCVisibleNode, context: CompileContext) => {
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

const getBaseNodeVarName = (node: PCVisibleNode) =>
  camelCase(String(node.attributes.undefined.label));

const getNodeVarName = (ref: PCVisibleNode, context: CompileContext) => {
  const baseVarName = getBaseNodeVarName(ref);
  const refs = context.varNameRefs[baseVarName];
  return refs
    ? refs.length === 1
      ? baseVarName
      : `${baseVarName}${refs.indexOf(baseVarName) - 1}`
    : defineNodeVarName(ref, context);
};

const getNodeReactComponentRef = (
  ref: PCRectangleNode,
  context: CompileContext
) => {
  const isImport = Boolean(
    (context.currentModule.attributes.xmlns || EMPTY_OBJECT)[ref.namespace]
  );

  const internaComponent = getModuleComponents(context.currentModule).find(
    component =>
      component.attributes.undefined.id === ref.name && ref.namespace == null
  );
  return isImport
    ? `${ref.namespace}.__${ref.name}`
    : internaComponent
      ? `__` + internaComponent.attributes.undefined.id
      : "'" + (ref.attributes.undefined.nativeType || "div") + "'";
};

const getNodeClassName = (ref: TreeNode<any, any>, context: CompileContext) => {
  const varName = getNodeVarName(ref, context);
  return varName.substr(0, 1).toUpperCase() + varName.substr(1);
};
