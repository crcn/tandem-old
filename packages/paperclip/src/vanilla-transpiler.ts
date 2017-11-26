// TODO - emit warnings for elements that have invalid IDs, emit errors

import { PCExpression, PCExpressionType, PCTextNode, PCFragment, PCElement, PCSelfClosingElement, PCStartTag, PCEndTag, BKBind, BKRepeat, PCString, PCStringBlock, PCBlock, BKElse, BKElseIf, BKPropertyReference, BKVarReference, BKReservedKeyword, BKGroup, BKExpression, BKExpressionType, BKIf, isTag, getPCParent, PCParent, getExpressionPath, getPCElementModifier, BKNot, BKOperation, BKKeyValuePair, BKObject, BKNumber, BKArray, BKString, CSSExpression, CSSExpressionType, CSSAtRule, CSSDeclarationProperty, CSSGroupingRule, CSSRule, CSSSheet, CSSStyleRule, getStartTag } from "./ast";
import { loadModuleAST, Module, Import, Component, IO, loadModuleDependencyGraph, Dependency, DependencyGraph } from "./loader";
import { PaperclipTargetType } from "./constants";
import { parseModuleSource } from "./parser";
import { PaperclipTranspileResult } from "./transpiler";


export type BundleVanllaOptions = {
  target: PaperclipTargetType,
  io?: IO
};

type TranspileContext = {
  uri: string;
  contextName?: string;
  varCount: number;
  root: PCExpression;
};

export type TranspileDeclaration = {
  varName: string;
  content: string;
  bindings: string[];
};


export const bundleVanilla = (uri: string, options: BundleVanllaOptions): Promise<PaperclipTranspileResult> => loadModuleDependencyGraph(uri, options.io).then((graph) => ({
  code: transpileBundle(uri, graph),
  graph,
  entryDependency: graph[uri]
}));

// usable in other transpilers
export const transpileBlockExpression = (expr: BKExpression) => {
  switch(expr.type) {
    case BKExpressionType.NOT: return `!${transpileBlockExpression((expr as BKNot).value)}`;
    case BKExpressionType.PROP_REFERENCE: {
      const ref = expr as BKPropertyReference;
      return ref.path.map(transpileBlockExpression).join(".");
    }
    case BKExpressionType.STRING: {
      const string = expr as BKString;
      return JSON.stringify(string.value);
    }
    case BKExpressionType.NUMBER: {
      const number = expr as BKNumber;
      return number.value;
    }
    case BKExpressionType.VAR_REFERENCE: {
      const ref = expr as BKVarReference;
      return ref.name;
    }
    case BKExpressionType.ARRAY: {
      const array = expr as BKArray;
      return `[${array.values.map(transpileBlockExpression)}]`;
    }
    case BKExpressionType.OBJECT: {
      const object = expr as BKObject;
      let content = `{`;
      for (let i = 0, {length} = object.properties; i < length; i++) {
        const property = object.properties[i];
        content += `${property.key}:${transpileBlockExpression(property.value)}, `;
      }
      content += `}`;
      return content;
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

const transpileBundle = (entryUri: string, graph: DependencyGraph) => {
  
  // TODO - resolve dependencies

  let content = `((window) => {`;

  content += `` +

    `var document = window.document;` +

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

    `const $$defineModule = (run) => {` +
      `let exports;` +
      `return () => {` +
        `if (exports) return exports;` +

        // guard from recursive dependencies
        `exports = {};` +
        `return exports = run((dep) => {` +
          `return $$modules[dep]()` +
        `});` +
      `}` +
    `};` +

    `const $$setElementProperty = (element, property, value) => {` +
      `if (property === "style" && typeof value !== "string") {\n` +
        `element.style = "";\n` +
        `Object.assign(element.style, value);\n` +
      `} else {\n` +
        `element[property] = value;` +
      `}\n` +
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

  for (const uri in graph) {
    content += `$$modules["${uri}"] = ${transpileModule(graph[uri].module, graph[uri].resolvedImportUris)};`;
  }

  content += `const entry = $$modules["${entryUri}"]();`

  content += `return {` +
      `entry,` + 
      `modules: $$modules` +
    `};` +  
  `})(window)`;

  return content;
};

const transpileModule = ({ source, imports, globalStyles, components, unhandledExpressions, uri }: Module, resolvedImportUris: { [identifier: string]: string }) => {

  const context: TranspileContext = {
    uri,
    varCount: 0,
    root: source
  };

  // TODO - include deps here
  let content = `$$defineModule((require) => {`;


  const styleDecls = transpileChildNodes(globalStyles, context);

  for (let i = 0, {length} = styleDecls; i < length; i++) {
    const decl = styleDecls[i];
    content += decl.content;
    content += `document.body.appendChild(${decl.varName});`;
  }

  for (let i = 0, {length} = imports; i < length; i++) {
    const _import = imports[i];
    const decl = declare(`import`, `require(${JSON.stringify(resolvedImportUris[_import.href])})`, context);
    content += decl.content;
  }

  for (let i = 0, {length} = components; i < length; i++) {
    content += tranpsileComponent(components[i], context).content;
  }

  content += `return {` +
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

  const styleDecl = style && transpileStyleElement(style, templateContext);

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
            `if (this.$$${name} === value || String(this.$$${name}) === String(value)) {` +
              `return;` +
            `}` +
            `const oldValue = this.$${name};` +
            `this.$$${name} = value;` +

            // primitive data types only
            `if (typeof value !== "object") {` +
              `this.setAttribute(${JSON.stringify(name)}, value);` +
            `}` +
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

        (styleDecl ? styleDecl.content + `shadow.appendChild(${styleDecl.varName});`: ``) +

        properties.map(({name, defaultValue}) => (
          `if (this.$$${name} == null) {` +
            `this.$$${name} = ${defaultValue ? defaultValue : `this.getAttribute("${name}");`}` +
          `}`
        )).join("\n") +


        `let $$bindings = [];` +
        
        (template ? template.childNodes.map(node => {
          const decl = transpileExpression(node, templateContext);
          if (!node || !decl) {
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

    // paperclip linter will catch cases where there is more than one 
    // registered component in a project. This shouldn't block browsers from loading
    // paperclip files (especially needed when loading multiple previews in the same window)
    `if (!customElements.get("${id}")) {` +
      `customElements.define("${id}", ${varName});` +
    `} else {` +
      `console.error("Custom element \\"${id}\\" is already defined, ignoring");` +
    `}`

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
  return attachSource(declareNode(`document.createTextNode(${JSON.stringify(ast.value.replace(/[\s\r\n\t]+/g, " "))})`, context), ast, context);
};

const transpileTextBlock = (ast: PCBlock, context: TranspileContext) => {
  let node = declareNode(`document.createTextNode("")`, context);
  node = attachSource(node, ast, context);
  const bindingVarName = `${node.varName}$$currentValue`;
  node.content += `let ${bindingVarName};`;
  node.bindings.push(transpileBinding(bindingVarName, transpileBlockExpression(((ast as PCBlock).value as BKBind).value), assignment => `${node.varName}.nodeValue = ${assignment}`, context));
  return node;
};

const transpileSelfClosingElement = (ast: PCSelfClosingElement, context: TranspileContext) => {
  return transpileElementModifiers(ast, attachSource(transpileStartTag(ast, context), ast, context), context);
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
  let _bind: BKBind; // spread op in this case
  
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
    } else if (modifier.type === BKExpressionType.BIND) {
      _bind = modifier as BKBind;
    }
  }

  if (_bind) {
    const {value} = _bind;
    newDeclaration = {
      varName: decl.varName,
      content: decl.content,
      bindings: [...decl.bindings]
    };

    const spreadVarName = `${newDeclaration.varName}$$spreadValue`;
    const assignment = transpileBlockExpression(value);
    newDeclaration.content += `let ${spreadVarName};`;

    newDeclaration.bindings.push(transpileBinding(spreadVarName, assignment, (assignment) => (`` +
      `for (const $$key in ${spreadVarName}) {` +
        `$$setElementProperty(${decl.varName}, $$key, ${spreadVarName}[$$key]);` +
      `}` +
    ``), context));

    decl = newDeclaration;
  }

  // todo - eventually want to get TYPE of each declaration
  // here so that transpiling can be done for objects, or arrays.
  if (_repeat) {
    const {each, asKey, asValue} = _repeat;

    const _each = transpileBlockExpression(each);
    const _asKey = asKey ? transpileBlockExpression(asKey) : "index";
    const _asValue = transpileBlockExpression(asValue);

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
      `let $$newValue = (${_each}) || [];` +
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
          `const $$bindings = [${decl.bindings.map((binding) => (`(${_asValue}, ${_asKey}) => { ` +
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
    
    const modifier = (_if || _elseif || _else) as BKIf;
    const { condition } = modifier;
    
    const siblings = context.root === startTag || (context.root as PCElement).startTag === startTag  ? [context.root] : getPCParent(context.root as PCParent, startTag).childNodes;
    
    const index = siblings.findIndex((sibling) => {
      return sibling === startTag || (startTag.type === PCExpressionType.START_TAG && sibling.type === PCExpressionType.ELEMENT && (sibling as PCElement).startTag === startTag)
    });

    let conditionBlockVarName;

    for (let i = index + 1; i--;) {
      const sibling = siblings[i] as PCElement;
      if (isTag(sibling) && getPCElementModifier(sibling, BKExpressionType.IF)) {
        conditionBlockVarName = "condition_" + getExpressionPath(sibling, context.root).join("");
        break;
      }
    }
    
    if (!conditionBlockVarName) {
      throw new Error(`Element condition ${BKExpressionType[modifier.type]} defined without an IF block.`);
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
        (decl.bindings.length ? `${bindingsVarName} = ${bindingsVarName}.concat(${decl.bindings.map(wrapAndCallBinding)});` : `` ) +
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
  let element = declareNode(`document.createElement("${ast.name}")`, context);

  for (let i = 0, {length} = ast.attributes; i < length; i++) {
    const { name, value } = ast.attributes[i];
    const propName = getJSFriendlyName(name);
    if (!value) {
      element.content += `${element.varName}.setAttribute("${name}", "true");`;
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

            // todo - assert BIND here
            return transpileBlockExpression(((value as PCBlock).value as BKBind).value);
          } else {
            return JSON.stringify((value as PCString).value);
          }
        }).join(" + "), (assignment) => (
          `${element.varName}.setAttribute("${name}", ${assignment})`
        ), context);
      } else {
        binding = transpileBinding(bindingVarName, transpileBlockExpression(((value as PCBlock).value as BKBind).value), (assignment) => `$$setElementProperty(${element.varName}, "${propName}", ${assignment})`, context);
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
      `${bindingVarName} = $$newValue;` +
      `${createStatment(bindingVarName)}` +
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
    case "style": return transpileStyleElement(ast, context);
    default: return transpileElementModifiers(ast.startTag, transpileNativeElement(ast, context), context);
  }
};

export const transpileStyleElement = (ast: PCElement, context: TranspileContext) => {
  let decl = declareNode(`document.createElement("style")`, context);
  decl = attachSource(decl, ast, context);
  decl.content += `` +
    `if (window.$synthetic) {`;

      const sheetDecl = transpileNewCSSSheet(ast.childNodes[0] as any as CSSSheet, context);

      decl.content += sheetDecl.content +
      `${decl.varName}.$$setSheet(${sheetDecl.varName});`
      // todo - need to create style rules
  decl.content += `` +
    `} else {` + 

      // todo - need to stringify css
      `${decl.varName}.textContent = ${JSON.stringify(transpileCSSSheet(ast.childNodes[0] as any as CSSSheet))};` +
    `}`
  return decl;
};

const transpileNewCSSSheet = (sheet: CSSSheet, context: TranspileContext) => {
  const childDecls = transpileNewCSSRules(sheet.children, context);
  let decl = declareRule(`new CSSStyleSheet([${childDecls.map((decl) => decl.varName).join(",")}])`, context);
  decl = attachSource(decl, sheet, context);
  decl.content = childDecls.map((decl) => decl.content).join("\n") + decl.content;
  return decl;
}

const transpileNewCSSRules = (rules: CSSRule[], context: TranspileContext) => rules.map(rule => transpileNewCSSRule(rule, context)).filter(Boolean);

const transpileNewCSSRule = (rule: CSSRule, context: TranspileContext) => {
  switch(rule.type) {
    case CSSExpressionType.AT_RULE: return transpileNewCSSAtRule(rule as CSSAtRule, context);
    case CSSExpressionType.STYLE_RULE: return transpileNewCSSStyleRule(rule as CSSStyleRule, context);
  }
  throw new Error(`Unexpected rule ${rule.type}`);
};

const transpileNewCSSAtRule = (rule: CSSAtRule, context: TranspileContext) => {
  switch(rule.name) {
    case "media": return transpileNewMediaRule(rule, context);
    case "keyframes": return transpileNewKeyframesRule(rule, context);
    case "font-face": return transpileNewFontFaceRule(rule, context);
    case "import": return transpileNewImportRule(rule, context);
    case "charset": return transpileNewCharsetRule(rule, context);
  }
};

const transpileNewMediaRule = (rule: CSSAtRule, context: TranspileContext) => transpileNewAtGroupingRule(rule, context, `CSSMediaRule`, transpileNewCSSStyleRule);

const transpileNewFontFaceRule = (rule: CSSAtRule, context: TranspileContext) => {
  return attachSource(declareRule(`new CSSFontFaceRule(${transpileStyleDeclaration(getCSSDeclarationProperties(rule), context)})`, context), rule, context);
};

const getCSSDeclarationProperties = (rule: CSSGroupingRule) => rule.children.filter(child => child.type === CSSExpressionType.DECLARATION_PROPERTY) as CSSDeclarationProperty[];

const transpileNewKeyframesRule = (rule: CSSAtRule, context: TranspileContext) => transpileNewAtGroupingRule(rule, context, `CSSKeyframesRule`, transpileKeyframe);

const transpileNewAtGroupingRule = (rule: CSSAtRule, context: TranspileContext, constructorName: string, transpileChild: any) => {
  const childDecls = rule.children.map(rule => transpileChild(rule, context)).filter(Boolean);
  const decl = declareRule(`new ${constructorName}(${JSON.stringify(rule.params.join(" "))}, [${childDecls.map((decl) => decl.varName).join(",")}])`, context);
  decl.content = childDecls.map((decl) => decl.content).join("\n") + decl.content;
  return decl;
};

const transpileKeyframes = (rules: CSSRule[], context: TranspileContext) =>  rules.map(rule => transpileKeyframe(rule as CSSStyleRule, context)).filter(Boolean);

const transpileKeyframe = (styleRule: CSSStyleRule, context: TranspileContext) => transpileNewCSSStyledRule(styleRule, "CSSKeyframeRule", context);


const transpileNewImportRule = (rule: CSSAtRule, context: TranspileContext) => {

  // imported up top
  return null; 
};

const transpileNewCharsetRule = (rule: CSSAtRule, context: TranspileContext) => {
  return null; // for now
};

const transpileNewCSSStyledRule = (rule: CSSStyleRule, constructorName: string, context: TranspileContext) => {
  return declareRule(`new ${constructorName}(${JSON.stringify(rule.selectorText)}, ${transpileStyleDeclaration(getCSSDeclarationProperties(rule), context)})`, context);
}

const transpileNewCSSStyleRule = (rule: CSSStyleRule, context: TranspileContext) => transpileNewCSSStyledRule(rule, "CSSStyleRule", context);

const transpileStyleDeclaration = (declarationProperties: CSSDeclarationProperty[], context: TranspileContext) => {
  
  let content = `{`;

  for (const property of declarationProperties) {
    content += `"${property.name}": "${property.value.replace(/"/g, '\\"').replace(/[\s\r\n\t]+/g, " ")}", `;
  }
  
  content += `}`;

  return `CSSStyleDeclaration.fromObject(${content})`;
};

export const transpileCSSSheet = (sheet: CSSSheet, mapSelectorText: ((value, rule?: CSSRule) => string) = value => value) => sheet.children.map(rule => transpileCSSRule(rule, mapSelectorText)).filter(Boolean).join(" ");

const transpileCSSRule = (rule: CSSRule, mapSelectorText: (value, rule: CSSRule) => string) => {

  // TODO - prefix here for scoped styling
  switch(rule.type) {
    case CSSExpressionType.AT_RULE: {
      const atRule = rule as CSSAtRule;
      if (atRule.name === "charset" || atRule.name === "import") return null;
      let content = `@${atRule.name} ${atRule.params} {`;
      content += atRule.children.map(rule => transpileCSSRule(rule, mapSelectorText)).filter(Boolean).join(" ");
      content += `}`;
      return content;
    }
    case CSSExpressionType.DECLARATION_PROPERTY: {
      const prop = rule as CSSDeclarationProperty;
      return `${prop.name}: ${prop.value};`;
    }
    case CSSExpressionType.STYLE_RULE: {
      const styleRule = rule as CSSStyleRule;
      let content = `${mapSelectorText(styleRule.selectorText, styleRule)} {`;
        content += styleRule.children.map(rule => transpileCSSRule(rule, mapSelectorText)).filter(Boolean).join("")
      content += `}`;
      return content;
    }
  }
};

const transpileChildNodes = (childNodes: PCExpression[], context): TranspileDeclaration[] => {
  const childDecls = [];
  for (let i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];

    // ignore whitespace squished between elements
    if (child.type === PCExpressionType.TEXT_NODE && /^[\s\r\n\t]+$/.test((child as PCTextNode).value)) {
      const prev = childNodes[i - 1];
      const next = childNodes[i + 1];

      // <span><span /> </span>
      if ((!prev || isTag(prev)) && (!next || isTag(next))){
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
  let element = transpileStartTag(ast.startTag, context);
  element = attachSource(element, ast, context);
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
const declareRule = (assignment: string, context: TranspileContext) => declare("rule", assignment, context);

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

const attachSource = (decl: TranspileDeclaration, expr: PCExpression, context: TranspileContext) => {
  const source = {
    uri: context,
    type: expr.type,
    ...expr.location
  };

  decl.content += `${decl.varName}.source = ${JSON.stringify(source)};`;
  return decl;
}