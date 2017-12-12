/*
TODOS:

- *variant testing
*/

import { Diagnostic, DiagnosticType } from "./parser-utils";

import { InferenceType, inferNodeProps, Inference, ANY_REFERENCE, getPrettyTypeLabelEnd, getTypeLabels, getReferenceKeyPath, EACH_KEY } from "./inferencing";
import { DependencyGraph, Dependency, Component, getChildComponentInfo } from "./loader";
import { weakMemo } from "./utils";
import { PCExpression, PCExpressionType, PCElement, PCSelfClosingElement, PCAttribute, PCBlock, PCComment, PCEndTag, PCFragment, PCParent, PCReference, PCRootExpression, PCStartTag, PCString, PCStringBlock, PCTextNode, BKArray, BKBind, BKElse, BKElseIf, BKExpression, BKExpressionType, BKGroup, BKIf, BKKeyValuePair, BKNot, BKNumber, BKObject, BKOperation, BKProperty, BKPropertyReference, BKRepeat, BKReservedKeyword, BKString, BKVarReference }  from "./ast";

const MAX_CALLSTACK_OCCURRENCE = 10;

export type LintingOptions = {};

type Components = {
  [identifier: string]: {
    filePath: string;
    component: Component
  }
};

type SoftEvaluationResult = boolean|string|number|{
  [identifier: string]: any
}|any[];

type LintContextVars = {
  [identifier: string]: {
    inference: Inference;
    source: PCAttribute;
  }
}

type Caller = {
  source: PCExpression;
  filePath: string;
  props: SoftEvaluationResult
}

type LintContext = {
  graph: DependencyGraph;
  options: LintingOptions;
  currentFilePath: string;
  components: Components;
  diagnostics: Diagnostic[];
  ignoreTagNames: {
    [identifier: string]: number
  };
  callstack: Caller[];
  caller?: Caller;
}

export type LintResult = {
  diagnostics: Diagnostic[];
}

export const lintDependencyGraph = weakMemo((graph: DependencyGraph, options: LintingOptions = {}): LintResult => {

  const allComponents = {};

  for (const filePath in graph) {
    const { module } = graph[filePath];
    for (const component of module.components) {
      allComponents[component.id] = {
        filePath,
        component
      }
    }
  }

  let context: LintContext = {
    graph,
    options,
    currentFilePath: null,
    ignoreTagNames: {},
    callstack: [],
    components: allComponents,
    diagnostics: []
  };

  for (const componentId in allComponents) {
    const {filePath, component} = allComponents[componentId];
    context = lintComponent(component, {
      ...context,
      currentFilePath: filePath
    });
  }
  
  return {
    diagnostics: dedupeDiagnostics(context.diagnostics)
  };
});

const dedupeDiagnostics = (diagnostics: Diagnostic[]): Diagnostic[] => {
  const stringified = diagnostics.map(diag => JSON.stringify(diag));
  let used = {};
  const deduped = [];
  for (let i = 0, {length} = stringified; i < length; i++) {
    const str = stringified[i];
    if (used[str]) {
      continue;
    }
    used[str] = 1;
    deduped.push(diagnostics[i]);
  }

  return deduped;
}

const lintComponent = (component: Component, context: LintContext) => {

  context = lintNode(component.template, context);

  for (let i = 0, {length} = component.previews; i < length; i++) {
    const preview = component.previews[i];
    context = lintNode(preview, context);
  }

  return context;
}

const lintEntry = (node: PCExpression, context: LintContext) => {
  const { inference, diagnostics } = inferNodeProps(node, context.currentFilePath);
  context = lintAttributeShape(context.caller.source, [], inference, context.caller.props, context);

  if (diagnostics.length) {
    context = {
      ...context,
      diagnostics: [
        ...context.diagnostics,
        ...diagnostics
      ]
    };
  }

  context = lintNode(node, context);

  return context;
}

const lintNode = (node: PCExpression, context: LintContext) => {
  switch(node.type) {
    case PCExpressionType.FRAGMENT: return lintFragment(node as PCFragment, context);
    case PCExpressionType.SELF_CLOSING_ELEMENT:
    case PCExpressionType.ELEMENT: return lintElement(node as PCElement, context);
  }

  return context;
}

const lintNodes = (nodes: PCExpression[], context: LintContext) => {
  
  for (let i = 0, {length} = nodes; i < length; i++) {
    context = lintNode(nodes[i], context);
  }

  return context;
}

const lintFragment = (node: PCFragment, context: LintContext) => lintNodes(node.childNodes, context);

const lintElement = (element: PCElement|PCSelfClosingElement, context: LintContext) => {
  let childNodes: PCExpression[];
  let startTag: PCStartTag;
  if (element.type === PCExpressionType.ELEMENT) {
    const el = element as PCElement;
    childNodes = el.childNodes;
    startTag = el.startTag;
  } else {
    const el = element as PCSelfClosingElement;
    startTag = el;
    childNodes = [];
  }


  const numLoops = context.callstack.filter(caller => caller.source === startTag).length;

  if (numLoops > MAX_CALLSTACK_OCCURRENCE) {
    return addDiagnosticError(element, `Maximum callstack exceeded`, context)
  }
  if (context.ignoreTagNames[startTag.name.toLowerCase()]) {
    return context;
  }
  context = lintStartTag(startTag, context);
  context = lintNodes(childNodes, context);
  return context;
};

const EMPTY_OBJECT: any = {};


const lintStartTag = (startTag: PCStartTag, context: LintContext) => {
  const { filePath, component } = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT;
  const propInference = {
    type: InferenceType.ANY,
    properties: {}
  };

  if (!component) {
    return context;
  }


  let _if: BKIf | BKElseIf;
  let _repeat: BKRepeat;

  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const modifier = startTag.modifiers[i].value;
    if (modifier.type === BKExpressionType.IF || modifier.type === BKExpressionType.ELSEIF) {
      _if = modifier as BKIf;
    } else if (modifier.type === BKExpressionType.REPEAT) {
      _repeat = modifier as BKRepeat;
    }
  }

  if (_if) {
    if (!evalExpr(_if, context)) {
      return context;
    } else {
    }
  }

  const currentFilePath: string = context.currentFilePath;

  if (_repeat) {
    const { each, asValue, asKey } = _repeat;
    const asValueName = asValue.name;
    eachValue(evalExpr(each, context), (item, index) => {
      context = lintStartTagAttributes(startTag, pushCaller(_repeat, currentFilePath, {
        [asValueName]: item
      }, context));
      context = popCaller(context);
    });
    
  } else {
    context = lintStartTagAttributes(startTag, context);
  }

  return context;
}

const lintStartTagAttributes = (startTag: PCStartTag, context: LintContext) => {
  const props = {};
  let prevFilePath = context.currentFilePath;
  
  const { filePath, component } = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT;
  const attributesByKey = {};

  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];
    attributesByKey[attribute.name] = attribute;
  }

  // required props
  for (const propertyName in attributesByKey) {
    const attribute = attributesByKey[propertyName];
    const attrValueInference = getAttributeValueInference(attribute, context);
    props[propertyName] = attrValueInference 
  }

  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const modifier = startTag.modifiers[i].value;
    if (modifier.type === BKExpressionType.BIND) {
      const bind = modifier as BKBind;
      Object.assign(props, evalExpr(bind, context));
    }
  }

  context = lintEntry(component.source, setCurrentFilePath(filePath, ignoreTagName("preview", pushCaller(startTag, filePath, props, context))));

  context = popCaller(context);
  
  return unignoreTagName("preview", setCurrentFilePath(prevFilePath, context));
}

const setCurrentFilePath = (filePath: string, context: LintContext): LintContext => ({
  ...context,
  currentFilePath: filePath
});

const getInferenceTypeFromValue = (value: any) => {
  if (Array.isArray(value)) {
    return InferenceType.ARRAY;
  }
  if (value === null) {
    return InferenceType.ANY;
  }
  const type = typeof value;
  switch(type) {
    case "object": return InferenceType.OBJECT;
    case "number": return InferenceType.NUMBER;
    case "boolean": return InferenceType.BOOLEAN;
    case "string": return InferenceType.STRING;
    default: return InferenceType.ANY
  }
}

const lintAttributeShape = (expr: PCExpression, keypath: string[], requiredPropInference: Inference, providedValue: any, context: LintContext) => {
  if (providedValue === undefined) {
    context = addDiagnosticError(expr, `Missing attribute "${keypath.join(".")}"`, context);
    return context;
  }

  const valueType = getInferenceTypeFromValue(providedValue);

  if (!(requiredPropInference.type & valueType)) {
    context = addDiagnosticError(expr, `Type mismatch: attribute "${keypath.join(".")}" expecting ${getPrettyTypeLabelEnd(requiredPropInference.type)}, ${getTypeLabels(valueType)} provided.`, context);
  }

  if (requiredPropInference.type !== InferenceType.ANY && providedValue) {
    for (const key in requiredPropInference.properties) {
      if (key === EACH_KEY) continue;
      context = lintAttributeShape(expr, [...keypath, key], requiredPropInference.properties[key], providedValue[key], context);
    }
  }
  return context;
}

const addDiagnosticError = (expr: PCExpression, message: string, context: LintContext) => addDiagnostic(expr, DiagnosticType.ERROR, message, context);

const addDiagnostic = (expr: PCExpression, type: DiagnosticType, message: string, context: LintContext): LintContext => {
  return {
    ...context,
    diagnostics: [
      ...context.diagnostics,
      {
        type: DiagnosticType.ERROR,
        location: expr.location,
        message,
        filePath: context.currentFilePath
      }
    ]
  }
}

const getAttributeValueInference = (attribute: PCAttribute, context: LintContext): SoftEvaluationResult => {
  if (!attribute.value) {
    return true;
  } else if (attribute.value.type === PCExpressionType.STRING || attribute.value.type === PCExpressionType.STRING_BLOCK) {
    return "";
  }

  return evalExpr((attribute.value as PCBlock).value, context);
}

const getNestedInference = (keypath: string[], current: any, index: number = 0) => {
  if (current == null) {
    return current;
  }
  if (index === keypath.length) {
    return current;
  }
  return getNestedInference(keypath, current[keypath[index]], index + 1);
}

const evalExpr = (expr: BKExpression, context: LintContext): any => {
  switch(expr.type) {
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;
      const lv = evalExpr(left, context);
      const rv = evalExpr(right, context);
      switch(operator) {
        case "+": return lv + rv;
        case "-": return lv - rv;
        case "*": return lv * rv;
        case "/": return lv / rv;
        case "%": return lv % rv;
        case "==": return lv == rv;
        case "===": lv === rv;
        case "!=": lv !== rv;
        case "!==": return lv !== rv;
        case "||": return lv || rv;
        case "&&": return lv && rv;
        case ">=": return lv >= rv;
        case "<=": return lv <= rv;
      }
      return null;
    }
    case BKExpressionType.PROP_REFERENCE:
    case BKExpressionType.VAR_REFERENCE: {
      if (context.caller) {
        return getNestedInference(getReferenceKeyPath(expr), context.caller.props);
      }
      return null;
    }
    case BKExpressionType.NUMBER: {
      const { value } = expr as BKNumber;
      return Number(value);
    }
    case BKExpressionType.STRING: {
      const { value } = expr as BKString;
      return String(value);
    }
    case BKExpressionType.ARRAY: {
      const ary = expr as BKArray;
      const values = [];
      for (const expr of ary.values) {
        values.push(evalExpr(expr, context));
      }
      return values;
    }
    case BKExpressionType.OBJECT: {
      const obj = expr as BKObject;
      const properties = {};
      const values = {};
      for (const {key, value} of obj.properties) {
        values[key] = evalExpr(value, context);
      }
      return values;
    }

    case BKExpressionType.RESERVED_KEYWORD: {
      const { value } = expr as BKReservedKeyword;
      if (value === "undefined") {
        return undefined;
      }
      if (value === "null") {
        return null;
      }
      if (value === "true" || value == "false") {
        return value === "true";
      }
    }
    case BKExpressionType.BIND: {
      const bind = expr as BKBind;
      return evalExpr(bind.value, context);
    }
    case BKExpressionType.ELSEIF:
    case BKExpressionType.IF: {
      const bind = expr as BKIf;
      return evalExpr(bind.condition, context);
    }
    case BKExpressionType.NOT: {
      const not = expr as BKNot;
      return !evalExpr(not, context);
    }
  }
}

const popCaller = (context: LintContext) => {
  return {
    ...context,
    callstack: context.callstack.slice(0, context.callstack.length - 1),
    caller: context.callstack[context.callstack.length - 2]
  };
}

const ignoreTagName = (tagName: string, context: LintContext) => ({
  ...context,
  ignoreTagNames: {
    ...ignoreTagName,
    [tagName]: (context.ignoreTagNames[tagName] || 0) + 1
  }
});

const unignoreTagName = (tagName: string, context: LintContext) => ({
  ...context,
  ignoreTagNames: {
    ...ignoreTagName,
    [tagName]: (context.ignoreTagNames[tagName] || 1) - 1
  }
});

const pushCaller = (source: PCExpression, filePath: string, props: any, context: LintContext): LintContext => { 
  const caller = {
    filePath,
    source,
    props
  };
  return {
    ...context,
    callstack: [...context.callstack, caller],
    caller,
  };
}

const eachValue = (items: any, each: (value: any, index: string|number) => any) => {
  if (Array.isArray(items)) {
    items.forEach(each);
  } else {
    for (const key in items) {
      each(items[key], key);
    }
  }
};