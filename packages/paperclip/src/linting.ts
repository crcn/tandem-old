/*
TODOS:

- *variant testing
- check for props that don't exist in inference
- ** check if component template exists
*/

import { Diagnostic, DiagnosticType } from "./parser-utils";

import { InferenceType, inferNodeProps, Inference, ANY_REFERENCE, getPrettyTypeLabelEnd, getTypeLabels, getReferenceKeyPath, EACH_KEY, getNestedInference } from "./inferencing";
import { DependencyGraph, Dependency, Component, getChildComponentInfo, PCModuleType, ComponentModule } from "./loader";
import { weakMemo, eachValue } from "./utils";
import { PCExpression, PCExpressionType, PCElement, PCSelfClosingElement, PCAttribute, PCBlock, PCComment, PCEndTag, PCFragment, PCParent, PCReference, PCRootExpression, PCStartTag, PCString, PCStringBlock, PCTextNode, BKArray, BKBind, BKElse, BKElseIf, BKExpression, BKExpressionType, BKGroup, BKIf, BKKeyValuePair, BKNot, BKNumber, BKObject, BKOperation, BKProperty, BKPropertyReference, BKRepeat, BKReservedKeyword, BKString, BKVarReference, getElementTagName, getPCStartTagAttribute  }  from "./ast";

const MAX_CALLSTACK_OCCURRENCE = 10;

export type LintingOptions = {};

type Components = {
  [identifier: string]: {
    filePath: string;
    component: Component;
  }
};

type EvalResult = {
  value: any;
  source: PCExpression;
}

type LintContextVars = {
  [identifier: string]: {
    inference: Inference;
    source: PCAttribute;
  }
}

type Caller = {
  source: PCExpression;
  filePath: string;
  props: {
    [identifier: string]: EvalResult
  }
}

type LintContext = {
  lintedComponentIds: {
    [identifier: string]: boolean
  };
  currentComponentId: string;
  graph: DependencyGraph;
  optionalVars?: boolean;
  options: LintingOptions;
  currentFilePath: string;
  components: Components;
  currentExprEvalResult?: EvalResult;
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
  const diagnostics: Diagnostic[] = [];

  for (const filePath in graph) {
    const { module } = graph[filePath];
    if (module.type === PCModuleType.COMPONENT) {
      for (const component of (module as ComponentModule).components) {
        if (allComponents[component.id]) {
          diagnostics.push({
            type: DiagnosticType.ERROR,
            location: component.source.location,
            message: `Duplicate component`,
            filePath,
          });
          continue;
        }

        allComponents[component.id] = {
          filePath,
          component
        }
      }
    }
  }

  let context: LintContext = {
    graph,
    currentComponentId: null,
    options,
    lintedComponentIds: {},
    currentFilePath: null,
    ignoreTagNames: {},
    callstack: [],
    components: allComponents,
    diagnostics,
  };

  for (const componentId in allComponents) {
    const {filePath, component} = allComponents[componentId];
    context = lintComponent(component, {
      ...context,
      currentComponentId: componentId,
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

  if (!component.template) {
    context = addDiagnosticError(component.source, `missing template`, context);
  } else {
    context = lintNode(component.template, context);
  }

  for (let i = 0, {length} = component.previews; i < length; i++) {
    const preview = component.previews[i];
    context = lintNode(preview.source, context);
  }

  let hasPreview = false;
  let usedPreviewNames = {};

  if (!component.id) {
    context = addDiagnosticError(component.source, `id attribute is missing`, context);
  }


  for (let i = 0, {length} = component.source.childNodes; i < length; i++) {
    const componentChild = component.source.childNodes[i] as PCElement;
    if (componentChild.type === PCExpressionType.ELEMENT || componentChild.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
      if (getElementTagName(componentChild) === "preview") {
        hasPreview = true;

        if (componentChild.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
          context = addDiagnosticWarning(componentChild, `tags must not be self closing`, context);
        }

        const name = getPCStartTagAttribute(componentChild, "name"); 

        if (!name) {
          context = addDiagnosticWarning(componentChild, `name attribute is missing`, context);
        } else {
          if (usedPreviewNames[name]) {
            context = addDiagnosticError(componentChild, `name already exists`, context);
          } else {
            const tagChildren = componentChild.childNodes.filter(child => child.type === PCExpressionType.SELF_CLOSING_ELEMENT || child.type === PCExpressionType.ELEMENT);

            if (tagChildren.length === 0) {
              context = addDiagnosticError(componentChild, `missing element child`, context);
            }
          }
          usedPreviewNames[name] = true;
        }
      }
    }
  }
  if (!hasPreview) {
    context = addDiagnosticWarning(component.source, `Missing preview tag`, context);
  }

  return context;
}

const lintNode = (node: PCExpression, context: LintContext) => {
  switch(node.type) {
    case PCExpressionType.FRAGMENT: return lintFragment(node as PCFragment, context);
    case PCExpressionType.SELF_CLOSING_ELEMENT:
    case PCExpressionType.ELEMENT: return lintElement(node as PCElement, context);
    case PCExpressionType.BLOCK: return lintTextBlock(node as PCBlock, context);
  }

  return context;
}

const lintTextBlock = (node: PCBlock, context: LintContext) => {
  return lintExpr(node.value, context);
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
    context = lintExpr(_if, context);
    if (!context.currentExprEvalResult.value) {
      return context;
    } else {
    }
  }
  
  if (_repeat) {
    const { each, asValue, asKey } = _repeat;
    const asValueName = asValue.name;
    const asKeyName = asKey && asKey.name || undefined;
    context = lintExpr(each, context);
    const currentFilePath: string = context.currentFilePath;
    const eachValueSource = context.currentExprEvalResult.source;
    eachValue(context.currentExprEvalResult.value, (item: EvalResult, index) => {
      context = lintStartTagAttributes(startTag, pushCaller(eachValueSource, currentFilePath, {

        // within the same scope, so inherit props
        ...(context.caller && context.caller.props || {}),
        [asValueName]: item,
        [asKeyName]: asKey ? { value: index, source: asKey} : undefined
      }, context));
      context = lintNodes(childNodes, context);
      context = popCaller(context);
    });
    
  } else {
    context = lintStartTagAttributes(startTag, context);
    context = lintNodes(childNodes, context);
  }

  return context;
};

const EMPTY_OBJECT: any = {};

const lintStartTagAttributes = (startTag: PCStartTag, context: LintContext) => {
  const props = {};
  let prevFilePath = context.currentFilePath;
  
  const attributesByKey = {};

  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];
    attributesByKey[attribute.name] = attribute;
  }

  // required props
  for (const propertyName in attributesByKey) {
    const attribute = attributesByKey[propertyName];
    context = lintAttributeValue(attribute, context);
    props[propertyName] = context.currentExprEvalResult;
  }

  let callerSource: PCExpression = startTag;

  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const modifier = startTag.modifiers[i].value;
    if (modifier.type === BKExpressionType.BIND) {
      const bind = modifier as BKBind;
      context = lintExpr(bind, context);

      // transfer caller ownership to bind since it's a spread. Likely
      // if there is any problem, it's coming from here. 
      callerSource = context.currentExprEvalResult.source;
      Object.assign(props, context.currentExprEvalResult.value);
    }
  }

  const { filePath, component } = context.components[startTag.name.toLowerCase()] || EMPTY_OBJECT; 

  if (!component) {
    return context;
  }

  const currentComponentId = context.currentComponentId;

  context = lintNode(component.source, ignoreTagName("preview", pushCaller(callerSource, filePath, props, setCurrentComponentId(startTag.name, context))));
  
  return unignoreTagName("preview", popCaller(setCurrentComponentId(currentComponentId, context)));
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

const addDiagnosticError = (expr: PCExpression, message: string, context: LintContext) => addDiagnostic(expr, DiagnosticType.ERROR, message, context);

const addDiagnosticWarning = (expr: PCExpression, message: string, context: LintContext) => addDiagnostic(expr, DiagnosticType.WARNING, message, context);

const addDiagnostic = (expr: PCExpression, type: DiagnosticType, message: string, context: LintContext): LintContext => {
  return {
    ...context,
    diagnostics: [
      ...context.diagnostics,
      {
        type,
        location: expr.location,
        message,
        filePath: context.currentFilePath
      }
    ]
  }
}

const lintAttributeValue = (attribute: PCAttribute, context: LintContext) => {
  if (!attribute.value) {
    return setCurrentExprEvalResult(true, attribute, context);
  } else if (attribute.value.type === PCExpressionType.STRING_BLOCK) {
    const stringBlock = attribute.value as PCStringBlock;
    for (let i = 0, {length} = stringBlock.values; i < length; i++) {
      const block = stringBlock.values[i];
      if (block.type === PCExpressionType.BLOCK) {
        context = lintExpr(block, context);
      }
    }
  } else if (attribute.value.type === PCExpressionType.STRING) {
    context = setCurrentExprEvalResult((attribute.value as PCString).value, attribute.value, context);
  } else {
    context = lintExpr((attribute.value as PCBlock).value, context);
  }
  return context;
}

const getNestedValue = (keypath: string[], current: EvalResult, index: number = 0): EvalResult => {
  if (current == null) {
    return current;
  }
  if (index === keypath.length) {
    return current.value;
  }
  return getNestedValue(keypath, (current.value && current.value[keypath[index]]), index + 1);
}

const getKeypathOrigin = (keypath: string[], caller: Caller): PCExpression => {
  const prop = caller.props[keypath[0]];
  if (prop == null) return caller.source;
  let current: EvalResult = prop;
  for (let i = 1, {length} = keypath; i < length; i++) {
    const newCurrent = current.value && current.value[i];
    if (!newCurrent) break;
    current = newCurrent;
  }
  return current.source;
}

const lintExpr = (expr: BKExpression, context: LintContext): any => {
  switch(expr.type) {
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;

      const topOptional = context.optionalVars;

      if (operator === "||") {
        context = setOptionalVars(true, context);
      }

      context = lintExpr(left, context);
      const lv = context.currentExprEvalResult.value;
      context = lintExpr(right, setOptionalVars(topOptional, context));
      const rv = context.currentExprEvalResult.value;
      switch(operator) {
        case "+": return setCurrentExprEvalResult(lv + rv, expr, context);
        case "-": return setCurrentExprEvalResult(lv - rv, expr, context);
        case "*": return setCurrentExprEvalResult(lv * rv, expr, context);
        case "/": return setCurrentExprEvalResult(lv / rv, expr, context);
        case "%": return setCurrentExprEvalResult(lv % rv, expr, context);
        case "==": return setCurrentExprEvalResult(lv == rv, expr, context);
        case "===": return setCurrentExprEvalResult(lv === rv, expr, context);
        case "!=": return setCurrentExprEvalResult(lv !== rv, expr, context);
        case "!==": return setCurrentExprEvalResult(lv !== rv, expr, context);
        case "||": return setCurrentExprEvalResult(lv || rv, expr, context);
        case "&&": return setCurrentExprEvalResult(lv && rv, expr, context);
        case ">": return setCurrentExprEvalResult(lv > rv, expr, context);
        case ">=": return setCurrentExprEvalResult(lv >= rv, expr, context);
        case "<": return setCurrentExprEvalResult(lv < rv, expr, context);
        case "<=": return setCurrentExprEvalResult(lv <= rv, expr, context);
      }
      return context;
    }
    case BKExpressionType.PROP_REFERENCE:
    case BKExpressionType.VAR_REFERENCE: {
      const keypath = getReferenceKeyPath(expr);
      if (context.caller) {
        const { component } = (context.components[context.currentComponentId] || {}) as { component: Component };

        const componentInferenceResult = (component && inferNodeProps(component.source));

        const origin = getKeypathOrigin(keypath, context.caller)
        
        const value = getNestedValue(keypath.slice(1), context.caller.props[keypath[0]]);
        context = setCurrentExprEvalResult(value, origin, context);

        if (value === undefined && (keypath.length > 1 || !context.optionalVars)) {
          context = addDiagnosticError(origin, `Property "${keypath.join(".")}" is undefined`, context);
        } else if (componentInferenceResult) {
          const inference = getNestedInference(keypath, componentInferenceResult.inference) || ANY_REFERENCE;
          
          const valueType = getInferenceTypeFromValue(value);
          if (!(inference.type & valueType)) {
            context = addDiagnosticError(origin, `Type mismatch: attribute "${keypath.join(".")}" expecting ${getPrettyTypeLabelEnd(inference.type)}, ${getTypeLabels(valueType)} provided.`, context);
          }
        }
      } else {
        context = setCurrentExprEvalResult(null, expr, context);
      }
      return context;
    }
    case BKExpressionType.OBJECT: {
      const object = expr as BKObject;
      const objValue = {};
      for (let i = 0, {length} = object.properties; i < length; i++) {
        const { key, value } = object.properties[i];
        context = lintExpr(value, context);
        objValue[key] = context.currentExprEvalResult;
      }
      context = setCurrentExprEvalResult(objValue, expr, context);
      return context;
    }
    case BKExpressionType.ARRAY: {
      const ary = expr as BKArray;
      const values = [];
      for (let i = 0, {length} = ary.values; i < length; i++) {
        context = lintExpr(ary.values[i], context);
        values.push(context.currentExprEvalResult);
      }
      context = setCurrentExprEvalResult(values, expr, context);
      return context;
    }
    case BKExpressionType.GROUP: {
      const group = expr as BKGroup;
      return lintExpr(group.value, context);
    }
    case BKExpressionType.NUMBER: {
      const number = expr as BKNumber;
      return setCurrentExprEvalResult(Number(number.value), expr, context);
    }
    case BKExpressionType.STRING: {
      const string = expr as BKString;
      return setCurrentExprEvalResult(String(string.value), expr, context);
    }
    case BKExpressionType.RESERVED_KEYWORD: {
      const { value } = expr as BKReservedKeyword;
      if (value === "undefined") {
        return setCurrentExprEvalResult(undefined, expr, context);
      }
      if (value === "null") {
        return setCurrentExprEvalResult(null, expr, context);
      }
      if (value === "true" || value == "false") {
        return setCurrentExprEvalResult(value === "true", expr, context);
      }
      return context;
    }
    case BKExpressionType.NOT: {
      const not = expr as BKNot;
      context = lintExpr(not.value, context);
      return setCurrentExprEvalResult(!context.currentExprEvalResult.value, expr, context);
    }
    case BKExpressionType.BIND: {
      const bind = expr as BKBind;
      return lintExpr(bind.value, { ...context, currentExprEvalResult: undefined, optionalVars: false });
    }
    case BKExpressionType.IF: 
    case BKExpressionType.ELSEIF: {
      const _if = expr as BKIf;
      return lintExpr(_if.condition, { ...context, currentExprEvalResult: undefined, optionalVars: true });
    }
    default: {
      return context;
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

const setCurrentComponentId = (currentComponentId: string, context: LintContext): LintContext => ({
  ...context,
  currentComponentId
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

const setOptionalVars = (optional: boolean, context: LintContext): LintContext => ({  
  ...context,
  optionalVars: optional
});

const setCurrentExprEvalResult = (value: any, source: PCExpression, context: LintContext): LintContext => ({
  ...context,
  currentExprEvalResult: { value, source }
});