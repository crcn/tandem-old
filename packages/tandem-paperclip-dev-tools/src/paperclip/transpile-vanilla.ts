// TODO - scan for all styles and shove in global namespace. 

import * as fs from "fs";
import * as md5 from "md5";
import * as path from "path";
import { parse } from "./parser";
import { flatten, repeat, camelCase, snakeCase } from "lodash";
import { parsePCStyle } from "./style-parser";
import { 
  PCSheet, 
  PCAtRule,
  PCStyleRule, 
  PCGroupingRule,
  stringifyStyleAST,
  PCStyleDeclarationProperty, 
  PCStyleExpressionType, 
} from "./style-ast";
import { 
  getPCImports,
  getPCStyleID,
  traversePCAST, 
  getPCStyleElements,
  getPCLinkStyleElements,
  filterPCASTTree,
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
  PCComment,
  PCStartTag,
  PCEndTag,
  PCAttribute,
  PCParent,
  PCString,
  PCBlock,
} from "./ast";


// const SOURCE_AST_VAR = "$$sourceAST";
const EXPORTS_VAR  = "$$exports";
const STYLES_VAR   = "$$styles";
const BINDINGS_VAR   = "$$bindings";
const PREVIEWS_VAR = "$$previews";

type TranspileOptions = {
  assignTo?: string;
  readFileSync?: (filePath: string) => string;
};

type TranspileContext = {
  uri: string;
  source: string;
  varCount: number;
  root: PCFragment;
  imports: string[],
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
    readFileSync: (filePath) => fs.readFileSync(filePath, "utf8"),
    ...options,
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
    }\n

    var updating = false;
    var toUpdate = [];

    function $$requestUpdate(object) {
      if (toUpdate.indexOf(object) === -1) {
        toUpdate.push(object);
      }
      if (updating) {
        return;
      }

      updating = true;
      requestAnimationFrame(function() {
        for(var i = 0; i < toUpdate.length; i++) {
          toUpdate[i].update();
        }
        toUpdate = [];
        updating = false;
      });
    }
  `;
  buffer += `var noop = function(){}\n;`;
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
    const resolvedImports = [];

    for (const src of imports) {
      const importFullPath = "file://" + path.resolve(path.dirname(uri.replace("file://", "")), src);
      resolvedImports.push(importFullPath);
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
          content: transpileModule(ast, source, uri, resolvedImports)
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

const getNsPrefix = (ns: string) => `ns-${ns.replace(/\-/g, "_")}`;

const transpileModule = (root: PCFragment, source: string, uri: string, imports) => {
  
  const context: TranspileContext = {
    varCount: 0,
    uri,
    source,
    root,
    imports,
    templateNames: {}
  };

  let buffer = "module(function(require) {\n";
  buffer += `var ${EXPORTS_VAR} = {};\n`;
  buffer += `var ${STYLES_VAR} = [];\n`;
  buffer += `var ${PREVIEWS_VAR} = {};\n`;
  buffer += `var ${BINDINGS_VAR} = [];\n`;

  for (const src of imports) {
    const path = imports[src];
    const srcDecl = declare("dep", `require("${src}")`, context);
    buffer += srcDecl.content;
    buffer += `${STYLES_VAR} = ${STYLES_VAR}.concat(${srcDecl.varName}.${STYLES_VAR});\n`;
  }

  const linkElements = getPCLinkStyleElements(root) as PCSelfClosingElement[];
  for (const link of linkElements) {
    const decl = transpileStartTag(link, context)
    buffer += decl.content;
    buffer += `${STYLES_VAR}.push(${decl.varName});\n`;
  }

  buffer += transpileChildren(root, context);

  buffer += `${EXPORTS_VAR}.${STYLES_VAR} = ${STYLES_VAR};\n`;
  buffer += `${EXPORTS_VAR}.${PREVIEWS_VAR} = ${PREVIEWS_VAR};\n`;
  buffer += `return ${EXPORTS_VAR};\n`;
  buffer += `})\n`

  return buffer;
};

const transpileChildren = (parent: PCParent, context: TranspileContext) => getTranspiledChildren(parent, context).map(getTranspileContent).join("\n");

const getTranspiledChildren = (parent: PCParent, context: TranspileContext) => parent.children.map((child) => transpileNode(child, context)).filter(child => Boolean(child));

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

  let tagName: string = startTag.name;

  if (hasImportedXMLNSTagName(startTag.name, context)) {  
    const [ns, templateName] = startTag.name.split(":");
    tagName = getNsPrefix(ns) + '-' + templateName;
  }

  if (context.templateNames[startTag.name]) {
    tagName = context.templateNames[startTag.name];
  }

  const declaration = createNodeDeclaration(`document.createElement("${tagName}")`, element || startTag, context);

  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];

    const value = attribute.value;

    if (value && value.type === PCExpressionType.BLOCK) {
      declaration.content += `${declaration.varName}.${camelCase(attribute.name)} = ${(value as PCBlock).value};\n;`
      declaration.content += transpileBinding(value as PCBlock, context, (statement) => `${declaration.varName}.${camelCase(attribute.name)} = ${statement}`)
    } else if (attribute.name.substr(0, 2) === "on") {
      declaration.content += `${declaration.varName}.${attribute.name.toLowerCase()} = ${(attribute.value as PCString).value};\n`
    } else {
      declaration.content += `${declaration.varName}.setAttribute("${attribute.name}", ${transpileAttributeValue(attribute)});\n`;
    }
  }
  
  return declaration;
};

const transpileSelfClosingElement = (element: PCSelfClosingElement, context: TranspileContext) => {
  if (element.name === "link") {
    return null;
  }
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
    case "component": {
      declaration = transpileComponent(node, context);
      break;
    }

    case "td-preview": {
      declaration = transpileTDPreview(node, context);
      break;
    }

    case "link": {
      
      // transpiled above
      return null;
    }
    case "repeat": {
      declaration = transpileRepeat(node, context);
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
  const path = getExpressionPath(node, context.root);

  const varName = getPCStyleID(node);

  let buffer = `
    var ${varName} = document.createElement("style");
  `;

  const textChild = node.children[0] as PCString;
  let cssSource = repeat("\n", textChild.location.start.line - 1) + context.source.substr(textChild.location.start.pos, textChild.location.end.pos - textChild.location.start.pos);
  
  const styleAST = parsePCStyle(cssSource);
  
  // if synthetic, then we're running FE code in tandem, so so we can
  // instantiate otherwise illegal constructors & attach useful information about them 
  buffer += `if (window.$synthetic) { \n`;
  const styleSheet = transpileStyleSheet(styleAST, { ...context, scope: undefined });
  buffer += styleSheet.content;
  buffer += `${varName}.$$setSheet(${styleSheet.varName});\n`;

  buffer += `} else { \n`;
  buffer += `${varName}.textContent = ${JSON.stringify(cssSource.trim())};\n`;
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

const prefixSelectorText = (rule: PCStyleRule, scope: string) => `[data-style-id=${scope}] ~ ${rule.selectorText.trim()}, [data-style-id=${scope}] ~ * ${rule.selectorText.trim()}`;

const transpileGroupingRule = (ast: PCGroupingRule, context: TranspileStyleContext): Declaration => {
  if (ast.type === PCStyleExpressionType.STYLE_RULE) {
    const styleRule = ast as PCStyleRule;

    const selectorText = context.scope ? prefixSelectorText(styleRule, context.scope) : styleRule.selectorText;

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
    objectBuffer += `"${property.name}": "${property.value.replace(/"/g, '\\"').replace(/[\s\r\n\t]+/g, " ")}", `;
  }
  
  objectBuffer += `}`;

  return `CSSStyleDeclaration.fromObject(${objectBuffer})`;
}

const transpileTemplateCall = (node: PCStartTag, context: TranspileContext, element?: PCElement, fnName?: string) => {

  let buffer = '';

  const attributeBuffer = node.attributes.map((attr) => (
    `"${attr.name}": ${transpileAttributeValue(attr)}`
  ));

  if (element && element.children.length > 0) {
    const childDeclarations = getTranspiledChildren(element, context);
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

const transpileRepeat = (node: PCElement, context: TranspileContext) => {
  const _each = getPCStartTagAttribute(node.startTag, "each");
  const _as = getPCStartTagAttribute(node.startTag, "as");

  const documentFragment = declareNode(`document.createDocumentFragment()`, context);

  const { varName: iVarName } = declare(`i`, undefined, context);
  const { varName: eachVarName, content: eachVarContent } = declare(`each`, _each, context);

  const { varName: nVarName, content: nContent } = declare(`n`, `${eachVarName}.length`, context);

  let buffer = "";
  buffer += documentFragment.content,
  buffer += eachVarContent;
  buffer += nContent;
  buffer += `for (var ${iVarName} = 0; ${iVarName} < ${nVarName}; ${iVarName}++) {
    var ${_as} = ${eachVarName}[${iVarName}];
    ${addNodeDeclarationChildren(documentFragment, node, context)}
  }`;

  documentFragment.content += buffer;
  
  return {
    varName: documentFragment.varName,
    content: buffer
  };
}

const transpileTDPreview = (node: PCElement, context: TranspileContext) => {
  const id = getPCStartTagAttribute(node, "id");
  const fragment = declareNode(`document.createDocumentFragment()`, context);
  fragment.content += addNodeDeclarationChildren(fragment, node, context);
  fragment.content += `${PREVIEWS_VAR}["${id || fragment.varName}"] = ${fragment.varName};\n`;
  return fragment;
};

const getPropertyId = (property: PCElement|PCSelfClosingElement) => {
  return getPCStartTagAttribute(property, "name") || getPCStartTagAttribute(property, "id");
};


const transpileComponent = (node: PCElement, context: TranspileContext) => {
  const id = getPCStartTagAttribute(node, "id");

  // TODO - unsafe code below -- assumes PC elements -- need to _cast_ as element type here
  const template = getPCASTElementsByTagName(node, "template")[0] as PCElement;
  const style = getPCASTElementsByTagName(node, "style")[0] as PCElement;
  const script = getPCASTElementsByTagName(node, "script")[0] as PCElement;

  const childrenWithIds = template && filterPCASTTree(template, (element) => {
    return (element.type === PCExpressionType.SELF_CLOSING_ELEMENT || element.type === PCExpressionType.ELEMENT) && hasPCStartTagAttribute(element as PCElement, "id");
  }) as PCElement[] || [];

  // TODO - use getPCASTStartTagsByTagName for safety
  const properties = getPCASTElementsByTagName(node, "property") as PCSelfClosingElement[];
  const shadowStartIndex = Boolean(style) ? 1 : 0;
  const jsFriendlyName = getJSFriendlyVarName(id);
  const className = getJSFriendlyVarName(id) + "_" + context.varCount++;

  const styleDeclaration = style && transpileStyleElement(style, { ...context, varCount: 0 });

  let buffer = `
    class ${className} extends HTMLElement {
      constructor() {
        super();
      }
    
      connectedCallback() {
        this.render();
      }

      ${
        childrenWithIds.map((child) => {
          const id = getPCStartTagAttribute(child, "id");
          const camelCaseId = camelCase(id);
          return `
            get ${camelCaseId}() {
              return this.shadowRoot.getElementById("${id}");
            }
          `
        }).join("")
      }

      ${
        properties.map((property) => {
          const name = getPropertyId(property);
          const camelCaseName = camelCase(name);
          return `
            get ${camelCaseName}() {
              return this.$$${camelCaseName};
            }
            set ${camelCaseName}(value) {
              this.$$${camelCaseName} = value;
              $$requestUpdate(this);
            }
          `;
        }).join("\n")
      }

      render() {
        if (this._rendered) {
          return;
        }
        this._rendered = true;
        const shadow = this.attachShadow({ mode: "open" });;
        ${style ? `${styleDeclaration.content}shadow.appendChild(${styleDeclaration.varName})` : ""}
        ${
          properties.map((property) => {
            const defaultValue = getPCStartTagAttribute(property, "default");
            const name = camelCase(getPropertyId(property));
            return `
              if (this.$$${name} == null) {
                this.$$${name} = ${defaultValue ? defaultValue : `this.getAttribute("${name}");`}
              }
            `;
          }).join("\n")
        }

        var ${BINDINGS_VAR} = this.${BINDINGS_VAR} = [];
        ${script ? (script.children[0] as PCString).value : "" }
        ${template ? addNodeDeclarationChildren({ varName: "shadow", content: "" }, template, {
          ...context,
          varCount: 0
        }) : ""}
      
      }

      static get observedAttributes() {
        return ${JSON.stringify(properties.map((property) => {
          return getPropertyId(property);
        }))};
      }

      attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
      }

      update() {
        if (!this._rendered) {
          return;
        }
        
        var bindings = this.${BINDINGS_VAR};
        for (var i = 0, n = bindings.length; i < n; i++) {
          bindings[i]();
        }
      }
    }

    customElements.define("${id}", ${className});
  `
  
  return {
    varName: className,
    content: buffer
  };
};

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
    declaration.content += addNodeDeclarationChildren(declaration, node, context);
  }
  return declaration;
};

const addNodeDeclarationChildren = (declaration: Declaration, node: PCElement, context: TranspileContext) => {
  let content = "";
  for (let i = 0, {length} = node.children; i < length; i++) {
    const child = node.children[i];
    const childDeclaration = transpileNode(child, context);
    if (!childDeclaration) continue;
    content += childDeclaration.content;
    content += callDeclarationProperty(declaration, "appendChild", childDeclaration.varName, context);
  }
  return content;
};

const transpileText = (node: PCString, context: TranspileContext) => createTextNodeDeclaration(`"${node.value.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`, node, context);

const transpileBinding = (block: PCBlock, context: TranspileContext, createStatment: (assignment: string) => string) => {
  const blockDecl = declareBlock(block.value, context);
  return `
  ${blockDecl.content}
  ${BINDINGS_VAR}.push(() => {
    var newValue = ${block.value};
    if (newValue !== ${blockDecl.varName}) {
      ${createStatment(`(${blockDecl.varName} = newValue)`)};
    }
  });\n`
};

const transpileTextBlock = (node: PCBlock, context: TranspileContext) => {
  const declaration = createTextNodeDeclaration(node.value, node, context);
  declaration.content = declaration.content;
  declaration.content += transpileBinding(node, context, (value) => `${declaration.varName}.nodeValue = ${value}`);
  return declaration;
}

const transpileChildBlock = (node: PCBlock, context: TranspileContext) => {

  // span must exist so that we can attach the source
  const fragmentDeclaration = createNodeDeclaration(`document.createElement("span")`, node, context);

  const iDeclaration = declare("i", undefined, context);
  const nDeclaration = declare("n", undefined, context);

  let buffer = `
    if (typeof ${node.value} !== "undefined") {
      for (var ${iDeclaration.varName} = 0, ${nDeclaration.varName} = ${node.value}.length; ${iDeclaration.varName} < ${nDeclaration.varName}; ${iDeclaration.varName}++) {
        ${fragmentDeclaration.varName}.appendChild(${node.value}[${iDeclaration.varName}]);
      }
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
const declareBlock = (assignment: string, context: TranspileContext) => declare("blockValue", assignment, context);

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

const callDeclarationProperty = (declaration: Declaration, propertyName: string, args: string, context: TranspileContext) => {
  return `${declaration.varName}.${propertyName}(${args});\n`;
};

const addDeclarationSourceReference = (declaration: Declaration, expression: PCExpression, context: TranspileContext) => {

  const buffer = JSON.stringify({
    uri: context.uri,
    fingerprint: md5(context.source),
    type: expression.type,
    ...expression.location,
  });

  addDeclarationProperty(declaration, "source", buffer, context);

  return declaration;
}