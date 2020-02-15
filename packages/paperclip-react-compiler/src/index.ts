import {
  Node,
  getImports,
  NodeKind,
  Attribute,
  Reference,
  Statement,
  StatementKind,
  getAttributeStringValue,
  getMetaValue,
  Slot,
  AttributeValue,
  AttributeKind,
  AttributeValueKind,
  getImportIds,
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
import { camelCase } from "lodash";

export const compile = (ast: Node, filePath: string) => {
  let context = createTranslateContext(filePath, getImportIds(ast));
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
    context = translateFragment(visibleNodes, context);
  }

  return context;
};

const translateJSXNode = (node: Node, context: TranslateContext) => {
  if (node.kind === NodeKind.Fragment) {
    context = translateFragment(node.children, context);
  } else if (node.kind === NodeKind.Element) {
    const tag =
      context.importIds.indexOf(node.tagName) !== -1
        ? pascalCase(node.tagName)
        : JSON.stringify(node.tagName);
    context = startBlock(`React.createElement(${tag}, {`, context);
    for (const attr of node.attributes) {
      context = translateAttribute(attr, context);
    }
    context = endBlock(`}, `, context);
    context = translateChildren(node.children, context);
    context = addBuffer(`)`, context);
  } else if (node.kind === NodeKind.Text) {
    context = addLine(`${JSON.stringify(node.value)}`, context);
  } else if (node.kind === NodeKind.Slot) {
    context = translateSlot(node, context);
  } else {
    console.log("NOT");
  }

  return context;
};

const translateFragment = (children: Node[], context: TranslateContext) => {
  context = startBlock(`React.createElement(Fragment, `, context);
  context = translateChildren(children, context);
  context = endBlock(`)`, context);
  return context;
};

const translateChildren = (children: Node[], context: TranslateContext) => {
  return children.reduce((newContext, child) => {
    newContext = translateJSXNode(child, newContext);
    newContext = addBuffer(",", newContext);
    return newContext;
  }, context);
};

const translateAttribute = (attr: Attribute, context: TranslateContext) => {
  if (attr.kind === AttributeKind.KeyValueAttribute) {
    context = addBuffer(`${JSON.stringify(attr.name)}:`, context);
    context = translateAttributeValue(attr.value, context);
    context = addLine(`, `, context);
  } else if (attr.kind === AttributeKind.ShorthandAttribute) {
    const keyValue = (attr.reference as Reference).path[0];
    context = addBuffer(
      `${JSON.stringify(keyValue)}: props.${camelCase(keyValue)}`,
      context
    );
    context = addLine(`, `, context);
  }

  return context;
};

const translateAttributeValue = (
  value: AttributeValue,
  context: TranslateContext
) => {
  if (!value) {
    return addBuffer("true", context);
  }
  if (value.kind === AttributeValueKind.Slot) {
    return translateStatment((value as any) as Statement, context);
  } else if (value.kind === AttributeValueKind.String) {
    return addBuffer(JSON.stringify(value.value), context);
  }

  return context;
};

const translateSlot = (slot: Slot, context: TranslateContext) => {
  return translateStatment(slot.script, context);
};

const translateStatment = (statement: Statement, context: TranslateContext) => {
  if (statement.jsKind === StatementKind.Reference) {
    return addBuffer(`props.${statement.path.join(".")}`, context);
  } else if (statement.jsKind === StatementKind.Node) {
    return translateJSXNode((statement as any) as Node, context);
  }

  return context;
};

const getBaseComponentName = (root: Node) => {
  return `Base${getComponentName(root)}`;
};

const getComponentName = (root: Node) => {
  return getMetaValue("react-class", root) || "Component";
};
