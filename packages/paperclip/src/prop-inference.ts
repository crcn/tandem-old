// TODOS:
// auto inference based on attribute types
// inference based on fixtures

import { PCExpression, PCExpressionType, BKExpression, BKExpressionType, BKOperation, BKNot, BKNumber, BKString, BKBind, BKObject, BKArray, PCBlock, BKVarReference, BKElse, BKElseIf, BKGroup, BKIf, BKKeyValuePair, BKProperty, BKPropertyReference, BKRepeat, BKReservedKeyword, PCAttribute, PCComment, PCElement, PCEndTag, PCFragment, PCParent, PCReference, PCRootExpression, PCSelfClosingElement, PCStartTag, PCString, PCStringBlock, PCTextNode } from "./ast";
import { Diagnostic, DiagnosticType } from "./parser-utils";

export enum InferenceType {
  OBJECT = 1,
  ARRAY = OBJECT << 1,
  STRING = ARRAY << 1,
  NUMBER = STRING << 1,
  BOOLEAN = NUMBER << 1,
  ANY = OBJECT | ARRAY | STRING | NUMBER | BOOLEAN,
  OBJECT_OR_ARRAY = OBJECT | ARRAY
};

const EACH_KEY = "$$each";

export const ATTR_TYPE_HIGH_WATERMARKS = {
  a: {
    href: InferenceType.STRING
  },
  __any: {
    class: InferenceType.STRING
  }
};

type InferContext = {
  filePath?: string;
  inference: Inference;

  // current scope where inferred types should be applied do if
  // the path matches. E.g: <div [[repeat each items as item]] /> would
  // define a current scope of { item: ["items"] } for the repeated div element
  currentScopes: {
    [identifier: string]: string[]
  }

  highWaterMark: InferenceType;

  diagnostics: Diagnostic[]
};


export type Inference = {
  type: number;
  optional?: boolean;
  properties: {
    [identifier: string]: Inference;
    $$each?: Inference;
  };
};

type InferResult = {
  inference: Inference;
  diagnostics: Diagnostic[]
};

const createAnyInference = (): Inference => ({ type: InferenceType.ANY, properties: {} });

export const inferNodeProps = (expr: PCExpression, filePath?: string): InferResult => {
  const { inference, diagnostics } = inferNode(expr, { 
    inference: createAnyInference(),
    filePath,
    diagnostics: [],
    currentScopes: {},
    highWaterMark: InferenceType.ANY
  });

  return {
    inference,
    diagnostics,
  };
};

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
  for (let i = 0, {length} = attributes; i < length; i++) {
    const attrName = attributes[i].name;
    context = setHighWaterMark(ATTR_TYPE_HIGH_WATERMARKS[name] && ATTR_TYPE_HIGH_WATERMARKS[name][attrName] || ATTR_TYPE_HIGH_WATERMARKS.__any[attrName] || InferenceType.ANY, context);
    context = inferAttribute(attributes[i], context);
  }

  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i].value;
    if (modifier.type === BKExpressionType.IF || modifier.type === BKExpressionType.ELSEIF || modifier.type === BKExpressionType.BIND) {
      context = inferExprType(modifier, context);
    }
  }

  return context;
};

const inferAttribute = ({name, value}: PCAttribute, context: InferContext) => {

  // TODO - check for reserved attribute types like href
  if (value) {
    context = inferAttributeValue(value, context);
  }
  return context;
};

const inferAttributeValue = (value: PCExpression, context: InferContext) => {
  switch(value.type) {
    case PCExpressionType.STRING: {
      return context;
    }
    case PCExpressionType.STRING_BLOCK: {
      const block = value as PCStringBlock;
      for (let i = 0, {length} = block.values; i < length; i++) {
        context = inferAttributeValue(block.values[i], setHighWaterMark(InferenceType.STRING, context));
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

  const { modifiers } = startTag;

  let _repeat: BKRepeat;

  for (let i = 0, {length} = modifiers; i < length; i++) {
    const modifier = modifiers[i].value as BKRepeat;
    if (modifier.type === BKExpressionType.REPEAT && isReference(modifier.each)) {
      _repeat = modifier as BKRepeat;
      break;
    }
  }

  if (_repeat) {
    context = inferExprType(_repeat, context);
    context = setContextScope(_repeat.asValue.name, [...getReferenceKeyPath(_repeat.each), EACH_KEY], context);
  }

  context = inferStartTag(startTag, context);
  context = inferChildNodes(childNodes, context);

  if (_repeat) {
    context = removeContextScope(_repeat.asValue.name, context);
  }

  return context;
};

const isReference = (expr: BKExpression) => expr.type === BKExpressionType.VAR_REFERENCE || expr.type === BKExpressionType.PROP_REFERENCE;

const getReferenceKeyPath = (expr: BKExpression) => expr.type === BKExpressionType.VAR_REFERENCE ? [(expr as BKVarReference).name] : (expr as BKPropertyReference).path.map(ref => ref.name);

const inferFragment = (expr: PCFragment, context: InferContext) => inferChildNodes(expr.childNodes, context);

const inferChildNodes = (childNodes: PCExpression[], context: InferContext) => {
  for (let i = 0, {length} = childNodes; i < length; i++) {
    context = inferNode(childNodes[i], context);
  }
  return context;
};

const inferDynamicTextNode = (expr: PCExpression, context: InferContext) => {
  return inferExprType((expr as PCBlock).value, setHighWaterMark(InferenceType.ANY, context));
};

const inferExprType = (expr: BKExpression, context: InferContext) => {
  switch(expr.type) {
    case BKExpressionType.NUMBER: {
      if (!isValidReturnType(InferenceType.NUMBER, context)) {
        return addInvalidTypeError(expr, InferenceType.NUMBER, context);
      }
      // TODO - assert high water mark
      return context;
    }
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;
      const newHighWaterMark = (/^[\*/\-%]$/.test(operator) ? InferenceType.NUMBER : context.highWaterMark);

      if (!isValidReturnType(newHighWaterMark, context)) {
        return addInvalidTypeError(expr, newHighWaterMark, context);
      }

      context = inferExprType(left, setHighWaterMark(newHighWaterMark, context));
      context = inferExprType(right, operator !== "===" ? setHighWaterMark(newHighWaterMark, context) : context);

      return context;
    }
    case BKExpressionType.GROUP: {
      const { value } = expr as BKGroup;
      return inferExprType(value, context);
    }
    case BKExpressionType.VAR_REFERENCE:
    case BKExpressionType.PROP_REFERENCE: {
      return reduceInferenceType(expr, getReferenceKeyPath(expr), context);
    }
    case BKExpressionType.BIND: {
      const { value } = expr as BKBind;
      return inferExprType(value, context);
    }
    case BKExpressionType.ELSEIF:
    case BKExpressionType.IF: {
      const { condition } = expr as BKIf|BKElseIf;
      return inferExprType(condition, context);
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
  const newHighWaterMark = getContextInferenceType(keyPath, context) & context.highWaterMark;
  return setHighWaterMark(newHighWaterMark, setContextInferenceType(expr, keyPath, newHighWaterMark, context));
};

const getContextInference = (keyPath: string[], context: InferContext) => {
  let current = context.inference;
  const scopedKeyPath = getScopedKeyPath(keyPath, context);

  for (let i = 0, {length} = scopedKeyPath; i < length; i++) {
    current = current.properties[scopedKeyPath[i]];
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

const setHighWaterMark = (highWaterMark: InferenceType, context: InferContext) => ({
  ...context,
  highWaterMark
});

const updateNestedInference = (keyPath: string[], newProps: Partial<Inference>, target: Inference, keyPathIndex: number = -1) => {
  keyPathIndex++;
  if (keyPathIndex === keyPath.length) {
    return {
      ...target,
      ...newProps
    };
  }

  return {
    ...target,
    properties: {
      ...target.properties,
      [keyPath[keyPathIndex]]: updateNestedInference(keyPath, newProps, target.properties[keyPath[keyPathIndex]] || createAnyInference(), keyPathIndex)
    }
  }
};

const assertCanSetNestedProperty = (keyPath: string[], expr: PCExpression, context: InferContext) => {
  let current = context.inference;
  for (let i = 0, {length} = keyPath; i < length; i++) {
    current = current.properties[keyPath[i]];
    if (!current) {
      return context;
    }
    if (!(current.type & InferenceType.OBJECT_OR_ARRAY)) {
      context = addDiagnosticError(expr, `Cannot call property "${keyPath.slice(i + 1).join(".")}" on primitive "${keyPath.slice(0, i + 1).join(".")}"`, context);
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

export const isValidReturnType = (type: number, { highWaterMark }: InferContext) => Boolean(type & highWaterMark);

const addInvalidTypeError = (expr: PCExpression, type: number, context: InferContext): InferContext => addDiagnosticError(expr, `Type mismatch ${type} to ${context.highWaterMark}`, context);

export const addDiagnosticError = (expr: PCExpression, message: string, context: InferContext) => addDiagnostic(expr, message, DiagnosticType.ERROR, context);

export const addDiagnosticWarning = (expr: PCExpression, message: string, context: InferContext) => addDiagnostic(expr, message, DiagnosticType.WARNING, context);

const addDiagnostic = (expr: PCExpression, message: string, level: DiagnosticType, context: InferContext) => ({
  ...context,
  diagnostics: [...context.diagnostics, {
    type: DiagnosticType.ERROR,
    location: expr.location,

    // TODO - make this for humans. 
    message,
    filePath: context.filePath
  }]
});
