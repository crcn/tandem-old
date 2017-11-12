import { PCExpression, PCExpressionType, PCTextNode, PCFragment, PCElement, PCSelfClosingElement, PCStartTag, PCEndTag, BKEcho, BKRepeat, PCString, PCStringBlock, PCBlock, BKElse, BKElseIf, BKReference } from "./ast";
import { PaperclipTargetType } from "./constants";
import { parsePaperclipSource } from "./parser";
import { PaperclipTranspileResult } from "./transpiler";

export type IO = {
  readFile: (path) => Promise<any>
  resolveFile: (relativePath, fromPath) => Promise<any>
};

export type PaperclipToVanillaOptions = {
  target: PaperclipTargetType,
  io?: IO
};

type TranspileContext = {
  varCount: number;
};

type Modules = {
  [identifier: string]: PCExpression
};

export type TranspileDeclaration = {
  varName: string;
  code: string;
  bindings: string[];
};

export const paperclipToVanilla = async (uri: string, options: PaperclipToVanillaOptions): Promise<PaperclipTranspileResult> => ({
  code: transpileBundle(uri, await resolveModules(uri, options))
});

const resolveModules = async (uri: string, options: PaperclipToVanillaOptions, modules: Modules = {}) => {
  // TODO - scan for deps 
  modules[uri] =  parsePaperclipSource(await options.io.readFile(uri));

  return modules;
};

const getJSFriendlyName = (name: string) => name.replace(/[\d-]+/g, "_");

const transpileBundle = (entryUri: string, modules: Modules) => {
  
  // TODO - resolve dependencies

  let content = `((window) => {`;

  content += `

    const document = window.document;

    const $$defineModule = (deps, run) => {
      let exports;
      return () => {
        if (exports) return exports;

        // guard from recursive dependencies
        exports = {};
        return exports = run((dep) => $$modules[deps[dep]]());
      }
    }
  `;

  content += "$$modules = {};\n";

  for (const uri in modules) {
    content += `$$modules["${uri}"] = ${transpileModule(modules[uri])};\n`;
  }

  content += ` return {
    entryPath: "${entryUri}",
    modules: $$modules
  };
  `
  
  content += `})(window)`;

  console.log(content);

  return content;
};

const transpileModule = (root: PCExpression) => {

  const context = {
    varCount: 0
  };

  // TODO - include deps here
  let content = `$$defineModule({}, (require) => {\n`;
  content += `$$strays = [];\n`;

  const childNodes = root.type === PCExpressionType.FRAGMENT ? (root as PCFragment).childNodes : [root];
  
  for (let i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];
    const decl = transpileExpression(child, context);
    if (!decl) continue;
    content += decl.content;
    content += decl.bindings.map(wrapTranspiledStatement).join("\n");
    content += `if (${decl.varName}.nodeType != null) {\n`;
    content += `  $$strays.push(${decl.varName});\n`;
    content += `}\n;`
  }

  content += `return {
    strays: $$strays
  };`;
    
  content += `})`;

  return content;
}

const wrapTranspiledStatement = (statement) => `(() => {${statement}} )();\n`;

const transpileExpression = (ast: PCExpression, context: TranspileContext) => {
  switch(ast.type) {
    case PCExpressionType.FRAGMENT: return transpileFragment(ast, context);
    case PCExpressionType.TEXT_NODE: return transpileTextNode(ast as PCTextNode, context);
    case PCExpressionType.BLOCK: return transpileTextBlock(ast as PCBlock, context);
    case PCExpressionType.ELEMENT: return transpileElement(ast as PCElement, context);
    case PCExpressionType.SELF_CLOSING_ELEMENT: return transpileSelfClosingElement(ast as PCSelfClosingElement, context);
  }
  return null;
}

const transpileExpressions = (asts: PCExpression[], context: TranspileContext) => asts.map((ast) => transpileExpression(ast, context));

const transpileFragment = (ast: PCExpression, context: TranspileContext) => {
  const fragment = declareNode(`document.createDocumentFragment("")`, context);

  // TODO
  return fragment;
};

const transpileTextNode = (ast: PCTextNode, context: TranspileContext) => {
  return declareNode(`document.createTextNode(${JSON.stringify(ast.value)})`, context);
};

const transpileTextBlock = (ast: PCBlock, context: TranspileContext) => {
  const node = declareNode(`document.createTextNode("")`, context);
  const bindingVarName = `${node.varName}$$currentValue`;
  node.content += `let ${bindingVarName};`;
  node.bindings.push(transpileBinding(bindingVarName, (((ast as PCBlock).value as BKEcho).value as BKReference).value, assignment => `${node.varName}.nodeValue = ${assignment}`, context));
  return node;
};

const transpileSelfClosingElement = (ast: PCSelfClosingElement, context: TranspileContext) => {
  return transpileStartTag(ast, context);
};

const transpileStartTag = (ast: PCStartTag, context: TranspileContext) => {
  const element = declareNode(`document.createElement("${ast.name}")`, context);

  for (let i = 0, {length} = ast.attributes; i < length; i++) {
    const { name, value } = ast.attributes[i];
    const propName = getJSFriendlyName(name);
    if (!value) {
      element.content += `${element.varName}.${name} = true;\n`;
    } else if (value.type === PCExpressionType.STRING) {
      const string = value as PCString;
      element.content += `${element.varName}.setAttribute("${name}", ${JSON.stringify(string.value)});\n`;
    } else if (value.type === PCExpressionType.STRING_BLOCK || value.type === PCExpressionType.BLOCK) {

      // TODO - check for [[on ]]

      const bindingVarName = `${element.varName}$$${propName}$$currentValue`;

      element.content += `let ${bindingVarName};\n`;

      let binding: string;

      if (value.type === PCExpressionType.STRING_BLOCK) {
        const stringBlock = value as PCStringBlock;
        binding = transpileBinding(bindingVarName, stringBlock.values.map((value) => {
          if (value.type === PCExpressionType.BLOCK) {

            // todo - assert echo here
            return (((value as PCBlock).value as BKEcho).value as BKReference).value;
          } else {
            return JSON.stringify((value as PCString).value);
          }
        }).join(" + "), (assignment) => (
          `${element.varName}.setAttribute("${name}", ${assignment})`
        ), context);
      } else {
        binding = transpileBinding(bindingVarName, (((value as PCBlock).value as BKEcho).value as BKReference).value, (assignment) => `${element.varName}.${propName} = ${assignment}`, context);
      }

      element.bindings.push(binding);
    }
  }

  console.log(element.bindings);

  return element;
};

const transpileBinding = (bindingVarName: string, assignment: string, createStatment: (assignment: string) => string, context: TranspileContext) => {
  
  return `
    let $$newValue = ${assignment};
    if ($$newValue !== ${bindingVarName}) {
      ${createStatment(`${bindingVarName} = $$newValue`)}
    }
  `;
};

const transpileElement = (ast: PCElement, context: TranspileContext) => {
  switch(ast.startTag.name) {

    // TODO
    case "component": return null;
    default: return transpileNativeElement(ast, context);
  }
}

const transpileNativeElement = (ast: PCElement, context: TranspileContext) => {
  const element = transpileStartTag(ast.startTag, context);
  for (let i = 0, {length} = ast.childNodes; i < length; i++) {
    const child = transpileExpression(ast.childNodes[i], context);
    if (!child) continue;
    element.content += child.content;
    element.content += `${element.varName}.appendChild(${child.varName});\n`;
    element.bindings.push(...child.bindings);
  }
  return element;
}

const declare = (baseName: string, assignment: string, context: TranspileContext) => {
  const varName = `${baseName}_${context.varCount++}`;
  return {
    varName,
    bindings: [],
    content: assignment ? `let ${varName} = ${assignment};\n` : `let ${varName};\n`
  };
};

const declareNode = (assignment: string, context: TranspileContext) => declare("node", assignment, context);