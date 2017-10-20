import * as fs from "fs";
import * as md5 from "md5";
import { parse } from "./parser";
import { flatten } from "lodash";
import * as postcss from "postcss";
import { weakMemo } from "../utils";
import { 
  traversePCAST, 
  getExpressionPath,
  getPCStartTagAttribute,
  hasPCStartTagAttribute,
} from "./utils";
import {
  PCFragment,
  PCExpression,
  PCExpressionType,
  PCSelfClosingElement,
  PCElement,
  PCStartTag,
  PCEndTag,
  PCAttribute,
  PCParent,
  PCString,
  PCBlock,
} from "./ast";

const SOURCE_AST_VAR = "$$sourceAST";
const EXPORTS_VAR = "$$exports";

type TranspileContext = {
  source: string;
  varCount: number;
  root: PCFragment;
  templateNames: {
    [identifier: string]: boolean
  }
}

type Declaration = {
  varName: string;
  content: string;
};

/**
 * transpiles the PC AST to vanilla javascript with no frills
 */

export const transpilePCASTToVanillaJS = weakMemo((source: string) => transpileModule(parse(source), source));

const transpileModule = (root: PCFragment, source: string) => {
  
  const context: TranspileContext = {
    varCount: 0,
    source,
    root,
    templateNames: {}
  };

  let buffer = "(function(module, document) {\n";
  buffer += `var ${EXPORTS_VAR} = {};\n`;
  buffer += `var ${SOURCE_AST_VAR} = ${JSON.stringify(root)};\n`;
  buffer += transpileChildren(root, context);

  buffer += `module.exports = ${EXPORTS_VAR};\n`;
  buffer += `})(typeof module !== "undefined" ? module : {}, document);\n`

  return buffer;
};

const transpileChildren = (parent: PCParent, context: TranspileContext) => parent.children.map((child) => getTranspileContent(transpileNode(child, context))).join("\n");

const transpileNode = (node: PCExpression, context: TranspileContext): Declaration => {
  if (node.type === PCExpressionType.STRING) {
    return transpileText(node as PCString, context);
  } else if (node.type === PCExpressionType.BLOCK) {
    return transpileTextBlock(node as PCBlock, context);
  } else if (node.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return transpileStartTag(node as PCSelfClosingElement, context);
  } else if (node.type === PCExpressionType.ELEMENT) {
    return transpileElement(node as PCElement, context);
  }
};

const transpileStartTag = (startTag: PCSelfClosingElement | PCStartTag, context: TranspileContext, element?: PCElement) => {
  if (context.templateNames[startTag.name]) {
    return transpileTemplateCall(startTag, context, element);
  }
  const declaration = createNodeDeclaration(`document.createElement("${startTag.name}")`, element || startTag, context);

  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];
    callDeclarationProperty(declaration, "setAttribute", `"${attribute.name}", ${transpileAttributeValue(attribute)}`, context);
  }
  
  return declaration;
};

const transpileAttributeValue = (attribute: PCAttribute) => {
  if (!attribute.value) {
    return `true`;
  }

  if (attribute.value.type === PCExpressionType.STRING) {
    return `"${(attribute.value as PCString).value}"`;
  } else if (attribute.value.type === PCExpressionType.BLOCK) {
    return `${(attribute.value as PCBlock).value}`;
  }
}

const transpileElement = (node: PCElement, context: TranspileContext) => {

  let declaration: Declaration;

  if (node.startTag.name === "template") {
    declaration = transpileTemplate(node, context);
  } else if (node.startTag.name === "import") {
    // TODO
    // declaration = transpileImport(node, context);
  } else if (node.startTag.name === "repeat") {
    // TODO
  } else if (node.startTag.name === "style") {
    // TODO
    declaration = transpileStyleElement(node, context);
    
  } else {
    declaration = transpileBasicElement(node, context);
  } 

  tryExportingDeclaration(declaration, node, context);

  return declaration;
};

const uid = () => md5(Date.now() + "_" + Math.random());

// TODO - eventually need to put these style elements within the global context, or check if they've already
// been registered. Otherwise they'll pollute the CSSOM when used repeatedly. 
const transpileStyleElement = (node: PCElement, context: TranspileContext) => {
  const scoped = hasPCStartTagAttribute(node, "scoped");

  const varName = `style_${uid()}`;

  let buffer = `
    var ${varName} = document.createElement("style");
    ${varName}.setAttribute("data-style-id", "${varName}");
  `
  let css = context.source.substr(node.startTag.location.end, node.endTag.location.start - node.startTag.location.end);

  if (scoped) { 

    const cssRulePrefixes = [`[data-style-id=${varName}] ~ `, `[data-style-id=${varName}] ~ * `];

    const declaration = declareNode(`document.createElement("style")`, context);

    // TODO - call CSSOM, don't set textContent. Also need to define CSS AST in the scope
  
    css = postcss().use(prefixCSSRules(cssRulePrefixes)).process(css).css;
  }

  buffer += `${varName}.textContent = "${css.replace(/[\n\r\s\t]+/g, " ")}";\n`

  return {
    varName: varName,
    content: buffer
  };
}

const prefixCSSRules = (prefixes: string[]) => (root: postcss.Root) => {
  // from https://github.com/RadValentin/postcss-prefix-selector/blob/master/index.js
  root.walkRules(rule => {
    rule.selectors = flatten(rule.selectors.map((selector) => {
      return prefixes.map((prefix) => prefix + selector);
    }));
  });
}

const transpileTemplateCall = (node: PCStartTag, context: TranspileContext, element?: PCElement) => {

  let buffer = '';

  const attributeBuffer = node.attributes.map((attr) => (
    `"${attr.name}": ${transpileAttributeValue(attr)}`
  ));

  if (element && element.children.length > 0) {
    const childDeclarations = element.children.map((child) => transpileNode(child, context));
    buffer += childDeclarations.map((decl) => decl.content).join("");

    attributeBuffer.push(
      `"children":[` +
      childDeclarations.map((decl) => decl.varName).join(",") + 
      `]`
    )
  }

  const decl = declareNode(`${node.name}({${attributeBuffer.join(",")}})`, context);
  decl.content = buffer + decl.content;
  return decl;
}

const assertAttributeExists = (node: PCElement, name: string, context: TranspileContext) => {
  if (!getPCStartTagAttribute(node, "name")) {

    // TODO - show actual source code here
    throw new Error(`Missing "${name}" element attribute at ${node.location.start}`);
  }
}

const tryExportingDeclaration = (declaration: Declaration, node: PCElement, context: TranspileContext) => {
  const name = getPCStartTagAttribute(node, "name");
  const shouldExport = hasPCStartTagAttribute(node, "export");

  if (shouldExport) {
    declaration.content += `${EXPORTS_VAR}.${name || declaration.varName} = ${declaration.varName};\n`;
  }
}

const transpileImport = (node: PCElement, context: TranspileContext) => {
  const src    = getPCStartTagAttribute(node, "src");
  assertAttributeExists(node, "src", context);
};

const transpileTemplate = (node: PCElement, context: TranspileContext) => {
  const name    = getPCStartTagAttribute(node, "name");
  const shouldExport = hasPCStartTagAttribute(node, "export");

  assertAttributeExists(node, "name", context);

  context.templateNames[name] = true;

  let newContext = { ...context, varCount: 0 };
  const fragmentDeclaration = declareNode(`document.createDocumentFragment()`, newContext);
  
  fragmentDeclaration.content += "with(context) {\n";
  addNodeDeclarationChildren(fragmentDeclaration, node, newContext);
  fragmentDeclaration.content += "}";

  let buffer = `function ${name}(context) {
    ${fragmentDeclaration.content}
    return ${fragmentDeclaration.varName};
  }\n`;


  if (shouldExport) {
    buffer += `${EXPORTS_VAR}.${name} = ${name};\n;`
  }

  return {
    varName: name,
    content: buffer
  };
}

const transpileBasicElement = (node: PCElement, context: TranspileContext) => {
  const declaration = transpileStartTag(node.startTag, context, node);

  // do not include -- already part of attributes
  if (!context.templateNames[node.startTag.name]) {
    addNodeDeclarationChildren(declaration, node, context);
  }
  return declaration;
};

const addNodeDeclarationChildren = (declaration: Declaration, node: PCElement, context: TranspileContext) => {
  for (let i = 0, {length} = node.children; i < length; i++) {
    const child = node.children[i];
    const childDeclaration = transpileNode(child, context);
    declaration.content += childDeclaration.content;
    callDeclarationProperty(declaration, "appendChild", childDeclaration.varName, context);
  }
  return declaration;
};

const transpileText = (node: PCString, context: TranspileContext) => createTextNodeDeclaration(`"${node.value.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`, node, context);

const transpileTextBlock = (node: PCBlock, context: TranspileContext) => {

  // reserved
  if (node.value === "children") {
    return transpileChildBlock(node, context);
  }

  return createTextNodeDeclaration(`${node.value}`, node, context);
}

const transpileChildBlock = (node: PCBlock, context: TranspileContext) => {

  // span must exist so that we can attach the source
  const fragmentDeclaration = createNodeDeclaration(`document.createElement("span")`, node, context);

  const iDeclaration = declare("i", undefined, context);
  const nDeclaration = declare("n", undefined, context);

  let buffer = `
    for (var ${iDeclaration.varName} = 0, ${nDeclaration.varName} = ${node.value}.length; ${iDeclaration.varName} < ${nDeclaration.varName}; ${iDeclaration.varName}++) {
      ${fragmentDeclaration.varName}.appendChild(${node.value}[${iDeclaration.varName}]);
    }
  `;
  
  fragmentDeclaration.content += buffer;

  return fragmentDeclaration;
}

const createTextNodeDeclaration = (statement: string, expr: PCExpression, context: TranspileContext) => createNodeDeclaration(`document.createTextNode(${statement})`, expr, context);

const createNodeDeclaration = (statement: string, expr: PCExpression, context: TranspileContext) => {
  let declaration = declareNode(statement, context);
  declaration
  if (expr) {
    addDeclarationSourceReference(declaration, expr, context);
  }
  return declaration;
};

const getTranspileContent = (result: Declaration | string) => typeof result === "string" ? result : result.content;

const declareNode = (assignment: string, context: TranspileContext) => declare("node", assignment, context);

const declare = (baseName: string, assignment: string, context: TranspileContext): Declaration => {
  const varName = `${baseName}_${context.varCount++}`;
  return {
    varName,
    content: assignment ? `var ${varName} = ${assignment};\n` : `var ${varName};`
  };
};

const addDeclarationProperty = (declaration: Declaration, propertyName: string, assignment: string, context: TranspileContext): Declaration => {
  declaration.content += `${declaration.varName}.${propertyName} = ${assignment};\n`;
  return declaration;
};

const callDeclarationProperty = (declaration: Declaration, propertyName: string, args: string, context: TranspileContext): Declaration => {
  declaration.content += `${declaration.varName}.${propertyName}(${args});\n`;
  return declaration;
};

const addDeclarationSourceReference = (declaration: Declaration, expression: PCExpression, context: TranspileContext) => {
  const nodePath = getExpressionPath(expression, context.root);
  let buffer = `${SOURCE_AST_VAR}`;

  for (const part of nodePath) {
    if (typeof part === "number") {
      buffer += `[${part}]`;
    } else if (typeof part === "string") {
      buffer += `.${part}`;
    }
  }
  addDeclarationProperty(declaration, "source", buffer, context);
}