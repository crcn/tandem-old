import * as fs from "fs";
import * as md5 from "md5";
import * as path from "path";
import { parse } from "./parser";
import { flatten, repeat } from "lodash";
import { weakMemo } from "../utils";
import { parsePCStyle } from "./style-parser";
import { 
  PCSheet, 
  PCAtRule,
  PCStyleRule, 
  PCGroupingRule,
  PCStyleDeclarationProperty, 
  PCStyleExpressionType, 
} from "./style-ast";
import { 
  getPCImports,
  traversePCAST, 
  getExpressionPath,
  getPCStartTagAttribute,
  hasPCStartTagAttribute,
  getPCASTElementsByTagName,
} from "./utils";
import {
  PCFragment,
  PCExpression,
  ExpressionPosition,
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

// const SOURCE_AST_VAR = "$$sourceAST";
const EXPORTS_VAR = "$$exports";
const STYLES_VAR  = "$$styles";

type TranspileOptions = {
  assignTo?: string;
  readFileSync?: (filePath: string) => string;
};

type TranspileContext = {
  uri: string;
  source: string;
  varCount: number;
  root: PCFragment;
  imports: {
    [identifier: string]: string
  },
  templateNames: {
    [identifier: string]: string
  }
} & TranspileOptions;

type TranspileStyleContext = {
  scope: string;
} & TranspileContext;

type Declaration = {
  varName: string;
  content: string;
};

type Modules = {
  [identifier: string]: {
    content: string
  }
};

export type BundleResult = {
  errors: Error[];
  warnings: Error[];
  modules: Modules;
}

export type TranspileResult = {
  errors: Error[],
  warnings: Error[]
  content: string;
  allFiles: string[];
};

/**
 * transpiles the PC AST to vanilla javascript with no frills
 */

export const transpilePCASTToVanillaJS = (source: string, uri: string, options: TranspileOptions = {}) => {
  return transpileBundle(source, uri, {
    ...options,
    readFileSync: (filePath) => fs.readFileSync(filePath, "utf8")
  });
};

export const transpileBundle = (source: string, uri: string, options: TranspileOptions): TranspileResult => {
  
  let buffer = `(function(document) {
    function module(fn) {
    var exports;
    return function(modules) {
      return exports || (exports = fn(function(path) {
        return modules[path](modules);
      }));
    };
  }\n`;
  
  buffer += `var modules = {\n`;

  const { warnings, errors, modules } = bundle(source, uri, undefined, options);

  
  for (const uri in modules) {
    buffer += `"${uri}": ${modules[uri].content},`
  };

  buffer += "}\n";
  buffer += `return {
    entry: modules["${uri}"](modules),
    modules: modules
  }`;
  buffer += `})(document);`

  if (options.assignTo) {
    buffer = `${options.assignTo} = ${buffer}`;
  }

  return {
    warnings,
    errors,
    content: buffer,
    allFiles: Object.keys(modules)
  };
};

const bundle = (source: string, uri: string, parentResult: BundleResult = { modules: {}, errors: [], warnings: []}, options: TranspileOptions): BundleResult => {
  let ast;

  let result: BundleResult = {
    errors: [...parentResult.errors],
    warnings: [...parentResult.warnings],
    modules: {
      ...parentResult.modules,

      // register content so that URI gets picked up in allFiles
      [uri]: {
        content: ""
      }
    }
  };
  
  try {
    const ast = parse(source);
    const imports = getPCImports(ast);
    const importMap = {};

    for (const ns in imports) {
      const src = imports[ns];
      const importFullPath = "file://" + path.resolve(path.dirname(uri.replace("file://", "")), src);
      importMap[ns] = importFullPath;
      if (!result.modules[importFullPath]) {
        result = bundle(
          options.readFileSync(importFullPath.replace("file://", "")),
          importFullPath,
          result,
          options
        );
      }
    }

    result = {
      ...result,
      modules: {
        ...result.modules,
        [uri]: {    
          content: transpileModule(ast, source, uri, importMap)
        }
      }
    };
  } catch(e) {
    result = {
      ...result,
      errors: [...result.errors, e]
    }
  }
  

  return result;
};

const getNsVarName = (ns: string) => `$$ns$$${ns.replace(/\-/g, "_")}`;

const transpileModule = weakMemo((root: PCFragment, source: string, uri: string, importsMap: any = {}) => {
  
  const context: TranspileContext = {
    varCount: 0,
    uri,
    source,
    root,
    imports: importsMap,
    templateNames: {}
  };

  let buffer = "module(function(require) {\n";
  buffer += `var ${EXPORTS_VAR} = {};\n`;
  buffer += `var ${STYLES_VAR} = [];\n`;
  for (const ns in importsMap) {
    const path = importsMap[ns];
    buffer += `var ${getNsVarName(ns)} = require("${path}");\n`
    buffer += `${STYLES_VAR} = ${STYLES_VAR}.concat(${getNsVarName(ns)}.${STYLES_VAR});\n`;
  }
  buffer += transpileChildren(root, context);

  buffer += `${EXPORTS_VAR}.${STYLES_VAR} = ${STYLES_VAR};\n`;
  buffer += `return ${EXPORTS_VAR};\n`;
  buffer += `})\n`

  return buffer;
});

const transpileChildren = (parent: PCParent, context: TranspileContext) => parent.children.map((child) => getTranspileContent(transpileNode(child, context))).join("\n");

const transpileNode = (node: PCExpression, context: TranspileContext): Declaration => {
  if (node.type === PCExpressionType.STRING) {
    return transpileText(node as PCString, context);
  } else if (node.type === PCExpressionType.BLOCK) {
    return transpileTextBlock(node as PCBlock, context);
  } else if (node.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return transpileSelfClosingElement(node as PCSelfClosingElement, context);
  } else if (node.type === PCExpressionType.ELEMENT) {
    return transpileElement(node as PCElement, context);
  }
};


const transpileStartTag = (startTag: PCSelfClosingElement | PCStartTag, context: TranspileContext, element?: PCElement) => {

  if (hasImportedXMLNSTagName(startTag.name, context)) {
    return transpileXMLNSImportedTag(startTag, context, element);
  }

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

const transpileSelfClosingElement = (element: PCSelfClosingElement, context: TranspileContext) => {
  return transpileStartTag(element, context);
}

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
  switch(node.startTag.name) {
    case "paperclip": 
    case "root":
    case "module": {
      declaration = {
        varName: null,
        content: transpileChildren(node, context)
      };
      break;
    }
    case "template": {
      declaration = transpileTemplate(node, context);
      break;
    }
    case "repeat": {
      // TODO
      break;
    }
    case "style": {
      declaration = transpileStyleElement(node, context);
      break;
    }
    default: {
      declaration = transpileBasicElement(node, context);
      break;
    }
  }

  tryExportingDeclaration(declaration, node, context);

  return declaration;
};

// TODO - eventually need to put these style elements within the global context, or check if they've already
// been registered. Otherwise they'll pollute the CSSOM when used repeatedly. 
const transpileStyleElement = (node: PCElement, context: TranspileContext) => {
  const scoped = hasPCStartTagAttribute(node, "scoped");
  const path = getExpressionPath(node, context.root);

  const varName = `style_${context.varCount++}`;

  let buffer = `
    var ${varName} = document.createElement("style");
    ${varName}.setAttribute("data-style-id", "${varName}");
  `;

  const textChild = node.children[0] as PCString;
  let cssSource = repeat("\n", textChild.location.start.line - 1) + context.source.substr(textChild.location.start.pos, textChild.location.end.pos - textChild.location.start.pos);
  
  // if synthetic, then we're running FE code in tandem, so so we can
  // instantiate otherwise illegal constructors & attach useful information about them 
  buffer += `if (window.$synthetic) { \n`;
  const styleSheet = transpileStyleSheet(parsePCStyle(cssSource), { ...context, scope: scoped ? varName : null });
  buffer += styleSheet.content;

  buffer += `${varName}.$$setSheet(${styleSheet.varName});\n`;

  buffer += `} else { \n`;
  buffer += `${varName}.textContent = "${cssSource.replace('"', '\\"').replace(/[\n\r\s\t]+/g, " ")}";\n`;
  buffer += `}\n`;

  // buffer += `${varName}.textContent = "${css.replace(/[\n\r\s\t]+/g, " ")}";\n`

  // in the root scope, so export as a global style
  if (path.length === 2) {
    buffer += `${STYLES_VAR}.push(${varName});\n`;
  }

  return {
    varName: varName,
    content: buffer
  };
};

const transpileStyleSheet = (ast: PCSheet, context: TranspileStyleContext) => {
  const children = transpileGroupingRuleChildren(ast, context);
  const declaration = declareRule(`new CSSStyleSheet([${children.map(child => child.varName).join(", ")}])`, context);
  addDeclarationSourceReference(declaration, ast, context);
  declaration.content = children.map(child => child.content).join("") + declaration.content;
  return declaration;
}

const transpileGroupingRuleChildren = (ast: PCGroupingRule, context: TranspileStyleContext) => ast.children.map((rule) => transpileGroupingRule(rule, context));


const transpileGroupingRule = (ast: PCGroupingRule, context: TranspileStyleContext): Declaration => {
  if (ast.type === PCStyleExpressionType.STYLE_RULE) {
    const styleRule = ast as PCStyleRule;

    const selectorText = context.scope ? `[data-style-id=${context.scope}] ~ ${styleRule.selectorText}, [data-style-id=${context.scope}] ~ * ${styleRule.selectorText}` : styleRule.selectorText;

    return addDeclarationSourceReference(declareRule(`new CSSStyleRule("${selectorText.replace('"', '\\"')}", ${transpileStyleDeclaration(styleRule, context)})`, context), ast, context);
  } else if (ast.type === PCStyleExpressionType.AT_RULE) {
    const atRule = ast as PCAtRule;
    let declaration: Declaration;

    if (atRule.name === "media" || atRule.name === "keyframes") {
      const childDeclarations = atRule.name === "keyframes" ? atRule.children.map(child => transpileKeyframe(child as PCStyleRule, context)) : atRule.children.map(child => transpileGroupingRule(child, context))
      const childVarBuffer = `[${childDeclarations.map(child => child.varName).join(", ")}]`;
      const constructorName = atRule.name === "media" ? "CSSMediaRule" : "CSSKeyframesRule";
      declaration = declareRule(`new ${constructorName}(${atRule.params.join(", ")}, ${childVarBuffer})`, context);
      declaration.content = childDeclarations.map((child) => child.content).join("") + declaration.content;
    } else if (atRule.name === "font-face") {
    } else {
      declaration = declareRule(`new UnknownGroupingRule()`, context);
    }

    return addDeclarationSourceReference(declaration, ast, context);
  }

  throw new Error(`Unknown CSS expression ${JSON.stringify(ast)} at ${ast.location.start.pos}`);
}

const transpileKeyframe = (styleRule: PCStyleRule, context: TranspileStyleContext) => {
  return addDeclarationSourceReference(declareRule(`new CSSKeyframeRule("${styleRule.selectorText.replace(/[\s\r\n\t]+/g, "")}", ${transpileStyleDeclaration(styleRule, context)})`, context), styleRule, context);
}

const transpileStyleDeclaration = (ast: PCStyleRule, context: TranspileStyleContext) => {

  let objectBuffer = `{`;

  for (const property of ast.declarationProperties) {
    objectBuffer += `"${property.name}": "${property.value.replace('"', '\\"').replace(/[\s\r\n\t]+/g, " ")}", `;
  }
  
  objectBuffer += `}`;

  return `CSSStyleDeclaration.fromObject(${objectBuffer})`;
}

// const prefixCSSRules = (prefixes: string[]) => (root: postcss.Root) => {
//   // from https://github.com/RadValentin/postcss-prefix-selector/blob/master/index.js
//   root.walkRules(rule => {
//     rule.selectors = flatten(rule.selectors.map((selector) => {
//       return prefixes.map((prefix) => prefix + selector);
//     }));
//   });
// }

const transpileXMLNSImportedTag = (node: PCStartTag, context: TranspileContext, element?: PCElement) => {
  const [ns, templateName] = node.name.split(":");

  return transpileTemplateCall(node, context, element, `${getNsVarName(ns)}.${templateName}`);
}

const transpileTemplateCall = (node: PCStartTag, context: TranspileContext, element?: PCElement, fnName?: string) => {

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

  const decl = declareNode(`${fnName || context.templateNames[node.name]}({${attributeBuffer.join(",")}})`, context);
  decl.content = buffer + decl.content;
  return decl;
}

const declareRule = (assignment: string, context: TranspileContext) => declare("rule", assignment, context);

const assertAttributeExists = (node: PCElement|PCSelfClosingElement, name: string, context: TranspileContext) => {
  if (!getPCStartTagAttribute(node, name)) {

    // TODO - show actual source code here
    throw new Error(`Missing "${name}" element attribute at ${node.location.start}`);
  }
}

const tryExportingDeclaration = (declaration: Declaration, node: PCElement, context: TranspileContext) => {
  const name = getPCStartTagAttribute(node, "name");
  const shouldExport = hasPCStartTagAttribute(node, "export");

  if (shouldExport) {
    declaration.content += `${EXPORTS_VAR}["${name || declaration.varName}"] = ${declaration.varName};\n`;
  }
}

const getJSFriendlyVarName = (name: string) => name.replace(/\-/g, "_");

const transpileTemplate = (node: PCElement, context: TranspileContext) => {
  const name    = getPCStartTagAttribute(node, "name");
  const shouldExport = hasPCStartTagAttribute(node, "export");

  assertAttributeExists(node, "name", context);
  const jsFriendlyName = getJSFriendlyVarName(name);

  context.templateNames[name] = jsFriendlyName;

  let newContext = { ...context, varCount: 0 };
  const fragmentDeclaration = declareNode(`document.createDocumentFragment()`, newContext);
  
  fragmentDeclaration.content += "with(context) {\n";
  addNodeDeclarationChildren(fragmentDeclaration, node, newContext);
  fragmentDeclaration.content += "}";

  let buffer = `function ${jsFriendlyName}(context) {
    ${fragmentDeclaration.content}
    return ${fragmentDeclaration.varName};
  }\n`;

  return {
    varName: jsFriendlyName,
    content: buffer
  };
}

const getXMLNSTagNameParts = (name: string, context: TranspileContext) => {
  return name.split(":");
}

const hasImportedXMLNSTagName = (name: string, context: TranspileContext) => {
  return Boolean(name.indexOf(":") !== -1 && context.imports[name.split(":")[0]]);
}

const transpileBasicElement = (node: PCElement, context: TranspileContext) => {
  const declaration = transpileStartTag(node.startTag, context, node);

  // do not include -- already part of attributes
  if (!context.templateNames[node.startTag.name] && !hasImportedXMLNSTagName(node.startTag.name, context)) {
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
    content: assignment ? `var ${varName} = ${assignment};\n` : `var ${varName};\n`
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
  // const nodePath = getExpressionPath(expression, context.root);

  const buffer = JSON.stringify({
    uri: context.uri,
    fingerprint: md5(context.source),
    type: expression.type,
    ...expression.location,
  });

  // let buffer = `${SOURCE_AST_VAR}`;

  // for (const part of nodePath) {
  //   if (typeof part === "number") {
  //     buffer += `[${part}]`;
  //   } else if (typeof part === "string") {
  //     buffer += `.${part}`;
  //   }
  // }
  addDeclarationProperty(declaration, "source", buffer, context);

  return declaration;
}