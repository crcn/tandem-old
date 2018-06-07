// TODOS:
// - variants for props
// - variants for classes
// - tests**
// - imported deps
import {
  PCModule,
  PCVisibleNode,
  PCElement,
  PCComponent,
  PCComponentInstanceElement,
  PCSourceTagNames,
  PCBaseVisibleNode,
  getModuleComponents,
  PCNode,
  extendsComponent,
  getVisibleChildren,
  isVisibleNode,
  getOverrides,
  getPCNode,
  isComponent,
  PCDependency,
  DependencyGraph,
  getComponentRefIds,
  getPCNodeDependency
} from "paperclip";
import { repeat, camelCase, uniq, kebabCase } from "lodash";
import {
  Translate,
  KeyValue,
  flattenTreeNode,
  arraySplice,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  stripProtocol
} from "tandem-common";
import * as path from "path";

export const compilePaperclipModuleToReact = (
  entry: PCDependency,
  graph: DependencyGraph
) => {
  const context = { exports: {} };
  new Function("exports", translatePaperclipModuleToReact(entry, graph))(
    context
  );
  return context.exports;
};

type TranslateContext = {
  buffer: string;
  newLine?: boolean;
  currentScope?: string;
  entry: PCDependency;
  graph: DependencyGraph;
  scopedLabelRefs: {
    // scope ID
    [identifier: string]: {
      // var name
      [identifier: string]: string[];
    };
  };
  depth: number;
};

const INDENT = "  ";

export const translatePaperclipModuleToReact = (
  entry: PCDependency,
  graph: DependencyGraph
) =>
  translateModule(entry.content, {
    entry,
    buffer: "",
    graph,
    scopedLabelRefs: {},
    depth: 0
  }).buffer;

const translateModule = (module: PCModule, context: TranslateContext) => {
  context = addLine("\nvar React = require('react');", context);

  const imports = getComponentRefIds(module)
    .map((refId: string) => {
      return getPCNodeDependency(refId, context.graph);
    })
    .filter(dep => dep !== context.entry);

  // console.log(imports);

  if (imports.length) {
    context = addLine(`\nvar _imports = {};`, context);
    for (const { uri } of imports) {
      const relativePath = path.relative(
        stripProtocol(context.entry.uri),
        stripProtocol(uri)
      );
      context = addLine(
        `Object.assign(_imports, require("${relativePath}"));`,
        context
      );
    }
  }

  context = addOpenTag(`\nfunction _toNativeProps(props) {\n`, context);
  context = addLine(`var newProps = {};`, context);
  context = addOpenTag(`for (var key in props) {\n`, context);
  context = addLine(`var value = props[key];`, context);
  context = addLine(`var tov = typeof value;`, context);
  context = addOpenTag(
    `if((tov !== "object" && (tov !== "function" || key.substr(0, 2) === "on")) || key === "style") {\n`,
    context
  );
  context = addLine(`newProps[key] = value;`, context);
  context = addCloseTag(`}\n`, context);
  context = addCloseTag(`}\n`, context);
  context = addLine(`return newProps;`, context);
  context = addCloseTag(`}\n`, context);

  // for (const imp of module.imports) {
  //   context = addLine(`Object.assign(_imports, require("${imp}"));`, context);
  // }

  context = addLine("\nvar _EMPTY_OBJECT = {}", context);

  context = translateModuleStyles(module, context);

  context = module.children
    .filter(isComponent)
    .reduce(
      (context, component: PCComponent) =>
        translateContentNode(component, module, context),
      context
    );

  return context;
};

const translateModuleStyles = (module: PCModule, context: TranslateContext) => {
  context = addOpenTag(`\nif (typeof document !== "undefined") {\n`, context);
  const styleVarName = getInternalVarName(module) + "Style";

  context = addLine(
    `var ${styleVarName} = document.createElement("style");`,
    context
  );
  context = addLine(`${styleVarName}.type = "text/css";`, context);
  context = addOpenTag(
    `${styleVarName}.appendChild(document.createTextNode("" +\n`,
    context
  );
  context = module.children
    .filter(isComponent)
    .reduce((context, component: PCComponent) => {
      return translateComponentStyles(component as PCComponent, context);
    }, context);
  context = addCloseTag(`"")); \n\n`, context);
  context = addLine(`document.head.appendChild(${styleVarName});`, context);
  context = addCloseTag(`}\n`, context);
  return context;
};

const translateComponentStyles = (
  component: PCComponent,
  context: TranslateContext
) => {
  context = flattenTreeNode(component)
    .filter(isVisibleNode)
    .reduce((context, node: PCVisibleNode) => {
      if (Object.keys(node.style).length === 0) {
        return context;
      }
      context = addOpenTag(`" ._${node.id} {" + \n`, context);
      context = translateStyle(node, context);
      context = addCloseTag(`"}" + \n`, context);

      // TODO when variants are in data
      // context = getOverrides(node).filter(node => node.name === PCSourceTagNames.OVERRIDE_STYLE).reduce((context, styleOverride: ))

      return context;
    }, context);
  return context;
};

const translateStyle = (node: PCVisibleNode, context: TranslateContext) => {
  // TODO - add vendor prefix stuff here
  for (const key in node.style) {
    context = addLineItem(
      `" ${kebabCase(key)}: ${translateStyleValue(
        key,
        node.style[key]
      )};" + \n`,
      context
    );
  }

  return context;
};

const translateStyleValue = (key: string, value: any) => {
  if (typeof value === "number") {
    return value + "px";
  }
  return value;
};

const translateContentNode = (
  component: PCComponent,
  module: PCModule,
  context: TranslateContext
) => {
  context = setCurrentScope(module.id, context);
  context = addScopedLayerLabel(component, context);
  const internalVarName = getInternalVarName(component);
  const publicClassName = getPublicComponentClassName(component, context);
  context = addOpenTag(`\nfunction ${internalVarName}(_props) {\n`, context);
  context = addLineItem(`var props = _props;\n`, context);
  context = addLineItem(`props = Object.assign({}, props, `, context);
  context = translateElementFinalAttributes(component, context);
  context = addLineItem(");\n", context);
  context = setCurrentScope(component.id, context);
  context = flattenTreeNode(component)
    .filter(isVisibleNode)
    .reduce((context, node: PCVisibleNode | PCComponent) => {
      if (node === component) return context;
      context = addScopedLayerLabel(node, context);
      context = addLine("", context);

      const propsVarName = getNodePropsVarName(node, context);
      context = addLineItem(
        `var ${propsVarName} = props.${propsVarName} || _EMPTY_OBJECT;\n`,
        context
      );
      context = addLineItem(
        `${propsVarName} = Object.assign({}, ${propsVarName}, `,
        context
      );
      context = translateElementFinalAttributes(node, context);
      context = addLineItem(");\n", context);

      return context;
    }, context);
  context = addLine("", context);
  context = addLineItem("return ", context);
  context = translateElement(component, context);
  context = addLine(";", context);
  context = addCloseTag(`}`, context);

  // necessary or other imported modules
  context = addLine(
    `\n\nexports.${internalVarName} = ${internalVarName};`,
    context
  );
  context = addLine(
    `exports.${publicClassName} = ${internalVarName};`,
    context
  );
  return context;
};

const getNodePropsVarName = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  return node.name === PCSourceTagNames.COMPONENT
    ? `props`
    : `${getPublicLayerVarName(node, context)}Props`;
};

const translateVisibleNode = (
  node: PCVisibleNode,
  context: TranslateContext
) => {
  switch (node.name) {
    case PCSourceTagNames.TEXT: {
      if (Object.keys(node.style).length && false) {
        // context = addLineItem(`React.createElement("span", `, context);
        // context = translateElementAttributes(node, context);
        // context = addLine
        // return context;
        // return addLineItem(`React.createElement("span", { className: ${getClassProp(node, context)} }, ${JSON.stringify(node.value)})`, context);
      } else {
        return addLineItem(JSON.stringify(node.value), context);
      }
    }
    case PCSourceTagNames.COMPONENT_INSTANCE:
    case PCSourceTagNames.ELEMENT: {
      return translateElement(node, context);
    }
  }

  return context;
};

const getNodeProp = (
  name: string,
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  return `${getNodePropsVarName(node, context)}.${name}`;
};

const translateElement = (
  elementOrComponent: PCComponent | PCComponentInstanceElement | PCElement,
  context: TranslateContext
) => {
  const visibleChildren = getVisibleChildren(elementOrComponent);
  const hasVisibleChildren = visibleChildren.length > 0;
  context = addOpenTag(`React.createElement(`, context, hasVisibleChildren);
  context = addLineItem(
    `${
      extendsComponent(elementOrComponent)
        ? (getNestedTreeNodeById(elementOrComponent.is, context.entry.content)
            ? ""
            : "_imports.") +
          `_` +
          elementOrComponent.is
        : '"' + elementOrComponent.is + '"'
    }, `,
    context
  );
  context = addLineItem(
    `_toNativeProps(${getNodePropsVarName(elementOrComponent, context)})`,
    context
  );
  context = addLineItem(
    `, ${getNodePropsVarName(elementOrComponent, context)}.children`,
    context
  );
  if (visibleChildren.length) {
    context = addLineItem(` || [\n`, context);
    context = visibleChildren.reduce((context, node, index, array) => {
      context = translateVisibleNode(node, context);
      if (index < array.length - 1) {
        context = addBuffer(",", context);
      }
      return addLine("", context);
    }, context);
  } else if (hasVisibleChildren) {
    context = addLineItem("\n", context);
  }
  context = addCloseTag(
    hasVisibleChildren ? "])" : ")",
    context,
    hasVisibleChildren
  );
  return context;
};

const translateElementFinalAttributes = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  context = addOpenTag("{\n", context);
  context = addLine(`key: "${node.id}",`, context);
  context = addLine(
    `className: "_${node.id} " + (${getNodeProp(
      "className",
      node,
      context
    )} || "")`,
    context
  );
  context = addCloseTag("}", context);
  return context;
};

const getPublicComponentClassName = (
  component: PCComponent,
  context: TranslateContext
) => {
  const varName = getPublicLayerVarName(component, context);
  return varName.substr(0, 1).toUpperCase() + varName.substr(1);
};

const getPublicLayerVarName = (
  layer: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  const i = getScopedLayerLabelIndex(layer, context);
  return camelCase(layer.label || "child") + (i === 0 ? "" : i);
};

const getScopedLayerLabelIndex = (
  { label, id }: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  return context.scopedLabelRefs[context.currentScope][label].indexOf(id);
};

const getInternalVarName = (node: PCNode) => "_" + node.id;

const addBuffer = (buffer: string = "", context: TranslateContext) => ({
  ...context,
  buffer: (context.buffer || "") + buffer
});

const addLineItem = (buffer: string = "", context: TranslateContext) =>
  addBuffer((context.newLine ? repeat(INDENT, context.depth) : "") + buffer, {
    ...context,
    newLine: buffer.lastIndexOf("\n") === buffer.length - 1
  });
const addLine = (buffer: string = "", context: TranslateContext) =>
  addLineItem(buffer + "\n", context);

const addOpenTag = (
  buffer: string,
  context: TranslateContext,
  indent: boolean = true
) => ({
  ...addLineItem(buffer, context),
  depth: indent ? context.depth + 1 : context.depth
});

const addCloseTag = (
  buffer: string,
  context: TranslateContext,
  indent: boolean = true
) =>
  addLineItem(buffer, {
    ...context,
    depth: indent ? context.depth - 1 : context.depth
  });

const setCurrentScope = (currentScope: string, context: TranslateContext) => ({
  ...context,
  currentScope
});

const addScopedLayerLabel = (
  { label, id }: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  if (context.scopedLabelRefs[id]) {
    return context;
  }

  const scope = context.currentScope;

  if (!context.scopedLabelRefs[scope]) {
    context = {
      ...context,
      scopedLabelRefs: {
        [context.currentScope]: EMPTY_OBJECT
      }
    };
  }

  return {
    ...context,
    scopedLabelRefs: {
      [scope]: {
        ...context.scopedLabelRefs[scope],
        [label]: uniq([
          ...(context.scopedLabelRefs[scope][label] || EMPTY_ARRAY),
          id
        ])
      }
    }
  };
};
