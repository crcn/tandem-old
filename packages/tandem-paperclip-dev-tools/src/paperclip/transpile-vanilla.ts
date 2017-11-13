// TODO - respect script & style types (allow for different languages)
import * as fs from "fs";
import * as md5 from "md5";
import * as path from "path";
import * as acorn from "acorn";
import * as estree from "estree";
import * as escodegen from "escodegen";
import { parse } from "./parser";
import { flatten, repeat, camelCase, snakeCase, uniq } from "lodash";
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
  getPCParent,
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
import { weakMemo } from "aerial-common2";

// const SOURCE_AST_VAR = "$$sourceAST";
const EXPORTS_VAR  = "exports";
const STYLES_VAR   = "$$styles";
const BINDINGS_VAR   = "$$bindings";
const PREVIEWS_VAR = "$$previews";

export enum SpecialPCTag {
  IF = "pc-if",
  ELSEIF = "pc-elseif",
  ELSE = "pc-else",
  REPEAT = "pc-repeat",
}

export type Transpiler = (source: string, uri: string, transpilers: { [identifier: string]: Transpiler }) => TranspileModuleResult;

type TranspileOptions = {
  assignTo?: string;
  readFileSync?: (filePath: string) => string;
  resolveFileSync?: (relativePath: string, base: string) => string;
  transpilers?: {
    [identifier: string]: Transpiler
  },
  moduleDirectories?: string[];
  extensions?: string[]
};

type TranspileContext = {
  source: string;
  varCount: number;
  uri: string;
  root: PCFragment;
  transpilers: {
    [identifier: string]: Transpiler
  }
  imports: string[];
  templateNames: {
    [identifier: string]: string
  }
} & TranspileOptions;

type TranspileStyleContext = {
  scope: string;
} & TranspileContext;

enum DeclarationType {
  TEMPLATE = "TEMPLATE",
  NODE = "NODE"
};

type Declaration = {
  varName: string;
  content: string;
  bindings: string[];
  type?: DeclarationType
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

export type TranspileModuleResult = {
  content: string;
  imports: string[];
};

/**
 * transpiles the PC AST to vanilla javascript with no frills
 */

 const getDefaultTranspilers = weakMemo((transpilers) => ({
    ...(transpilers || {}),
    pc: transpilePaperclipSource,
    js: transpileJSSource,
    "text/javascript": transpileJSSource
 }));

const getDefaultOptions = weakMemo((options): TranspileOptions => ({
  ...options,
  readFileSync: options.readFileSync || ((filePath) => fs.readFileSync(filePath, "utf8")),
  resolveFileSync: options.resolveFileSync || ((relativePath, base) => {
    const dirname = path.dirname(base.replace("file://", ""));
    const possibleModuleDirs = [dirname, ...(options.moduleDirectories || [])];
    const possibleBaseNames  = [relativePath, ...(options.extensions || []).map(ext => relativePath + ext)];

    const possiblePaths = possibleModuleDirs.reduce((a, b) => {
      return [...a, ...possibleBaseNames.map((baseName) => path.resolve(b, baseName))];
    }, []);

    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath) && fs.lstatSync(possiblePath).isFile()) {
        return "file://" + possiblePath;
      } else if (fs.existsSync(possiblePath + "/package.json")) {
        return path.resolve(possiblePath, JSON.parse(fs.readFileSync(possiblePath + "/package.json", "utf8")).main || "index.js");
      }
    }

    throw new Error(`Unable to resolve ${relativePath} from ${base}`);
  }),
  transpilers: getDefaultTranspilers(options.transpilers)
}))

export const transpilePCASTToVanillaJS = (source: string, uri: string, options: TranspileOptions = {}) => {
  return transpileBundle(source, uri, getDefaultOptions(options));
};

export const transpileBundle = (source: string, uri: string, options: TranspileOptions): TranspileResult => {
  
  let content = `(function(document) {
    function module(moduleImports, fn) {
      let exports;
      return function(modules) {
        return exports || (exports = fn(function(path) {
          return modules[moduleImports[path]](modules);
        }));
      };
    }\n

    let updating = false;
    let toUpdate = [];

    function stringifyStyle(style) {
      if (typeof style === "string") return style;
      let buffer = [];
      for (let key in style) {
        buffer.push(key + ":" + style[key] + ";");
      }
      return buffer.join("");
    }

    function setElementProperty(element, property, value) {
      if (property === "style") value = stringifyStyle(value);
      element[property] = value;
    }

    function $$waitUntilMounted(element) {
      return new Promise((resolve, reject) => {
        if (!window.$synthetic) return resolve();
        requestAnimationFrame(() => {
          if (window.renderer.clientRects[element.$id]) return resolve();
          $$waitUntilMounted(element).then(resolve);
        }); 
      })
    }
    
    function $$requestUpdate(object) {
      if (toUpdate.indexOf(object) === -1) {
        toUpdate.push(object);
      }
      if (updating) {
        return;
      }

      updating = true;
      requestAnimationFrame(function() {
        const rafLater = [];
        for(let i = 0; i < toUpdate.length; i++) {
          const target = toUpdate[i];

          // tiny check in the VM to see if bounding rect exists for target. If it doesn't
          // then rAF again until the target is visible
          if (target.nodeType != null && window.$synthetic && !window.renderer._rects[target.$id]) {
            rafLater.push(target);
            continue;
          }

          target.update();
        }
        toUpdate = [];
        updating = false;

        // request update again for elements that 
        // are not yet visible
        rafLater.forEach($$requestUpdate);
      });
    }
  `;
  content += `let noop = function(){}\n;`;
  content += `let modules = {\n`;

  const { warnings, errors, modules } = bundle(source, uri, undefined, options);

  
  for (const uri in modules) {
    content += `"${uri}": ${modules[uri].content},`
  };

  content += "}\n";
  content += `return {
    entry: modules["${uri}"](modules),
    modules: modules
  }`;
  content += `})(document);`

  if (options.assignTo) {
    content = `${options.assignTo} = ${content}`;
  }


  return {
    errors,
    content,
    warnings,
    allFiles: Object.keys(modules)
  };
};

const getResolvedPCImports = weakMemo((ast: PCExpression, uri: string) => getPCImports(ast).map((src) =>  "file://" + path.resolve(path.dirname(uri.replace("file://", "")), src)));

const bundle = weakMemo((source: string, uri: string, parentResult: BundleResult = { modules: {}, errors: [], warnings: []}, options: TranspileOptions): BundleResult => {
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
    const context = transpileModuleFn(source, uri, options.transpilers);
    const resolvedImports = {};

    for (const href of context.imports) {
      resolvedImports[href] =  options.resolveFileSync(href, uri);
    }

    result = {
      ...result,
      modules: {
        ...result.modules,
        [uri]: {    
          content: `module(${JSON.stringify(resolvedImports)}, ${context.content})`
        }
      }
    };

    for (const relativePath in resolvedImports) {
      const importFullPath = resolvedImports[relativePath];
      if (!result.modules[importFullPath]) {
        let content: string;
        try {
          content = options.readFileSync(importFullPath.replace("file://", ""));
        } catch(e) {
          throw new Error(`Unable to read file ${importFullPath}`);
        }
          
        result = bundle(
          content,
          importFullPath,
          result,
          options
        );
      }
    }


  } catch(e) {
    result = {
      ...result,
      errors: [...result.errors, e]
    }
  }
  

  return result;
});

const getNsPrefix = (ns: string) => `ns-${ns.replace(/\-/g, "_")}`;

const transpileModuleFn = weakMemo((source: string, uri: string, transpilers: { [identifier: string]: Transpiler }): TranspileModuleResult => {

  let buffer = "function(require) {\n";
  buffer += `let ${EXPORTS_VAR} = {};\n`;
  buffer += `let ${STYLES_VAR} = [];\n`;
  buffer += `let ${PREVIEWS_VAR} = {};\n`;
  buffer += `let ${BINDINGS_VAR} = [];\n`;

  const extension = uri.split(".").pop();
  const imports = [];

  
  const transpile = transpilers[extension];

  if (!transpile) {
    throw new Error(`Unable to find transpiler for ${extension}`);
  }

  const result = transpile(source, uri, transpilers);
  buffer += result.content;

  buffer += `${EXPORTS_VAR}.${STYLES_VAR} = ${STYLES_VAR};\n`;
  buffer += `${EXPORTS_VAR}.${PREVIEWS_VAR} = ${PREVIEWS_VAR};\n`;
  buffer += `return ${EXPORTS_VAR};\n`;
  buffer += `}\n`

  return {
    imports: result.imports, 
    content: buffer
  };
});

const transpilePaperclipSource = (source: string, uri: string, transpilers: any) => {

  const root = parse(source);

  const context: TranspileContext = {
    varCount: 0,
    source,
    uri,
    transpilers,
    root,
    imports: [],
    templateNames: {}
  };


  let buffer = '';

  const linkElements = getPCLinkStyleElements(root) as PCSelfClosingElement[];
  for (const link of linkElements) {
    const decl = transpileStartTag(link, context)
    buffer += decl.content;
    buffer += `${STYLES_VAR}.push(${decl.varName});\n`;
  }
  
  buffer += transpileChildren(root, context);

  return {
    content: buffer,
    imports: context.imports
  };
};

export const transpileJSSource = (source: string) => {
  // const ast = acorn.parse(source, {
  //   sourceType: "module"
  // });
  const imports = [];
  source = transpileJSImports(source, imports);
  source = transpileJSExports(source);
  return {
    content: source,
    imports,
  };
};  

const transpileJSImports = (source: string, allImports: string[]) => {

  // ast.body.forEach((expr) => {
  //   console.log(expr.type);
  //   // if (expr.type === "CallExpression") {
  //   // }
  //   // if (expr.type ===  "ImportDeclaration") {
  //   //   console.log("IMPP!");
  //   // }
  // });

  // TODO - need to use JS parser for this instead of regexp. This will break in cases
  // like strings, and comments
  const saferImportSource = source.replace(/\/\*[\s\S]*\*\//g, "");
  const imports = saferImportSource.match(/import.*?from.*?;/g) || [];
  
  for (const _import of imports) {
    const [match, decls, src] = _import.match(/import.*?\{(.*?)\}.*?from.*?['"](.*?)['"]/) || [null, null, null];
    if (!match) {
      continue;
    }

    if (src.indexOf("\\") !== -1) continue;

    allImports.push(src);
    source = _import.replace(_import, `
      const { ${decls.replace(/\s+as\s+/g, ":")} } = require("${src}");
    `);
  }

  const _requires = saferImportSource.match(/require\(.*?\)/g) || [];

  for (const _require of _requires) {
    const [match, src] = _require.match(/require\(['"](.*?)["']\)/);
    allImports.push(src);
  }
  

  return source;
}

const transpileJSExports = (source: string) => {
  const exports = source.match(/(export\s+\{.*?\})|(export\s*\w+\s*\w+)/g) || [];

  const exportVarRegexp = /export\s*\w+\s+(\w+)/;
  const exportDeclRegexp = /export\s+\{(.*?)\};?/;

  const _exports: string[] = [];

  for (const _export of exports) {
    if (exportDeclRegexp.test(_export)) {
      const [match, name] = _export.match(exportDeclRegexp);
      _exports.push(name.trim());
      source = source.replace(_export, "");
    } else if (exportVarRegexp.test(_export)) {
      const [match, name] = _export.match(exportVarRegexp);
      _exports.push(name.trim());
      source = source.replace(_export, _export.replace(/^export/, ""));
    }
  }

  for (const _name of _exports) {
    source += `
      ${EXPORTS_VAR}.${_name} = ${_name}
    `;
  }

  return source;
};

const hasSpecialAttribute = (startTag: PCStartTag) => {
  return hasPCStartTagAttribute(startTag, SpecialPCTag.IF) || hasPCStartTagAttribute(startTag, SpecialPCTag.ELSEIF) || hasPCStartTagAttribute(startTag, SpecialPCTag.ELSE) || hasPCStartTagAttribute(startTag, SpecialPCTag.REPEAT);
};

const transpileChildren = (parent: PCParent, context: TranspileContext) => getTranspiledChildren(parent, context).map(content => getTranspileContent(content)).join("\n");


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
    const name = attribute.name;

    if (value && value.type === PCExpressionType.BLOCK) {
      const attrName = camelCase(attribute.name);
      const bindingVarName = `${declaration.varName}$$${attrName}$$currentValue`;
      declaration.content += `
        let ${bindingVarName};
      `;
      declaration.bindings.push(transpileBinding(bindingVarName, value as PCBlock, context, (statement) => `setElementProperty(${declaration.varName}, "${camelCase(attribute.name)}", ${statement})`));
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
    return transpileLinkElement(element, context);
  }

  const declaration = transpileStartTag(element, context);

  return hasSpecialAttribute(element) ? transpileSpecialTags(element, declaration, context) : declaration;
}

const transpileBindingsCall = (bindingsVarName, args: string = '') => `
  for (let i = 0, n = ${bindingsVarName}.length; i < n; i++) {
    ${bindingsVarName}[i](${args});
  }
`

const transpileSpecialTags = (startTag: PCStartTag, declaration: Declaration, context: TranspileContext) => {

  let content = ``;

  let newDeclaration: Declaration = declaration;

  if (hasPCStartTagAttribute(startTag, SpecialPCTag.REPEAT)) {
    const [each, token, eachAs] = getPCStartTagAttribute(startTag, SpecialPCTag.REPEAT).split(/\s+/g);
    
    // newDeclaration = declareNode(`document.createTextNode("")`, context);
    const { fragment, start, end } = declareVirtualFragment(context);
    newDeclaration = fragment;
    const currentValueVarName = newDeclaration.varName + "$$currentValue";
    const childBindingsVarName = newDeclaration.varName + "$$childBindings";
    newDeclaration.content += `
      let ${currentValueVarName} = [];
      let ${childBindingsVarName} = [];
    `;

    newDeclaration.bindings.push(`
      let newValue = (${each}) || [];
      if (newValue === ${currentValueVarName}) {
        return;
      }
      const oldValue = ${currentValueVarName};
      ${currentValueVarName} = newValue;
    
      for (let i = 0, n = Math.min(oldValue.length, newValue.length); i < n; i++) {
        ${childBindingsVarName}[i](newValue[i]);
      }

      const parent = ${start.varName}.parentNode;
      const startIndex = Array.prototype.indexOf.call(parent.childNodes, ${start.varName});

      if (newValue.length > oldValue.length) {
        for (let i = oldValue.length; i < newValue.length; i++) {
          const ${eachAs} = newValue[i];
          const ni = startIndex + i;
          ${declaration.content}
          if (ni >= parent.childNodes.length) {
            parent.appendChild(${declaration.varName});
          } else {
            parent.insertBefore(${declaration.varName}, parent.childNodes[ni]);
          }
          
          const bindings = [${declaration.bindings.map((binding) => (`(${eachAs}) => {
            ${binding}
          }`)).join(",")}];

          // initial trigger
          bindings.forEach((binding) => binding(${eachAs}));

          ${childBindingsVarName}.push((newValue) => {
            ${transpileBindingsCall("bindings", "newValue")}
          });
        }
      } else if (oldValue.length < newValue.length) {
        // TODO
      }
    `);

    declaration = newDeclaration;
  }

  if (hasPCStartTagAttribute(startTag, SpecialPCTag.IF) || hasPCStartTagAttribute(startTag, SpecialPCTag.ELSE) || hasPCStartTagAttribute(startTag, SpecialPCTag.ELSEIF)) {
  
    
    const siblings = getPCParent(context.root, startTag).children;
    
    const index = siblings.findIndex((sibling) => {
      return sibling === startTag || (startTag.type === PCExpressionType.START_TAG && sibling.type === PCExpressionType.ELEMENT && (sibling as PCElement).startTag === startTag)
    });

    let conditionBlockVarName;

    for (let i = index + 1; i--;) {
      const sibling = siblings[i] as PCElement;
      if (getPCStartTagAttribute(sibling, SpecialPCTag.IF)) {
        conditionBlockVarName = "condition_" + md5(getExpressionPath(sibling, context.root).join(""));
        break;
      }
    }

    const condition = getPCStartTagAttribute(startTag, SpecialPCTag.IF) || getPCStartTagAttribute(startTag, SpecialPCTag.ELSE) || getPCStartTagAttribute(startTag, SpecialPCTag.ELSEIF);

    const { fragment, start, end } = declareVirtualFragment(context);
    newDeclaration = fragment;
    const bindingsVarName = newDeclaration.varName + "$$bindings";
    const currentValueVarName = newDeclaration.varName + "$$currentValue";

    fragment.content += `
      let ${bindingsVarName} = [];
      let ${currentValueVarName} = false;

    `;

    if (hasPCStartTagAttribute(startTag, SpecialPCTag.IF)) {
      fragment.content += `
        let ${conditionBlockVarName} = Infinity;
      `;
    }

    newDeclaration.bindings.push(`
      const newValue = Boolean(${condition || "true"}) && ${conditionBlockVarName} >= ${index};

      if (newValue) {
        ${conditionBlockVarName} = ${index};

      // give it up for other conditions
      } else if (${conditionBlockVarName} === ${index}) {
        ${conditionBlockVarName} = Infinity;
      }
        
      if (newValue && newValue === ${currentValueVarName}) {
        if (${currentValueVarName}) {
          ${transpileBindingsCall(bindingsVarName)}
        }
        return;
      }

      ${currentValueVarName} = newValue;
      ${bindingsVarName} = [];

      if (newValue) {
        const elementFragment = document.createDocumentFragment();
        ${getTranspileContent(declaration, bindingsVarName)}
        elementFragment.appendChild(${declaration.varName});
        ${end.varName}.parentNode.insertBefore(elementFragment, ${end.varName});
      } else {
        let curr = ${start.varName}.nextSibling;
        while(curr !== ${end.varName}) {
          curr.parentNode.removeChild(curr);
          curr = ${start.varName}.nextSibling;
        }
      }
    `);

  }

  return newDeclaration;
};

const declareVirtualFragment = (context: TranspileContext) => {
  const fragment = declareNode(`document.createDocumentFragment("")`, context);
  const start = declareNode(`document.createTextNode("")`, context);
  const end = declareNode(`document.createTextNode("")`, context);

  fragment.content += `
  ${start.content}
  ${end.content}
  ${fragment.varName}.appendChild(${start.varName});
  ${fragment.varName}.appendChild(${end.varName});
  `;

  return {
    fragment,
    start, 
    end
  };
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
};

const transpileElement = (node: PCElement, context: TranspileContext) => {

  let declaration: Declaration;
  switch(node.startTag.name) {
    case "paperclip": 
    case "root":
    case "module": {
      declaration = {
        varName: null,
        bindings: [],
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

    case "script": {
      declaration = transpileScriptElement(node, context);
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

  return hasSpecialAttribute(node.startTag) ? transpileSpecialTags(node.startTag, declaration, context) : declaration;
};

const transpileScriptElement = (node: PCElement, context: TranspileContext) => {

  // TODO - support reading files here
  const textChild = node.children[0] as PCString;
  const jsSource = transpileScript(context.source.substr(textChild.location.start.pos, textChild.location.end.pos - textChild.location.start.pos), context);

  const scriptDecl = createNodeDeclaration(`document.createElement("script")`, node, context);
  scriptDecl.content += `${scriptDecl.varName}.appendChild(document.createTextNode(${JSON.stringify(jsSource)}));\n`;
  
  return scriptDecl;
}

const transpileScript = (source: string, context: TranspileContext) => {
  const result = transpileJSSource(source);
  context.imports.push(...result.imports);
  return result.content;
};


const transpileLinkElement = (node: PCSelfClosingElement, context: TranspileContext) => {
  const href = getPCStartTagAttribute(node, "href");
  context.imports.push(href);
  const srcDecl = declare("dep", `require("${href}")`, context);
  srcDecl.content += `${STYLES_VAR} = ${STYLES_VAR}.concat(${srcDecl.varName}.${STYLES_VAR});\n`;
  return srcDecl;
};

// TODO - eventually need to put these style elements within the global context, or check if they've already
// been registered. Otherwise they'll pollute the CSSOM when used repeatedly. 
const transpileStyleElement = (node: PCElement, context: TranspileContext) => {
  const path = getExpressionPath(node, context.root);

  const varName = getPCStyleID(node) + "_" + context.varCount++;

  let buffer = `
    let ${varName} = document.createElement("style");
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
    bindings: [],
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

const transpileTDPreview = (node: PCElement, context: TranspileContext) => {
  const id = getPCStartTagAttribute(node, "id");
  const fragment = declareNode(`document.createDocumentFragment()`, context);
  fragment.content += getTranspiledChildren(node, context).map((decl) => (`
    ${getTranspileContent(decl)}
    ${fragment.varName}.appendChild(${decl.varName});
  `)).join("");
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

  let scriptContent: string = "";

  if (script) {
    const scriptTranspiler = context.transpilers[getPCStartTagAttribute(script, "type")] || context.transpilers["text/javascript"];
    if (!scriptTranspiler) {
      throw new Error(`Unable to find script transpiler for ${getPCStartTagAttribute(script, "type")}`);
    }
    const result = scriptTranspiler((script.children[0] as PCString).value, context.uri, context.transpilers);
    context.imports.push(...result.imports);
    scriptContent = result.content;
  }
  


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
        this.${BINDINGS_VAR} = [];
      }

      connectedCallback() {
        this.render();
        
        $$waitUntilMounted(this).then(() => {
          this.didMount();
        });
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
              if (this.$$${camelCaseName} === value) {
                return;
              }
              const oldValue = this.$${camelCaseName};
              this.$$${camelCaseName} = value;
              this.propertyChangedCallback("${camelCaseName}", oldValue, value);
              if (this._rendered) {
                $$requestUpdate(this);
              }
            }
          `;
        }).join("\n")
      }

      propertyChangedCallback(name, oldValue, newValue) {

      }

      render() {
        if (this._rendered) {
          return;
        }
        this._rendered = true;
        const shadow = this.attachShadow({ mode: "open" });
        ${style ? `${styleDeclaration.content}shadow.appendChild(${styleDeclaration.varName});` : ""}
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

        let ${BINDINGS_VAR} = this.${BINDINGS_VAR} = [];
        ${scriptContent}
        ${template ? getTranspiledChildren(template, {
          ...context,
          varCount: 0
        }).map(decl => (`
          ${getTranspileContent(decl, BINDINGS_VAR)}
          shadow.appendChild(${decl.varName});
        `)).join("") : ""}
      }

      cloneShallow() {
        const clone = super.cloneShallow();

        // for tandem only
        clone._rendered = true;
        return clone;
      }

      static get observedAttributes() {
        return ${JSON.stringify(uniq(properties.map((property) => {
          return getPropertyId(property);
        })))};
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (super.attributeChangedCallback) {
          super.attributeChangedCallback(name, oldValue, newValue);
        }
        this[name] = newValue;
      }

      didMount() {
        // override me
      }

      didUpdate() {
        // override me
      }

      update() {
        if (!this._rendered) {
          return;
        }
        
        let bindings = this.${BINDINGS_VAR} || [];
        ${transpileBindingsCall("bindings")}

        this.didUpdate();
      }
    }

    customElements.define("${id}", ${className});
  `
  
  return {
    varName: className,
    bindings: [],
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
    for(const decl of addNodeDeclarationChildren(declaration, node, context)) {
      declaration.content += decl.content;
      declaration.bindings.push(...decl.bindings);
    }
  }

  return declaration;
};

const addNodeDeclarationChildren = (declaration: Declaration, node: PCElement, context: TranspileContext): Declaration[] => {
  const declarations = [];
  
  for (let i = 0, {length} = node.children; i < length; i++) {
    const child = node.children[i];
    const childDeclaration = transpileNode(child, context);
    if (!childDeclaration) continue;
    childDeclaration.content += callDeclarationProperty(declaration, "appendChild", childDeclaration.varName, context);
    declarations.push(childDeclaration);
  }
  
  return declarations;
};

const transpileText = (node: PCString, context: TranspileContext) => {
  if (/^[\s\r\n\t]+$/.test(node.value)) {
    return null;
  }
  return createTextNodeDeclaration(`"${node.value.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`, node, context);
}

const transpileBinding = (bindingVarName: string, block: PCBlock, context: TranspileContext, createStatment: (assignment: string) => string) => {

  return `
    let $$newValue = ${block.value};
    if ($$newValue !== ${bindingVarName}) {
      ${createStatment(`${bindingVarName} = $$newValue`)}
    }
  `;
};

const transpileTextBlock = (node: PCBlock, context: TranspileContext) => {
  const declaration = createTextNodeDeclaration(node.value, node, context);
  const bindingVarName = declaration.varName + "$$currentValue";
  declaration.content += `
    let ${bindingVarName} = ${node.value};
  `
  declaration.bindings = [
    transpileBinding(bindingVarName, node, context, (value) => `${declaration.varName}.nodeValue = ${value}`)
  ];
  return declaration;
}

const transpileChildBlock = (node: PCBlock, context: TranspileContext) => {

  // span must exist so that we can attach the source
  const fragmentDeclaration = createNodeDeclaration(`document.createElement("span")`, node, context);

  const iDeclaration = declare("i", undefined, context);
  const nDeclaration = declare("n", undefined, context);

  let buffer = `
    if (typeof ${node.value} !== "undefined") {
      for (let ${iDeclaration.varName} = 0, ${nDeclaration.varName} = ${node.value}.length; ${iDeclaration.varName} < ${nDeclaration.varName}; ${iDeclaration.varName}++) {
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

const getTranspileContent = (result: Declaration | string, bindingsVarName = BINDINGS_VAR) => typeof result === "string" ? result : [result.content, ...result.bindings.map((binding) => (
  `${bindingsVarName}.push((() => { const binding = () => { ${binding} }; binding(); return binding; })());`
))].join("\n");

const declareNode = (assignment: string, context: TranspileContext) => declare("node", assignment, context);
const declareBlock = (assignment: string, context: TranspileContext) => declare("blockValue", assignment, context);

const declare = (baseName: string, assignment: string, context: TranspileContext): Declaration => {
  const varName = `${baseName}_${context.varCount++}`;
  return {
    varName,
    bindings: [],
    content: assignment ? `let ${varName} = ${assignment};\n` : `let ${varName};\n`
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