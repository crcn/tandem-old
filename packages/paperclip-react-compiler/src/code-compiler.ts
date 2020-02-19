import {
  Node,
  getImports,
  NodeKind,
  Attribute,
  Reference,
  Statement,
  StatementKind,
  getAttributeStringValue,
  getVisibleChildNodes,
  Slot,
  AttributeValue,
  AttributeKind,
  AttributeValueKind,
  isVisibleNode,
  getImportIds,
  Element,
  getAttribute,
  getParts,
  isVisibleElement,
  stringifyCSSSheet
} from "paperclip";
import {
  createTranslateContext,
  TranslateContext,
  startBlock,
  endBlock,
  addBuffer
} from "./translate-utils";
import {
  pascalCase,
  Options,
  getBaseComponentName,
  getComponentName,
  getPartClassName
} from "./utils";
import { camelCase } from "lodash";

export const compile = (
  { ast, sheet }: { ast: Node; sheet: any },
  filePath: string,
  options: Options = {}
) => {
  let context = createTranslateContext(filePath, getImportIds(ast), options);
  context = translateRoot(ast, sheet, context);
  return context.buffer;
};

const translateRoot = (ast: Node, sheet: any, context: TranslateContext) => {
  context = translateImports(ast, context);
  context = translateStyleSheet(sheet, context);
  context = translateUtils(ast, context);
  context = translateParts(ast, context);
  context = translateMainTemplate(ast, context);
  return context;
};

const translateStyleSheet = (sheet: any, context) => {
  context = addBuffer(`if (typeof document !== "undefined") {\n`, context);
  context = startBlock(context);
  context = addBuffer(
    `var style = document.createElement("style");\n`,
    context
  );
  context = addBuffer(
    `style.textContent = ${JSON.stringify(stringifyCSSSheet(sheet, null))};\n`,
    context
  );
  context = addBuffer(`document.body.appendChild(style);\n`, context);
  context = endBlock(context);
  context = addBuffer("}\n\n", context);
  return context;
};

const translateUtils = (ast: Node, context: TranslateContext) => {
  context = translateStyledUtil(ast, context);
  return context;
};

const translateStyledUtil = (ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `export const styled = (tagName, defaultProps) => {\n`,
    context
  );
  context = startBlock(context);
  context = addBuffer(`return function(props) {\n`, context);
  context = startBlock(context);
  context = addBuffer(
    `return React.createElement(tagName, Object.assign({ "data-pc-${context.scope}": true }, defaultProps || {}, props));\n`,
    context
  );
  context = endBlock(context);
  context = addBuffer(`};\n`, context);
  context = endBlock(context);
  context = addBuffer("}\n\n", context);
  // context = addBuffer("exports.styled = styled;\n\n", context);
  return context;
};

const translateImports = (ast: Node, context: TranslateContext) => {
  context = addBuffer(`var React = require("react");\n`, context);

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

const translateParts = (root: Node, context: TranslateContext) => {
  context = getParts(root).reduce(
    (context, part) => translatePart(part, context),
    context
  );
  return context;
};

const translatePart = (part: Element, context: TranslateContext) => {
  const componentName = getPartClassName(part);
  context = addBuffer(
    `export const ${componentName} = (props) => {\n`,
    context
  );
  context = startBlock(context);
  context = addBuffer("return ", context);
  context = translateFragment(part.children, true, context);
  context = addBuffer(";\n", context);
  context = endBlock(context);
  context = addBuffer("};\n\n", context);
  context = addBuffer("", context);
  // context = addBuffer(
  //   `exports.${componentName} = ${componentName};\n\n`,
  //   context
  // );
  return context;
};

const translateMainTemplate = (root: Node, context: TranslateContext) => {
  const componentName = getComponentName(root);

  context = startBlock(
    addBuffer(`const ${componentName} = (props) => {\n`, context)
  );
  context = addBuffer(`return `, context);
  context = translateJSXRoot(root, context);
  context = endBlock(context);
  context = addBuffer(";\n", context);
  context = addBuffer(`};\n\n`, context);
  // TODO - check if logic controller
  // context = addBuffer(
  //   `export const ${enhancedComponentName} = ${baseComponentName};\n`,
  //   context
  // );
  context = addBuffer(`export default ${componentName};\n`, context);

  return context;
};

const translateJSXRoot = (node: Node, context: TranslateContext) => {
  if (node.kind !== NodeKind.Fragment) {
    return translateJSXNode(node, true, context);
  }
  const visibleNodes = getVisibleChildNodes(node);

  if (visibleNodes.length === 1) {
    return translateJSXNode(visibleNodes[0], true, context);
  } else {
    context = translateFragment(visibleNodes, true, context);
  }

  return context;
};

const translateJSXNode = (
  node: Node,
  isRoot: boolean,
  context: TranslateContext
) => {
  if (node.kind === NodeKind.Fragment) {
    context = translateFragment(node.children, isRoot, context);
  } else if (node.kind === NodeKind.Element && isVisibleElement(node)) {
    const tag =
      context.importIds.indexOf(node.tagName) !== -1
        ? pascalCase(node.tagName)
        : JSON.stringify(node.tagName);

    context = addBuffer(`React.createElement(${tag}, {`, context);
    context = addBuffer("\n", context);
    context = startBlock(context);
    context = startBlock(context);
    context = addBuffer(`"data-pc-${context.scope}": true,\n`, context);
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
    let buffer = `${JSON.stringify(node.value)}`;
    if (isRoot) {
      buffer = `React.createElement("span", null, ${buffer})`;
    }
    context = addBuffer(buffer, context);
  } else if (node.kind === NodeKind.Slot) {
    context = translateSlot(node, context);
  }

  return context;
};

const translateFragment = (
  children: Node[],
  isRoot: boolean,
  context: TranslateContext
) => {
  if (children.length === 1) {
    return translateJSXNode(children[0], isRoot, context);
  }
  context = addBuffer(`React.createElement(React.Fragment,\n`, context);
  context = translateChildren(children, context);
  context = addBuffer(`)`, context);
  return context;
};

const translateChildren = (children: Node[], context: TranslateContext) => {
  context = startBlock(context);

  context = children
    .filter(isVisibleNode)
    .reduce((newContext, child, index, children) => {
      newContext = translateJSXNode(child, false, newContext);
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
    let name = attr.name;
    if (name === "class") {
      name = "className";
    }

    // can't handle for now
    if (name !== "style") {
      context = addBuffer(`${JSON.stringify(name)}: `, context);
      context = translateAttributeValue(attr.value, context);
      context = addBuffer(`,\n`, context);
    }
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
  if (value.attrValueKind === AttributeValueKind.Slot) {
    return translateStatment((value as any) as Statement, context);
  } else if (value.attrValueKind === AttributeValueKind.String) {
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
    return translateJSXNode((statement as any) as Node, false, context);
  }

  return context;
};
