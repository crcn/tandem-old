// TODO - emit warnings for elements that have invalid IDs

import { PCExpression, PCExpressionType, PCTextNode, PCFragment, PCElement, PCSelfClosingElement, PCStartTag, PCEndTag, BKBind, BKRepeat, PCString, PCStringBlock, PCBlock, BKElse, BKElseIf, BKReference, BKReservedKeyword, BKGroup, BKExpression, BKExpressionType, BKIf, isTag, getPCParent, PCParent, getExpressionPath, getPCElementModifier, BKNot, BKOperation } from "./ast";
import { loadModuleAST, Module, Template, Style, Import, Component, IO, loadModuleDependencyGraph } from "./loader";
import { PaperclipTargetType } from "./constants";
import { parseModuleSource } from "./parser";
import { PaperclipTranspileResult } from "./transpiler";


export type bundleVanillaOptions = {
  target: PaperclipTargetType,
  io?: IO
};

type TranspileContext = {
  contextName?: string;
  varCount: number;
  root: PCExpression;
};

type Modules = {
  [identifier: string]: Module
};

export type TranspileDeclaration = {
  varName: string;
  content: string;
  bindings: string[];
};


export const bundleVanilla = (uri: string, options: bundleVanillaOptions): Promise<PaperclipTranspileResult> => loadModuleDependencyGraph(uri, options.io).then((modules) => ({
  code: transpileBundle(uri, modules)
}));

// usable in other transpilers
export const transpileBlockExpression = (expr: BKExpression) => {
  switch(expr.type) {
    case BKExpressionType.NOT: return "!" + transpileBlockExpression((expr as BKNot).value);
    case BKExpressionType.REFERENCE: {
      const name = (expr as BKReference).value;
      return name;
    }
    case BKExpressionType.GROUP: return `(${transpileBlockExpression((expr as BKGroup).value)})`;
    case BKExpressionType.RESERVED_KEYWORD: return (expr as BKReservedKeyword).value;
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;
      return `${transpileBlockExpression(left)} ${operator} ${transpileBlockExpression(right)}`
    }
    default: {
      throw new Error(`Unable to transpile BK block ${expr.type}`);
    }
  }
};

const getJSFriendlyName = (name: string) => name.replace(/[\d-]+/g, "_");

const transpileBundle = (entryUri: string, modules: Modules) => {
  
  // TODO - resolve dependencies

  let content = `((window) => {`;

  content += `` +

    `const document = window.document;` +

    `const $$each = (object, iterator) => {` +
      `if (Array.isArray(object)) {` +
        `object.forEach(iterator);` +
      `} else {` +
        `for (const key in object) {` +
          `iterator(object[key], key);` +
        `}` +
      `}` +
    `};` +

    `const $$count = (object) => {` +
      `return Array.isArray(object) ? object.length : Object.keys(object).length;` +
    `};` +

    `const $$defineModule = (deps, run) => {` +
      `let exports;` +
      `return () => {` +
        `if (exports) return exports;` +

        // guard from recursive dependencies
        `exports = {};` +
        `return exports = run((dep) => $$modules[deps[dep]]());` +
      `}` +
    `};` +

    `let updating = false;` +
    `let toUpdate = [];` +
    
    `const $$requestUpdate = (object) => {` +
      `if (toUpdate.indexOf(object) === -1) {` +
        `toUpdate.push(object);` +
      `}` +
      `if (updating) {` +
        `return;` +
      `}` +

      `updating = true;` +
      `requestAnimationFrame(function() {` +
        `for(let i = 0; i < toUpdate.length; i++) {` +
          `const target = toUpdate[i];` +
          `target.update();` +
        `}` +
        `toUpdate = [];` +
        `updating = false;` +
      `});` +
    `};`;


  content += "$$modules = {};";

  for (const uri in modules) {
    content += `$$modules["${uri}"] = ${transpileModule(modules[uri])};`;
  }

  content += `const entry = $$modules["${entryUri}"]();`

  content += `return {` +
      `entry,` + 
      `modules: $$modules` +
    `};` +  
  `})(window)`;

  // console.log(content);

  return content;
};

const transpileModule = ({ source, imports, globalStyles, components, unhandledExpressions }: Module) => {

  const context: TranspileContext = {
    varCount: 0,
    root: source
  };

  // TODO - include deps here
  let content = `$$defineModule({}, (require) => {`;
  content += `$$strays = [];`;

  const childDecls = transpileChildNodes(unhandledExpressions, context);
  
  for (let i = 0, {length} = childDecls; i < length; i++) {
    const decl = childDecls[i];
    content += decl.content;
    content += decl.bindings.map(wrapTranspiledStatement).join("\n");
    content += `if (${decl.varName}.nodeType != null) {\n`;
    content += `  $$strays.push(${decl.varName});\n`;
    content += `}\n;`
  }

  for (let i = 0, {length} = components; i < length; i++) {
    content += tranpsileComponent(components[i], context).content;
  }

  content += `return {` +
    `strays: $$strays` +
  `};`;
    
  content += `})`;

  return content;
}

const wrapTranspiledStatement = (statement) => `(() => {${statement}} )();\n`;
const wrapAndCallBinding = (binding) => `(() => { const binding = () => { ${binding} }; binding(); return binding; })()`;

const tranpsileComponent = ({ id, style, template, properties }: Component, context: TranspileContext) => {
  const varName = createVarName(getJSFriendlyName(id), context);

  const templateContext: TranspileContext = {
    ...context,
    varCount: 0,
    contextName: "this"
  };


  let content = `` +
    `class ${varName} extends HTMLElement {` +
      `constructor() {` +
        `super();` +
        `this.$$bindings = [];` +
      `}` +

      `connectedCallback() {` +
        `this.render();` +
      `}` +

      properties.map(({ name }) => {
        return `` +
          `get ${name}() {` +
            `return this.$$${name};` +
          `}` +
          `set ${name}(value) {` +
            `if (this.$$${name} === value) {` +
              `return;` +
            `}` +
            `const oldValue = this.$${name};` +
            `this.$$${name} = value;` +
            `if (this._rendered) {` +
              `$$requestUpdate(this);` +
            `}` +
          `}`

      }).join("\n") +

      `render() {` +
        `if (this._rendered) {` +
          `return;` +
        `}` +
        `this._rendered = true;` +
        `const shadow = this.attachShadow({ mode: "open" });` +

        properties.map(({name, defaultValue}) => (
          `if (this.$$${name} == null) {` +
            `this.$$${name} = ${defaultValue ? defaultValue : `this.getAttribute("${name}");`}` +
          `}`
        )).join("\n") +


        `let $$bindings = [];` +
        
        (template ? template.content.map(node => {
          const decl = transpileExpression(node, templateContext);
          if (!node) {
            return "";
          }
          return (
            `${decl.content}` +
            (decl.bindings.length ? `$$bindings = $$bindings.concat(${decl.bindings.map(binding => `(() => {` + 
              `const $$binding = () => {` +
                `const { ${ properties.map(({name}) => name).join(",") } } = this;` +
                binding + 
              `};` +
              `$$binding();` + 
              `return $$binding;` +
            `})()`)});` : ``) +
            `shadow.appendChild(${decl.varName});`
          );
        }).join("") : "") +

        `this.$$bindings = $$bindings;` +
      `}` +

      `cloneShallow() {` +
        `const clone = super.cloneShallow();` +

        // for tandem only
        `clone._rendered = true;` +
        `return clone;` +
      `}` +

      `static get observedAttributes() {` +
        `return ${JSON.stringify(properties.map(({name}) => name))};` +
      `}` +

      `attributeChangedCallback(name, oldValue, newValue) {` +
        `if (super.attributeChangedCallback) {` +
          `super.attributeChangedCallback(name, oldValue, newValue);` +
        `}` +
        `this[name] = newValue;` +
      `}` +

      `update() {` +
        `if (!this._rendered) {` +
          `return;` +
        `}` +
        
        `let bindings = this.$$bindings || [];` +
        transpileBindingsCall("bindings") +
      `}` +
    `}` +

    `customElements.define("${id}", ${varName});`
  
  return {
    varName,
    bindings: [],
    content
  };
};

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
  // create text node without excess whitespace (doesn't get rendered)
  return declareNode(`document.createTextNode(${JSON.stringify(ast.value.replace(/[\s\r\n\t]+/g, " "))})`, context);
};

const transpileTextBlock = (ast: PCBlock, context: TranspileContext) => {
  const node = declareNode(`document.createTextNode("")`, context);
  const bindingVarName = `${node.varName}$$currentValue`;
  node.content += `let ${bindingVarName};`;
  node.bindings.push(transpileBinding(bindingVarName, transpileBlockExpression(((ast as PCBlock).value as BKBind).value), assignment => `${node.varName}.nodeValue = ${assignment}`, context));
  return node;
};

const transpileSelfClosingElement = (ast: PCSelfClosingElement, context: TranspileContext) => {
  return transpileElementModifiers(ast, transpileStartTag(ast, context), context);
};

const transpileElementModifiers = (startTag: PCStartTag, decl: TranspileDeclaration, context: TranspileContext) => {
  if (!startTag.modifiers.length) {
    return decl;
  }
  const { modifiers } = startTag;

  let newDeclaration: TranspileDeclaration = decl;

  let _if: BKIf;
  let _else: BKElse;
  let _elseif: BKElseIf;
  let _repeat: BKRepeat;
  

  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i].value;
    if (modifier.type === BKExpressionType.IF) {
      _if = modifier as BKIf;
    } else if (modifier.type === BKExpressionType.ELSE) {
      _else = modifier as BKElse;
    } else if (modifier.type === BKExpressionType.ELSEIF) {
      _elseif = modifier as BKElseIf;
    } else if (modifier.type === BKExpressionType.REPEAT) {
      _repeat = modifier as BKRepeat;
    }
  }

  // todo - eventually want to get TYPE of each declaration
  // here so that transpiling can be done for objects, or arrays.
  if (_repeat) {
    const {each: { value: each }, asKey: { value: asKey } = { value: "index" }, asValue: { value: asValue }} = _repeat;

    // newDeclaration = declareNode(`document.createTextNode("")`, context);
    const { fragment, start, end } = declareVirtualFragment(context);
    newDeclaration = fragment;
    const currentValueVarName = newDeclaration.varName + "$$currentValue";
    const childBindingsVarName = newDeclaration.varName + "$$childBindings";
    newDeclaration.content += (
      `let ${currentValueVarName} = [];` +
      `let ${childBindingsVarName} = [];` 
    );

    newDeclaration.bindings.push(`` +
      `let $$newValue = (${each}) || [];` +
      `if ($$newValue === ${currentValueVarName}) {` +
        `return;` +
      `}` +
      `const $$oldValue = ${currentValueVarName};` +
      `${currentValueVarName} = $$newValue;` +

      `const $$parent = ${start.varName}.parentNode;` +
      `const $$startIndex = Array.prototype.indexOf.call($$parent.childNodes, ${start.varName}); ` +

      // insert
      `const $$newValueCount = $$count($$newValue);` +
      `const $$oldValueCount = $$count($$oldValue);` +

      `if ($$newValueCount > $$oldValueCount) {` +
        `for (let $$i = $$newValueCount - $$oldValueCount; $$i--;) {` +
          decl.content +
          `$$parent.insertBefore(${decl.varName}, ${end.varName});` +
          `const $$bindings = [${decl.bindings.map((binding) => (`(${asValue}, ${asKey}) => { ` +
            binding +
          `}`)).join(",")}];` + 

          `${childBindingsVarName}.push(($$newValue, $$newKey) => {` +
            `${transpileBindingsCall("$$bindings", "$$newValue, $$newKey")}` +
          `});` +
        `}` +

      // delete
      `} else if ($$oldValue.length < $$newValue.length) {` +
        // TODO
      `}` +

      `let i = 0;` +
      // update
      `$$each($$newValue, (value, k) => {` +
        `${childBindingsVarName}[i++](value, k);` +
      `});`
    );

    decl = newDeclaration;
  } 
  
  // conditions must come after repeat
  if (_if || _elseif || _else) {

    const { condition } = (_if || _elseif || _else) as BKIf;
    
    const siblings = context.root === startTag || (context.root as PCElement).startTag === startTag  ? [context.root] : getPCParent(context.root as PCParent, startTag).childNodes;
    
    const index = siblings.findIndex((sibling) => {
      return sibling === startTag || (startTag.type === PCExpressionType.START_TAG && sibling.type === PCExpressionType.ELEMENT && (sibling as PCElement).startTag === startTag)
    });

    let conditionBlockVarName;

    for (let i = index + 1; i--;) {
      const sibling = siblings[i] as PCElement;
      if (getPCElementModifier(sibling, BKExpressionType.IF)) {
        conditionBlockVarName = "condition_" + getExpressionPath(sibling, context.root).join("");
        break;
      }
    }

    const { fragment, start, end } = declareVirtualFragment(context);
    newDeclaration = fragment;
    const bindingsVarName = newDeclaration.varName + "$$bindings";
    const currentValueVarName = newDeclaration.varName + "$$currentValue";

    fragment.content += `` +
      `let ${bindingsVarName} = [];` +
      `let ${currentValueVarName} = false;` 

    if (_if) {
      fragment.content += `let ${conditionBlockVarName} = Infinity;`;
    }

    newDeclaration.bindings.push(`` +
      `const newValue = Boolean(${condition ? transpileBlockExpression(condition) : "true"}) && ${conditionBlockVarName} >= ${index};` +

      `if (newValue) {` +
        `${conditionBlockVarName} = ${index};` +

      // give it up for other conditions
      `} else if (${conditionBlockVarName} === ${index}) {` +
        `${conditionBlockVarName} = Infinity;` +
      `}` +
        
      `if (newValue && newValue === ${currentValueVarName}) {` +
        `if (${currentValueVarName}) {` +
          `${transpileBindingsCall(bindingsVarName)}` +
        `}` +
        `return;` +
      `}` +

      `${currentValueVarName} = newValue;` +
      `${bindingsVarName} = [];` +

      `if (newValue) {` +
        `const elementFragment = document.createDocumentFragment();` +
        `${decl.content}` +
        (decl.bindings.length ? `${bindingsVarName} = ${bindingsVarName}.concat(${decl.bindings.map(wrapAndCallBinding)})` : `` ) +
        `elementFragment.appendChild(${decl.varName});` +
        `${end.varName}.parentNode.insertBefore(elementFragment, ${end.varName});` +
      `} else {` +
        `let curr = ${start.varName}.nextSibling;` +
        `while(curr !== ${end.varName}) {` +
          `curr.parentNode.removeChild(curr);` +
          `curr = ${start.varName}.nextSibling;` +
        `}` +
      `}`
    );
  }

  return newDeclaration;
}

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
            return transpileBlockExpression(((value as PCBlock).value as BKBind).value);
          } else {
            return JSON.stringify((value as PCString).value);
          }
        }).join(" + "), (assignment) => (
          `${element.varName}.setAttribute("${name}", ${assignment})`
        ), context);
      } else {
        binding = transpileBinding(bindingVarName, transpileBlockExpression(((value as PCBlock).value as BKBind).value), (assignment) => `${element.varName}.${propName} = ${assignment}`, context);
      }

      element.bindings.push(binding);
    }
  }

  return element;
};

const transpileBinding = (bindingVarName: string, assignment: string, createStatment: (assignment: string) => string, context: TranspileContext) => {
  
  return (
    `let $$newValue = ${assignment};` +
    `if ($$newValue !== ${bindingVarName}) {` +
      `${createStatment(`${bindingVarName} = $$newValue`)}` +
    `}`
  );
};

const transpileBindingsCall = (bindingsVarName, args: string = '') => (
  `for (let i = 0, n = ${bindingsVarName}.length; i < n; i++) {` +
    `${bindingsVarName}[i](${args});` +
  `}`
);

const transpileElement = (ast: PCElement, context: TranspileContext) => {
  switch(ast.startTag.name) {

    // TODO
    case "component": return null;
    default: return transpileElementModifiers(ast.startTag, transpileNativeElement(ast, context), context);
  }
};

const transpileChildNodes = (childNodes: PCExpression[], context): TranspileDeclaration[] => {
  const childDecls = [];
  for (let i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];

    // ignore whitespace squished between elements
    if (child.type === PCExpressionType.TEXT_NODE && /^[[\s\r\n\t]$/.test((child as PCTextNode).value) && i > 0 && i < length - 1) {
      const prev = childNodes[i - 1];
      const next = childNodes[i + 1];

      // <span><span /> </span>
      if (isTag(prev) && isTag(next)) {
        continue;
      }
    }

    const decl = transpileExpression(child, context);
    if (!decl) continue;

    childDecls.push(decl);
  }

  return childDecls;
};

const transpileNativeElement = (ast: PCElement, context: TranspileContext) => {
  const element = transpileStartTag(ast.startTag, context);
  const childDecls = transpileChildNodes(ast.childNodes, context);
  for (let i = 0, {length} = childDecls; i < length; i++) {
    const childDecl = childDecls[i];
    element.content += childDecl.content;
    element.content += `${element.varName}.appendChild(${childDecl.varName});\n`;
    element.bindings.push(...childDecl.bindings);
  }
  return element;
}

const declare = (baseName: string, assignment: string, context: TranspileContext) => {
  const varName = createVarName(baseName, context);
  return {
    varName,
    bindings: [],
    content: assignment ? `let ${varName} = ${assignment};\n` : `let ${varName};\n`
  };
};

const createVarName = (baseName: string, context: TranspileContext) => `${baseName}_${context.varCount++}`;
const declareNode = (assignment: string, context: TranspileContext) => declare("node", assignment, context);


const declareVirtualFragment = (context: TranspileContext) => {
  const fragment = declareNode(`document.createDocumentFragment("")`, context);
  const start = declareNode(`document.createTextNode("")`, context);
  const end = declareNode(`document.createTextNode("")`, context);

  fragment.content += (
    `${start.content}` +
    `${end.content}` +
    `${fragment.varName}.appendChild(${start.varName});` +
    `${fragment.varName}.appendChild(${end.varName});`
  );

  return {
    fragment,
    start, 
    end
  };
};