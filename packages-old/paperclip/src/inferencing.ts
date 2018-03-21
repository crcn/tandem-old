
// infer based on styles
// show how each ref extends attribute it's being assigned to

import { PCExpression, PCExpressionType, BKExpression, BKExpressionType, BKOperation, BKNot, BKNumber, BKString, BKBind, BKObject, BKArray, PCBlock, BKVarReference, BKElse, BKElseIf, BKGroup, BKIf, BKKeyValuePair, BKProperty, BKPropertyReference, BKRepeat, BKReservedKeyword, PCAttribute, PCComment, PCElement, PCEndTag, PCFragment, PCParent, PCReference, PCRootExpression, PCSelfClosingElement, PCStartTag, PCString, PCStringBlock, PCTextNode } from "./ast";
import { DependencyGraph, Module, Component, getComponentDependency, getModuleComponent, getDependencyGraphComponentsExpressions } from "./loader";
import { Diagnostic, DiagnosticType } from "./parser-utils";
import { weakMemo } from "./utils";

export enum InferenceType {
  OBJECT = 1,
  ARRAY = OBJECT << 1,
  STRING = ARRAY << 1,
  NUMBER = STRING << 1,
  BOOLEAN = NUMBER << 1,
  PRIMITIVE = STRING | NUMBER | BOOLEAN,
  ANY = OBJECT | ARRAY | STRING | NUMBER | BOOLEAN,
  OBJECT_OR_ARRAY = OBJECT | ARRAY
};

export const EACH_KEY = "$$each";
export const EAT_KEY = "$$eat";

type InferenceExtends = {
  tagName: string;
  attributeName: string
};

type InferContext = {
  filePath?: string;
  options: InferNodePropOptions;
  inference: Inference;
  extends?: InferenceExtends;

  // current scope where inferred types should be applied do if
  // the path matches. E.g: <div [[repeat each items as item]] /> would
  // define a current scope of { item: ["items"] } for the repeated div element
  currentScopes: {
    [identifier: string]: string[]
  };

  typeLimit: InferenceType;
  typeLimitErrorMessage?: string;

  diagnostics: Diagnostic[]
};

export type Inference = {
  type: number;
  optional?: boolean;
  extends?: InferenceExtends;
  properties: {
    [identifier: string]: Inference;
    $$each?: Inference;
  };
};

type InferResult
 = {
  inference: Inference;
  diagnostics: Diagnostic[]
};

type DependencyGraphInferenceResult = {
  componentInferences: {
    [identifier: string]: Inference
  },
  diagnostics: Diagnostic[]
};

export type RegisteredComponents = {
  [identifier: string]: {
    filePath: string;
    expression: PCExpression;
  }
};

const createAnyInference = (): Inference => ({ type: InferenceType.ANY, properties: {} });

export const ANY_REFERENCE = createAnyInference();

type InferNodePropOptions = {
  ignoreTagNames?: string[]
};

// TODO - accept alias here. Also, do not use DependencyGraph - instead use registeredComponents
export const inferNodeProps = weakMemo((element: PCExpression, filePath?: string, options: InferNodePropOptions = {}): InferResult => {
  const { diagnostics, inference } = inferNode(element, createInferenceContext(filePath, options));
  return { diagnostics, inference };
});

const createInferenceContext = (filePath: string, options: InferNodePropOptions): InferContext => ({ 
  filePath,
  options,
  inference: createAnyInference(),
  diagnostics: [],
  currentScopes: {},
  typeLimit: InferenceType.ANY
})

const inferNode = (expr: PCExpression, context: InferContext) => {
  switch(expr.type) {
    case PCExpressionType.BLOCK: return inferDynamicTextNode(expr, context);
    case PCExpressionType.FRAGMENT: return inferFragment(expr as PCFragment, context);
    case PCExpressionType.SELF_CLOSING_ELEMENT: 
    case PCExpressionType.ELEMENT: return inferElement(expr as PCElement, context);
  }

  return context;
};

const inferStartTag = (startTag: PCStartTag, context: InferContext) => {
  const { attributes, name, modifiers } = startTag;

  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i].value;
    if (modifier.type === BKExpressionType.IF || modifier.type === BKExpressionType.ELSEIF || modifier.type === BKExpressionType.BIND) {

      context = inferExprType(modifier, setTypeLimit(InferenceType.ANY, null, context));
    }
  }

  for (let i = 0, {length} = attributes; i < length; i++) {
    context = inferAttribute(startTag, attributes[i], setTypeLimit(InferenceType.ANY, null, context));
  }

  return context;
};

const inferAttribute = (startTag: PCStartTag, {name, value}: PCAttribute, context: InferContext) => {

  // TODO - check for reserved attribute types like href
  if (value) {
    context = inferAttributeValue(startTag, value, context);
  }
  return context;
};

const inferAttributeValue = (startTag: PCStartTag, value: PCExpression, context: InferContext) => {
  switch(value.type) {
    case PCExpressionType.STRING: {
      return context;
    }
    case PCExpressionType.STRING_BLOCK: {
      const block = value as PCStringBlock;
      for (let i = 0, {length} = block.values; i < length; i++) {
        context = inferAttributeValue(startTag, block.values[i], setTypeLimit(InferenceType.PRIMITIVE, null, context));
      }
      return context;
    }
    case PCExpressionType.BLOCK: {
      const block = value as PCBlock;
      return inferExprType(block.value, context);
    }
  }
  return context;
};

const inferElement = (element: PCElement|PCSelfClosingElement, context: InferContext) => {
  let childNodes: PCExpression[] = [];
  let startTag: PCStartTag;

  if (element.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    childNodes = [];
    startTag = element as PCSelfClosingElement;
  } else {
    const el = element as PCElement;
    childNodes = el.childNodes;
    startTag = el.startTag;
  }

  if (context.options.ignoreTagNames && context.options.ignoreTagNames.indexOf(startTag.name) !== -1)  {
    return context;
  }

  const { modifiers } = startTag;

  let _repeat: BKRepeat;

  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i].value as BKRepeat;
    if (modifier.type === BKExpressionType.REPEAT) {
      _repeat = modifier as BKRepeat;
      break;
    }
  }

  if (_repeat) {
    context = inferExprType(_repeat, setTypeLimit(InferenceType.ANY, null, context));
    context = setContextScope(_repeat.asValue.name, isReference(_repeat.each) ? [...getReferenceKeyPath(_repeat.each), EACH_KEY] : [EAT_KEY], context);
  }

  context = inferStartTag(startTag, context);
  context = inferChildNodes(childNodes, context);

  if (_repeat) {
    context = removeContextScope(_repeat.asValue.name, context);
  }

  return context;
};

const isReference = (expr: BKExpression) => expr.type === BKExpressionType.VAR_REFERENCE || expr.type === BKExpressionType.PROP_REFERENCE;

export const getReferenceKeyPath = (expr: BKExpression) => expr.type === BKExpressionType.VAR_REFERENCE ? [(expr as BKVarReference).name] : (expr as BKPropertyReference).path.map(ref => ref.name);

const inferFragment = (expr: PCFragment, context: InferContext) => inferChildNodes(expr.childNodes, context);

const inferChildNodes = (childNodes: PCExpression[], context: InferContext) => {
  for (let i = 0, {length} = childNodes; i < length; i++) {
    context = inferNode(childNodes[i], context);
  }
  return context;
};

const inferDynamicTextNode = (expr: PCExpression, context: InferContext) => {
  return inferExprType((expr as PCBlock).value, setTypeLimit(InferenceType.ANY, null, context));
};

const inferExprType = (expr: BKExpression, context: InferContext) => {
  switch(expr.type) {
    case BKExpressionType.NUMBER: {
      if (!isValidReturnType(InferenceType.NUMBER, context)) {
        return addInvalidTypeError(expr, InferenceType.NUMBER, context);
      }
      
      return setTypeLimit(InferenceType.NUMBER, null, context);
    }
    case BKExpressionType.STRING: {
      if (!isValidReturnType(InferenceType.STRING, context)) {
        return addInvalidTypeError(expr, InferenceType.STRING, context);
      }
      
      return setTypeLimit(InferenceType.STRING, null, context);
    }
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;
      let newTypeLimit = (/^[\*/\-%]$/.test(operator) ? InferenceType.NUMBER : context.typeLimit);

      if (!isValidReturnType(newTypeLimit, context)) {
        return addInvalidTypeError(expr, newTypeLimit, context);
      }

      const previousTypeLimit = context.typeLimit;

      let leftTypeLimit = newTypeLimit;
      let rightTypeLimit = newTypeLimit;

      context = inferExprType(left, setTypeLimit(leftTypeLimit, `The left-hand side of an arithmetic operation must be ${getPrettyTypeLabelEnd(newTypeLimit)}`, context));
      
      context = inferExprType(right, operator !== "===" ? setTypeLimit(rightTypeLimit, `The right-hand side of an arithmetic operation must be ${getPrettyTypeLabelEnd(context.typeLimit)}`, context) : context);

      return context;
    }
    case BKExpressionType.GROUP: {
      const { value } = expr as BKGroup;
      return inferExprType(value, context);
    }
    case BKExpressionType.VAR_REFERENCE:
    case BKExpressionType.PROP_REFERENCE: {
      const keypath = getReferenceKeyPath(expr);
      context = reduceInferenceType(expr, keypath, context);

      return context;
    }
    case BKExpressionType.BIND: {
      const { value } = expr as BKBind;
      return inferExprType(value, context);
    }
    case BKExpressionType.OBJECT: {
      const { properties } = expr as BKObject;
      for (let i = 0, {length} = properties; i < length; i++) {
        const { key, value } = properties[i];
        context = inferExprType(value, setTypeLimit(InferenceType.ANY, null, context));
      }
      return setTypeLimit(InferenceType.OBJECT, null, context);
    }
    case BKExpressionType.NOT: {
      const { value } = expr as BKNot;
      return setTypeLimit(InferenceType.BOOLEAN, null, inferExprType(value, setTypeLimit(InferenceType.ANY, null, context)));
    }
    case BKExpressionType.ELSEIF:
    case BKExpressionType.IF: {
      const { condition } = expr as BKIf|BKElseIf;
      return inferExprType(condition, setTypeLimit(InferenceType.ANY, null, context));
    }
    case BKExpressionType.REPEAT: {
      const { each } = expr as BKRepeat;
      return inferExprType(each, context);
    }
    default: {
      return context;
    }
  }
};

const reduceInferenceType = (expr: PCExpression, keyPath: string[], context: InferContext) => {
  const newTypeLimit = getContextInferenceType(keyPath, context) & context.typeLimit;
  if (!isValidReturnType(newTypeLimit, context)) {
    return addDiagnosticError(expr, context, context.typeLimitErrorMessage); 
  }
  return setTypeLimit(newTypeLimit, context.typeLimitErrorMessage, setContextInferenceType(expr, keyPath, newTypeLimit, context));
};

const getContextInference = (keyPath: string[], context: InferContext) => {
  const scopedKeyPath = getScopedKeyPath(keyPath, context);
  return getNestedInference(scopedKeyPath, context.inference);
}

export const getNestedInference = (keypath: string[], context: Inference) => {

  let current = context;

  for (let i = 0, {length} = keypath; i < length; i++) {
    current = current.properties[keypath[i]];
    if (!current) return null;
  }

  return current;
}

const getContextInferenceType = (keyPath: string[], context: InferContext, notFoundType: InferenceType = InferenceType.ANY) => {
  const inference = getContextInference(keyPath, context);
  return inference ? inference.type : notFoundType;
};

const getLowestPropInference = (keyPath: string[], context: InferContext, notFoundType: InferenceType = InferenceType.ANY) => {
  
  let current = context.inference;
  
  for (let i = 0, {length} = keyPath; i < length; i++) {
    const next = current.properties[keyPath[i]];
    if (!next) return current;
    current = next;
  }
  
  return current;
};

const getLowestPropInferenceType = (keyPath: string[], context: InferContext, notFoundType: InferenceType = InferenceType.ANY) => {
  const inference = getLowestPropInference(keyPath, context)
  return inference ? inference.type : notFoundType;
};

const setTypeLimit = (typeLimit: InferenceType, typeLimitErrorMessage: string, context: InferContext) => ({
  ...context,
  typeLimit,
  typeLimitErrorMessage
});

const updateNestedInference = (keyPath: string[], newProps: Partial<Inference>, target: Inference, keyPathIndex: number = -1) => {
  keyPathIndex++;
  if (keyPath.indexOf(EAT_KEY) !== -1) {
    return target;
  }
  if (keyPathIndex === keyPath.length) {
    return {
      ...target,
      ...newProps
    };
  }

  return {
    ...target,
    type: target.type & InferenceType.OBJECT_OR_ARRAY,
    properties: {
      ...target.properties,
      [keyPath[keyPathIndex]]: updateNestedInference(keyPath, newProps, target.properties[keyPath[keyPathIndex]] || createAnyInference(), keyPathIndex)
    }
  }
};

export const getTypeLabels = (type: InferenceType) => {
  const labels = [];
  if (type & InferenceType.ARRAY) {
    labels.push("array");
  } 

  if (type & InferenceType.OBJECT) {
    labels.push("object");
  }

  if (type & InferenceType.STRING) {
    labels.push("string");
  }

  if (type & InferenceType.NUMBER) {
    labels.push("number");
  }

  if (type & InferenceType.BOOLEAN) {
    labels.push("boolean");
  }

  return labels;
};

export const getPrettyTypeLabelEnd = (type: InferenceType) => {
  const labels = getTypeLabels(type);
  return labels.length === 1 ? `a ${labels[0]}` : `an ${labels.slice(0, labels.length - 1).join(", ")}, or ${labels[labels.length - 1]}`;
}

const assertCanSetNestedProperty = (keyPath: string[], expr: PCExpression, context: InferContext) => {
  let current = context.inference;
  for (let i = 0, {length} = keyPath; i < length - 1; i++) {
    current = current.properties[keyPath[i]];
    if (!current) {
      return context;
    }
    if (!(current.type & InferenceType.OBJECT_OR_ARRAY)) {
      context = addDiagnosticError(expr, setTypeLimit(context.typeLimit, null, context), `Cannot call property "${keyPath.slice(i + 1).join(".")}" on primitive "${keyPath.slice(0, i + 1).join(".")}"`);
    }
  }
  return context;
}

const setContextInferenceType = (expr: PCExpression, keyPath: string[], type: InferenceType, context: InferContext) => {
  // TODO - get current scope
  context = assertCanSetNestedProperty(keyPath, expr, context);
  return updateContextInference(updateNestedInference( getScopedKeyPath(keyPath, context), { type }, context.inference), context);
};

const setContextScope = (name: string, keyPath: string[], context: InferContext): InferContext => ({
  ...context,
  currentScopes: {
    ...context.currentScopes,
    [name]: keyPath
  }
});

const EMPTY_ARRAY = [];

const getContextScope = (name, context: InferContext): string[] => context.currentScopes[name] || EMPTY_ARRAY;


const getScopedKeyPath = (keyPath: string[], context: InferContext) => {
  const scope = context.currentScopes[keyPath[0]];

  return scope ? [...getScopedKeyPath(scope, context), ...keyPath.slice(1)] : keyPath;
}
const removeContextScope = (name: string, context: InferContext): InferContext => ({
  ...context,
  currentScopes: {
    ...context.currentScopes,
    [name]: null
  }
});

const updateContextInference = (inference: Inference, context: InferContext) => ({
  ...context,
  inference
});

export const isValidReturnType = (type: number, { typeLimit }: InferContext) => Boolean(type & typeLimit);

const addInvalidTypeError = (expr: PCExpression, type: number, context: InferContext): InferContext => addDiagnosticError(expr, context, context.typeLimitErrorMessage || `Type mismatch ${type} to ${context.typeLimit}`);

const addDiagnosticError = (expr: PCExpression, context: InferContext, message: string) => addDiagnostic(expr, DiagnosticType.ERROR, context, message);

const addDiagnosticWarning = (expr: PCExpression, context: InferContext, message: string) => addDiagnostic(expr, DiagnosticType.WARNING, context, message);

const addDiagnostic = (expr: PCExpression, level: DiagnosticType, context: InferContext, message: string) => ({
  ...context,
  diagnostics: [...context.diagnostics, {
    type: DiagnosticType.ERROR,
    location: expr.location,
    message,
    filePath: context.filePath
  }]
});
