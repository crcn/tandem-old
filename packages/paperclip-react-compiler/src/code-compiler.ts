// TODOS:
// - variants for props
// - variants for classes
// - tests**
import {
  PCModule,
  PCFrame,
  PCVisibleNode,
  PCElement,
  PCComponent,
  PCComponentInstanceElement,
  PCSourceTagNames,
  isComponentFrame,
  PCBaseVisibleNode,
  getModuleComponents,
  PCNode,
  extendsComponent,
  getVisibleChildren,
  isVisibleNode,
  createPCFrame,
  getOverrides
} from "paperclip";
import { repeat, camelCase, uniq, kebabCase } from "lodash";
import {
  Translate,
  KeyValue,
  flattenTreeNode,
  arraySplice,
  EMPTY_OBJECT,
  EMPTY_ARRAY
} from "tandem-common";

export const compilePaperclipModuleToReact = (module: PCModule) => {
  const context = { exports: {} };
  new Function("exports", translatePaperclipModuleToReact(module))(context);
  return context.exports;
};

type TranslateContext = {
  buffer: string;
  newLine?: boolean;
  currentScope?: string;
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

export const translatePaperclipModuleToReact = (module: PCModule) =>
  translateModule(module, {
    buffer: "",
    scopedLabelRefs: {},
    depth: 0
  }).buffer;

const translateModule = (module: PCModule, context: TranslateContext) => {
  context = addLine("\nvar React = require('react');", context);
  context = addLine("\nvar _EMPTY_OBJECT = {}", context);

  context = translateModuleStyles(module, context);

  context = module.children
    .filter(isComponentFrame)
    .reduce(
      (context, frame: PCFrame) =>
        translateComponentFrame(frame, module, context),
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
  context = addOpenTag(`${styleVarName}.textContent = "" +\n`, context);
  context = module.children
    .filter(isComponentFrame)
    .reduce((context, frame: PCFrame) => {
      return translateComponentStyles(
        frame.children[0] as PCComponent,
        context
      );
    }, context);
  context = addCloseTag(`""; \n\n`, context);
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
      context = addOpenTag(`" .${node.id} {" + \n`, context);
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

const translateComponentFrame = (
  frame: PCFrame,
  module: PCModule,
  context: TranslateContext
) => {
  const [component] = frame.children as PCComponent[];
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
        ? `_` + elementOrComponent.is
        : '"' + elementOrComponent.is + '"'
    }, `,
    context
  );
  context = addLineItem(
    getNodePropsVarName(elementOrComponent, context),
    context
  );
  if (visibleChildren.length) {
    context = addLineItem(",\n", context);
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
  context = addCloseTag(`)`, context, hasVisibleChildren);
  return context;
};

const translateElementFinalAttributes = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  context = addOpenTag("{\n", context);
  context = addLine(
    `className: "${node.id} " + (${getNodeProp(
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
