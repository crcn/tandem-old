import {
  Node,
  getImports,
  NodeKind,
  getAttributeStringValue,
  getMetaValue,
  getVisibleChildNodes
} from "paperclip";
import {
  createTranslateContext,
  TranslateContext,
  addLine,
  startBlock,
  endBlock,
  addBuffer
} from "./translate-utils";
import { pascalCase } from "./utils";

export const compile = (ast: Node, filePath: string) => {
  let context = createTranslateContext(filePath);
  context = translateRoot(ast, context);
  return context.buffer;
};

const translateRoot = (ast: Node, context: TranslateContext) => {
  context = translateImports(ast, context);
  context = translateComponent(ast, context);
  return context;
};

const translateImports = (ast: Node, context: TranslateContext) => {
  context = addLine(`const React = require("react");`, context);

  const imports = getImports(ast);
  for (const imp of imports) {
    const id = getAttributeStringValue("id", imp);
    const src = getAttributeStringValue("src", imp);

    if (!id || !src) {
      continue;
    }

    context = addLine(`const ${pascalCase(id)} = require("${src}");`, context);
  }
  context = addLine("", context);
  return context;
};

const translateComponent = (root: Node, context: TranslateContext) => {
  const baseComponentName = getBaseComponentName(root);
  const enhancedComponentName = getComponentName(root);

  context = startBlock(`let ${baseComponentName} = function(props) {`, context);
  context = addBuffer(`return `, context);
  context = translateJSXRoot(root, context);
  // context = addLine(`;`, context);
  context = endBlock(`}`, context);

  context = addLine("\n", context);

  // TODO - check if logic controller
  if (/* has logic controller */ false) {
  } else {
    context = addLine(
      `let ${enhancedComponentName} = ${baseComponentName};`,
      context
    );
    context = addLine(`module.exports = ${enhancedComponentName};`, context);
  }

  return context;
};

const translateJSXRoot = (node: Node, context: TranslateContext) => {
  const visibleNodes = getVisibleChildNodes(node);

  if (visibleNodes.length === 1) {
    return translateJSXNode(visibleNodes[0], context);
  } else {
  }

  return context;
};

const translateJSXNode = (node: Node, context: TranslateContext) => {
  if (node.kind === NodeKind.Element) {
    context = addLine(`React.createElement("${node.tagName}", {})`, context);
  } else if (node.kind === NodeKind.Text) {
    context = addLine(`${JSON.stringify(node.value)}`, context);
  } else if (node.kind === NodeKind.Slot) {
    context = addLine(`${JSON.stringify(node.value)}`, context);
  }

  return context;
};

const getBaseComponentName = (root: Node) => {
  return `Base${getComponentName(root)}`;
};

const getComponentName = (root: Node) => {
  return getMetaValue("react-class", root) || "Component";
};
