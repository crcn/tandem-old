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
  isVisibleNode,
  getImportIds,
  isVisibleElement,
  getVisibleChildNodes
} from "paperclip";
import {
  createTranslateContext,
  TranslateContext,
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
  context = addBuffer(`const React = require("react");\n`, context);

  const imports = getImports(ast);
  for (const imp of imports) {
    const id = getAttributeStringValue("id", imp);
    const src = getAttributeStringValue("src", imp);

    if (!id || !src) {
      continue;
    }

    context = addBuffer(
      `const ${pascalCase(id)} = require("${src}");\n`,
      context
    );
  }
  context = addBuffer("\n", context);
  return context;
};

const translateComponent = (root: Node, context: TranslateContext) => {
  const baseComponentName = getBaseComponentName(root);
  const enhancedComponentName = getComponentName(root);

  context = startBlock(
    addBuffer(`let ${baseComponentName} = function(props) {\n`, context)
  );
  context = addBuffer(`return `, context);
  context = translateJSXRoot(root, context);
  context = endBlock(context);
  context = addBuffer(`}\n`, context);

  context = addBuffer("\n\n", context);

  // TODO - check if logic controller
  if (/* has logic controller */ false) {
  } else {
    context = addBuffer(
      `let ${enhancedComponentName} = ${baseComponentName};\n`,
      context
    );
    context = addBuffer(
      `module.exports = ${enhancedComponentName};\n`,
      context
    );
  }

  return context;
};

const translateJSXRoot = (node: Node, context: TranslateContext) => {
  return translateJSXNode(node, context);
  // const visibleNodes = getVisibleChildNodes(node);

  // if (visibleNodes.length === 1) {
  //   return translateJSXNode(visibleNodes[0], context);
  // } else {
  //   context = translateFragment(visibleNodes, context);
  // }

  // return context;
};

const translateJSXNode = (node: Node, context: TranslateContext) => {
  if (node.kind === NodeKind.Fragment) {
    context = translateFragment(node.children, context);
  } else if (node.kind === NodeKind.Element && isVisibleElement(node)) {
    const tag =
      context.importIds.indexOf(node.tagName) !== -1
        ? pascalCase(node.tagName)
        : JSON.stringify(node.tagName);

    context = addBuffer(`React.createElement(${tag}, {`, context);
    context = addBuffer("\n", context);
    context = startBlock(context);
    context = startBlock(context);
    context = addBuffer(`"data-pc-id": "OK"\n`, context);
    for (const attr of node.attributes) {
      context = translateAttribute(attr, context);
    }
    context = endBlock(context);
    context = addBuffer(`}`, context);
    context = endBlock(context);
    if (node.children.length) {
      context = addBuffer(`,\n`, context);
      context = translateChildren(node.children, context);
    }
    context = addBuffer(`)`, context);
  } else if (node.kind === NodeKind.Text) {
    context = addBuffer(`${JSON.stringify(node.value)}`, context);
  } else if (node.kind === NodeKind.Slot) {
    context = translateSlot(node, context);
  }

  return context;
};

const translateFragment = (children: Node[], context: TranslateContext) => {
  context = addBuffer(`React.createElement(Fragment,\n`, context);
  context = translateChildren(children, context);
  context = addBuffer(`)\n`, context);
  return context;
};

const translateChildren = (children: Node[], context: TranslateContext) => {
  context = startBlock(context);

  context = children
    .filter(isVisibleNode)
    .reduce((newContext, child, index, children) => {
      newContext = translateJSXNode(child, newContext);
      if (index < children.length - 1) {
        newContext = addBuffer(",\n", newContext);
      }
      return newContext;
    }, context);
  context = endBlock(context);

  if (children.length) {
    context = addBuffer("\n", context);
  }
  return context;
};

const translateAttribute = (attr: Attribute, context: TranslateContext) => {
  if (attr.kind === AttributeKind.KeyValueAttribute) {
    context = addBuffer(`${JSON.stringify(attr.name)}: `, context);
    context = translateAttributeValue(attr.value, context);
    context = addBuffer(`,\n`, context);
  } else if (attr.kind === AttributeKind.ShorthandAttribute) {
    const keyValue = (attr.reference as Reference).path[0];
    context = addBuffer(
      `${JSON.stringify(keyValue)}: props.${camelCase(keyValue)}`,
      context
    );
    context = addBuffer(`,\n`, context);
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
  if (value.attrKind === AttributeValueKind.Slot) {
    return translateStatment((value as any) as Statement, context);
  } else if (value.attrKind === AttributeValueKind.String) {
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
