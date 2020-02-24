import {
  Node,
  getImports,
  NodeKind,
  Attribute,
  Reference,
  getLogicElement,
  Statement,
  BlockKind,
  ConditionalKind,
  StatementKind,
  getAttributeStringValue,
  getVisibleChildNodes,
  Slot,
  Block,
  ConditionalBlock,
  EachBlock,
  AttributeValue,
  AttributeKind,
  AttributeValueKind,
  isVisibleNode,
  getImportIds,
  Element,
  getStyleScopes,
  resolveImportFile,
  getRelativeFilePath,
  Sheet,
  PassFailConditional,
  FinalConditional,
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
  getComponentName,
  getPartClassName,
  RENAME_PROPS
} from "./utils";
import { camelCase } from "lodash";
import * as path from "path";

export const compile = (
  { ast, sheet }: { ast: Node; sheet?: any },
  filePath: string,
  options: Options = {}
) => {
  let context = createTranslateContext(
    filePath,
    getImportIds(ast),
    getStyleScopes(ast, filePath),
    Boolean(getLogicElement(ast)),
    options
  );
  context = translateRoot(ast, sheet, context);
  return context.buffer;
};

const translateRoot = (ast: Node, sheet: any, context: TranslateContext) => {
  context = translateImports(ast, context);
  if (sheet) {
    context = translateStyleSheet(sheet, context);
  }
  const logicElement = getLogicElement(ast);
  if (logicElement) {
    const src = getAttributeStringValue("src", logicElement);
    if (src) {
      const logicRelativePath = getRelativeFilePath(context.filePath, src);
      context = addBuffer(
        `const logic = require("${logicRelativePath}");\n`,
        context
      );
      context = addBuffer(
        `const enhanceView = logic.default || logic;\n\n`,
        context
      );
    }
  }
  context = translateUtils(ast, context);
  context = translateView(ast, context);
  return context;
};

const translateStyleSheet = (sheet: Sheet, context: TranslateContext) => {
  if (!sheet.rules.length) {
    return context;
  }
  context = addBuffer(`if (typeof document !== "undefined") {\n`, context);
  context = startBlock(context);
  context = addBuffer(
    `const style = document.createElement("style");\n`,
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

const translateStyleScopeAttributes = (
  context: TranslateContext,
  newLine: string = ""
) => {
  for (let i = 0, { length } = context.styleScopes; i < length; i++) {
    const scope = context.styleScopes[i];
    context = addBuffer(`"data-pc-${scope}": true,${newLine}`, context);
  }
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
    `return React.createElement(tagName, Object.assign({ `,
    context
  );
  context = translateStyleScopeAttributes(context, " ");
  context = addBuffer(`}, defaultProps, props));\n`, context);
  context = endBlock(context);
  context = addBuffer(`};\n`, context);
  context = endBlock(context);
  context = addBuffer("}\n\n", context);
  return context;
};

const translateImports = (ast: Node, context: TranslateContext) => {
  context = addBuffer(`const React = require("react");\n`, context);

  const imports = getImports(ast);
  for (const imp of imports) {
    const id = getAttributeStringValue("id", imp);
    const src = getAttributeStringValue("src", imp);

    if (!src) {
      continue;
    }

    let relativePath = path.relative(
      path.dirname(context.filePath),
      resolveImportFile(context.filePath, src)
    );
    if (relativePath.charAt(0) !== ".") {
      relativePath = `./${relativePath}`;
    }

    const importStr = `require("${relativePath}");`;

    if (id) {
      context = addBuffer(`const ${pascalCase(id)} = ${importStr}\n`, context);
    } else {
      context = addBuffer(`${importStr}\n`, context);
    }
  }
  context = addBuffer("\n", context);
  return context;
};

const translateView = (root: Node, context: TranslateContext) => {
  const componentName = getComponentName(root);

  context = startBlock(
    addBuffer(`let ${componentName} = (props) => {\n`, context)
  );
  context = addBuffer(`return `, context);
  context = translateJSXRoot(root, context);
  context = endBlock(context);
  context = addBuffer(";\n", context);
  context = addBuffer(`};\n\n`, context);
  if (context.hasLogicFile) {
    context = addBuffer(
      `${componentName} = enhanceView(${componentName});\n`,
      context
    );
  }
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

const getImportTagName = (tagName: string) => {
  const parts = tagName.split(".").map(pascalCase);
  return parts.length > 1 ? `${parts[0]}.default` : parts.join(".");
};

const translateJSXNode = (
  node: Node,
  isRoot: boolean,
  context: TranslateContext
) => {
  if (node.kind === NodeKind.Fragment) {
    context = translateFragment(node.children, isRoot, context);
  } else if (node.kind === NodeKind.Element && isVisibleElement(node)) {
    context = translateElement(node, isRoot, context);
  } else if (node.kind === NodeKind.Block) {
    context = translateBlock(node, isRoot, context);
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

const translateElement = (
  element: Element,
  isRoot: boolean,
  context: TranslateContext
) => {
  const isComponentInstance = context.importIds.indexOf(element.tagName) !== -1;
  const id = getAttributeStringValue("id", element);
  const propsName = id
    ? `props.${camelCase(id)}Props`
    : isComponentInstance
    ? `props.${camelCase(element.tagName)}Props`
    : null;
  const tag = isComponentInstance
    ? getImportTagName(element.tagName)
    : JSON.stringify(element.tagName);

  context = addBuffer(`React.createElement(${tag}, `, context);
  if (isRoot || propsName) {
    context = addBuffer(`Object.assign(`, context);
  }
  context = addBuffer(`{\n`, context);
  context = startBlock(context);
  context = startBlock(context);
  context = translateStyleScopeAttributes(context, "\n");
  context = addBuffer(`"key": ${context.keyCount++},\n`, context);
  for (const attr of element.attributes) {
    context = translateAttribute(attr, context);
  }
  context = endBlock(context);
  context = addBuffer(`}`, context);
  if (isRoot) {
    context = addBuffer(`, props)`, context);
  }
  if (propsName) {
    context = addBuffer(`, ${propsName})`, context);
  }
  context = endBlock(context);
  if (element.children.length) {
    context = addBuffer(`,\n`, context);
    context = translateChildren(element.children, context);
  } else {
    context = addBuffer(`\n`, context);
  }
  context = addBuffer(`)`, context);
  return context;
};

const translateBlock = (
  node: Block,
  isRoot: boolean,
  context: TranslateContext
) => {
  switch (node.blockKind) {
    case BlockKind.Each:
      return translateEachBlock(node, context);
    case BlockKind.Conditional:
      return translateConditionalBlock(node, context);
  }
};

const translateEachBlock = (
  { source, body, keyName, valueName }: EachBlock,
  context: TranslateContext
) => {
  context = addBuffer(`(`, context);
  context = translateStatment(source, false, context);
  context = addBuffer(
    `).map(function(${keyName}, ${valueName}, ${keyName || "$$index"}) {\n`,
    context
  );
  context = startBlock(context);
  context = addBuffer(`return `, context);
  context = translateJSXNode(body, false, {
    ...context,
    outOfPropsScope: true
  });
  context = addBuffer(`;\n`, context);
  context = endBlock(context);
  context = addBuffer(`})`, context);
  return context;
};

const translateConditionalBlock = (
  node: PassFailConditional | FinalConditional,
  context: TranslateContext
) => {
  if (node.conditionalKind === ConditionalKind.PassFailBlock) {
    context = addBuffer(`(`, context);
    context = translateStatment(node.condition, false, context);
    context = addBuffer(` ? `, context);
    context = translateJSXNode(node.body, false, context);
    context = addBuffer(` : `, context);
    if (node.fail) {
      context = translateConditionalBlock(node.fail, context);
    } else {
      context = addBuffer("null", context);
    }
    context = addBuffer(`)`, context);
    return context;
  } else {
    return translateJSXNode(node.body, false, context);
  }
};

const translateFragment = (
  children: Node[],
  isRoot: boolean,
  context: TranslateContext
) => {
  if (children.length === 1) {
    return translateJSXNode(children[0], isRoot, context);
  }
  context = addBuffer(`[\n`, context);
  context = translateChildren(children, context);
  context = addBuffer(`]`, context);
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
    let name = RENAME_PROPS[attr.name] || attr.name;
    let value = attr.value;

    if (name === "string") {
      console.warn("Can't handle style tag for now");
    }

    // can't handle for now
    if (name !== "style") {
      context = addBuffer(`${JSON.stringify(name)}: `, context);
      context = translateAttributeValue(name, value, context);
      context = addBuffer(`,\n`, context);
    }
  } else if (attr.kind === AttributeKind.ShorthandAttribute) {
    const keyValue = (attr.reference as Reference).path[0];
    context = addBuffer(
      `${JSON.stringify(keyValue)}: ${
        context.outOfPropsScope ? "" : "props."
      }${camelCase(keyValue)}`,
      context
    );
    context = addBuffer(`,\n`, context);
  }

  return context;
};

const translateAttributeValue = (
  name: string,
  value: AttributeValue,
  context: TranslateContext
) => {
  if (!value) {
    return addBuffer("true", context);
  }
  if (value.attrValueKind === AttributeValueKind.Slot) {
    return translateStatment((value as any) as Statement, false, context);
  } else if (value.attrValueKind === AttributeValueKind.String) {
    let strValue = JSON.stringify(value.value);
    if (name === "src") {
      strValue = `require(${strValue}).default`;
    }
    return addBuffer(strValue, context);
  }

  return context;
};

const translateSlot = (slot: Slot, context: TranslateContext) => {
  return translateStatment(slot.script, true, context);
};

const translateStatment = (
  statement: Statement,
  isRoot: boolean,
  context: TranslateContext
) => {
  if (statement.jsKind === StatementKind.Reference) {
    return addBuffer(
      `${context.outOfPropsScope ? "" : "props."}${statement.path.join(".")}`,
      context
    );
  } else if (statement.jsKind === StatementKind.Node) {
    return translateJSXNode((statement as any) as Node, isRoot, context);
  }

  return context;
};
