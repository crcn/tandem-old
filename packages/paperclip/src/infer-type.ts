/*

TODOS:

- check for css props like :host([prop])
- pretty errors & warnings
- further inferences based on fixture data
*/

import { getElementChildNodes, PCExpressionType, PCExpression, PCBlock, PCElement, PCFragment, PCSelfClosingElement, getPCElementModifier, BKExpressionType, BKRepeat, BKBind, BKIf, BKElse, BKElseIf, BKOperation, BKExpression, BKPropertyReference, BKVarReference, getStartTag, getElementAttributes } from "./ast";
import { Component } from "./loader";
import { BKGroup } from "./index";

export enum InferredTypeKind {
  OBJECT = 1,
  ARRAY = OBJECT << 1,
  STRING = ARRAY << 1,
  BOOLEAN = STRING << 1,
  NUMBER = BOOLEAN << 1,
  OPTIONAL = NUMBER << 1,
  OBJECT_OR_ARRAY = OBJECT | ARRAY,
  ANY_PRIMITIVE = STRING | NUMBER | BOOLEAN,
  ANY = OBJECT | ARRAY | ANY_PRIMITIVE,
  STRING_OR_NUMBER = STRING | NUMBER
};

const NATIVE_ELEMENT_TYPE_KINDS = {
  a: {
    href: InferredTypeKind.STRING
  }
};

const NO_ATTR_TYPE_KINDS = {};

export type InferredType = [InferredTypeKind, any];

type InferredSymbolTable = {
  context: InferredType;

  // current scope where inferred types should be applied do if
  // the path matches. E.g: <div [[repeat each items as item]] /> would
  // define a current scope of { item: ["items"] } for the repeated div element
  currentScope: {
    [identifier: string]: string[]
  }
};

type SymbolTableEntry = [string[] | undefined[], InferredType];
type SymbolTableEntries = SymbolTableEntry[];

const getScopedSymbolTablePath = (path: string[], table: InferredSymbolTable) => {
  const scopePath = table.currentScope[path[0]];
  if (scopePath) {
    path = [...scopePath, ...path];
  }
  return path;
}

const getSymbolTablePropType = (path: string[], table: InferredSymbolTable) => {
  const scopePath = getScopedSymbolTablePath(path, table);
  let current = table.context;
  for (let i = 0, {length} = path; i < length; i++)  {
    const key = path[i];
    if (!current[1] || !current[1][key]) return undefined;
    current = current[1][key];
  }
  return current;
};

const addSymbolTableScope = (key: string, path: string[], table: InferredSymbolTable) => ({
  ...table,
  currentScope: {
    ...table.currentScope,
    [key]: path
  }
});

const removeSymbolTableScope = (key: string, table: InferredSymbolTable) => ({
  ...table,
  currentScope: {
    ...table.currentScope,
    [key]: undefined
  }
});

const setSymbolTablePropType = (path: string[], type: InferredType, table: InferredSymbolTable): InferredSymbolTable => {
  if (!path) return table;
  const newContext = setNestedType(table.context, path, type);
  return updateSymbolTableContext(newContext, table);
};

const updateSymbolTableContext = (context: InferredType, table: InferredSymbolTable) => {
  return {...table, context};
};

const setNestedType = (root: InferredType, path: string[], type: InferredType, index: number = 0): [InferredTypeKind, any] => {
  const key = path[index];

  if (index === path.length) {
    return [...type] as any;
  } else {

    let newRoot = [...root];

    if (root[0] === InferredTypeKind.ANY) {
      newRoot = [InferredTypeKind.OBJECT, {}]
    } else if (!(root[0] & InferredTypeKind.ARRAY) && !(root[0] & InferredTypeKind.OBJECT)) {
      // ADD ERROR
    }
    const props = newRoot[1] || {};

    newRoot = [newRoot[0], {
      ...props,
      [key]: setNestedType(props[key] || [InferredTypeKind.OBJECT, props], path, type, index + 1)
    }]; 

    return newRoot as any;
  }
};

const entry = (path: string[] | null, type: InferredType): SymbolTableEntry => [path, type];
export const inferredType = (type: InferredTypeKind, props: any = null): InferredType => [type, props];
const symbolTable = (context: InferredType = inferredType(InferredTypeKind.OBJECT, {})) => ({ context, currentScope: {} });

const getEntryPath = (entry: SymbolTableEntry) => entry[0];
const getEntryType = (entry: SymbolTableEntry) => entry[1];

/**
 * analyzes the component, and infers types based on how data is used, not by the properties defined. This is to ensure that HOCs have more room to define different types that still work with the component.
 */

export const inferComponentPropTypes = (component: Component): InferredType => {
  return addInferredChildNodeTypes(component.template.childNodes, symbolTable()).context;
};

const addInferredNodeTypes = (node: PCExpression, table: InferredSymbolTable) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return table;
    case PCExpressionType.BLOCK: return addInferredTextBlockTypes((node as PCBlock), table);
    case PCExpressionType.FRAGMENT: return addInferredChildNodeTypes((node as PCFragment).childNodes, table);
    case PCExpressionType.ELEMENT:
    case PCExpressionType.SELF_CLOSING_ELEMENT: return addInferredElementTypes(node as PCElement, table);
  }
  return table;
};

const addInferredElementTypes = (element: PCElement|PCSelfClosingElement, table: InferredSymbolTable) => {
  table = addInferredElementStartTagTypes(element, table);

  if (!getPCElementModifier(element, BKExpressionType.REPEAT)) {
    table = addInferredChildNodeTypes(getElementChildNodes(element), table);
  }

  return table;
};

const addInferredTextBlockTypes = (block: PCBlock, table: InferredSymbolTable) => {
  let entries;
  [entries, table] = inferExpressionTypes(block.value, table);
  // return mergeInferredTypeKind(context, inferExpressionTypes(block.value, table))
  return table;
};

const stripEntryTypeKinds = (entries: SymbolTableEntry[], matchKind: InferredTypeKind, table: InferredSymbolTable) => {
  return updateEntries(entries.map(([path, [kind, props]]) => (
    path && entry(path, inferredType(kind & matchKind, props))
  )), table);
};

const updateEntries = (entries: SymbolTableEntry[], table: InferredSymbolTable): [SymbolTableEntries, InferredSymbolTable] => {
  const newEntries: SymbolTableEntry[] = [];
  for (let i = 0, {length} = entries; i < length; i++) {
    const entry = entries[i];
    table = setSymbolTablePropType(entry[0], entry[1], table);
    newEntries.push(entry);
  }

  return [newEntries, table];
};

const updateEntryTypes = (entries: SymbolTableEntry[], type: InferredType, table: InferredSymbolTable) => {
  return updateEntries(entries.map(([path, [kind, props]]) => entry(path, type)), table);
};

const mergeInferredTypeKind = (target: [InferredTypeKind, any], source: [InferredTypeKind, any]): [InferredTypeKind, any] => {
  if (target[0] === InferredTypeKind.OBJECT || target[0] === InferredTypeKind.ARRAY) {
    if (source[0] !== target[0]) {
      return target;
    }
    const targetProps = target[1];
    const sourceProps = source[1];
    const mergedProps = {};
    for (const key in targetProps) {
      mergedProps[key] = sourceProps[key] ? mergeInferredTypeKind(targetProps[key], sourceProps[key]) : targetProps[key];
    }

    for (const key in sourceProps) {
      if (targetProps[key]) continue;
      mergedProps[key] = sourceProps[key];
    }

    return [target[0], mergedProps];
  } else {
    return [target[0] & source[0], undefined];
  }
};  

const inferExpressionTypes = (block: BKExpression, table: InferredSymbolTable): [SymbolTableEntries, InferredSymbolTable] => {
  switch(block.type) {
    case BKExpressionType.OPERATION:
      const { left, operator, right } = block as BKOperation;

      let leftEntries: SymbolTableEntries;
      let rightEntries: SymbolTableEntries;

      [leftEntries, table] = inferExpressionTypes(left, table);

      // TODO - merge context with leftProps
      [rightEntries, table] = inferExpressionTypes(right, table);

      let entries = [...leftEntries, ...rightEntries];

      let opType;

      // definitely numerical if there is a match here
      if (/^[\*/\-%]$/.test(operator)) {
        for (let i = 0, {length} = entries; i < length; i++) {
          const [path, [type]] = entries[i];
          table = setSymbolTablePropType(path, [type & InferredTypeKind.NUMBER, null], table);
        }

      // string, numbers, or a combination of the two. a+1 should still register
      // a as a string or number since that's valid syntax.
      } else if (operator === "+") {

        return updateEntryTypes(entries, inferredType(InferredTypeKind.STRING_OR_NUMBER), table);
      } else if (operator === "===" || operator === "!==") {

        const strippedTypeKind = entries.reduce((a, b) => (
          a & getEntryType(b)[0]
        ), InferredTypeKind.ANY);

        return updateEntryTypes(entries, inferredType(strippedTypeKind), table) as [SymbolTableEntries, InferredSymbolTable];
      }

      return [entries, table];

    case BKExpressionType.STRING: return [[entry(null, inferredType(InferredTypeKind.STRING))], table];
    case BKExpressionType.NUMBER: return [[entry(null, inferredType(InferredTypeKind.NUMBER))], table];
    case BKExpressionType.VAR_REFERENCE:
    case BKExpressionType.PROP_REFERENCE: {

      const path = block.type === BKExpressionType.VAR_REFERENCE ? [(block as BKVarReference).name] : (block as BKPropertyReference).path.map(part => part.name)
      const scopedPath = getScopedSymbolTablePath(path, table);

      let propType = getSymbolTablePropType(scopedPath, table);
      let newEntry;
      if (!propType) {
        table = setSymbolTablePropType(scopedPath, propType = [InferredTypeKind.ANY, null], table);
      }

      return [[entry(scopedPath, propType)], table];
    }
    case BKExpressionType.BIND: {
      const v = block as BKBind;
      return inferExpressionTypes(v.value, table);
    }
    case BKExpressionType.GROUP: {
      const v = block as BKGroup;
      return inferExpressionTypes(v.value, table);
    }
    default: {
      throw new Error(`Unexpected expression ${block.type}`);
    }
  }
}

const addInferredElementStartTagTypes = (element: PCElement|PCSelfClosingElement, table: InferredSymbolTable) => {

  const startTag = getStartTag(element);

  let _if: BKIf;
  let _else: BKElse;
  let _elseif: BKElseIf;
  let _repeat: BKRepeat;

  for (const modifier of startTag.modifiers)  {
    if (modifier.value.type === BKExpressionType.IF) {
      _if = modifier.value as BKIf;
    } else if (modifier.value.type === BKExpressionType.ELSEIF) {
      _elseif = modifier.value as BKElseIf;
    } else if (modifier.value.type === BKExpressionType.ELSE) {
      _else = modifier.value as BKElse;
    } else if (modifier.value.type === BKExpressionType.REPEAT) {
      _repeat = modifier.value as BKRepeat;
    }
  }

  if (_if || _elseif) {
    const { condition } = _if || _elseif;
    let conditionEntries: SymbolTableEntries;
    [conditionEntries, table] = inferExpressionTypes(condition, table);
  }

  if (_repeat) {
    const {each, asKey, asValue} = _repeat;

    let asValueEntries: SymbolTableEntries;
    let eachEntries: SymbolTableEntries;

    [eachEntries, table] = inferExpressionTypes(each, table);
    [eachEntries, table] = stripEntryTypeKinds(eachEntries, InferredTypeKind.OBJECT_OR_ARRAY, table);
    [asValueEntries] = inferExpressionTypes(asValue, table);
    
    const eachEntryPath = getEntryPath(eachEntries[0]);
    const asEntryKey = getEntryPath(asValueEntries[0])[0];
    table = addSymbolTableScope(asEntryKey, eachEntryPath, table);
    table = addInferredElementAttributeTypes(element, table);
    table = addInferredChildNodeTypes(getElementChildNodes(element), table);
    table = removeSymbolTableScope(asEntryKey, table);
  } else {
    table = addInferredElementAttributeTypes(element, table);
  }

  return table;
};

const addInferredElementAttributeTypes = (element: PCElement|PCSelfClosingElement, table: InferredSymbolTable) => {
  const tag = getStartTag(element);
  const attributes = getElementAttributes(element);
  let entries;

  const attrTypeKinds = NATIVE_ELEMENT_TYPE_KINDS[tag.name] || NO_ATTR_TYPE_KINDS;

  for (let i = 0, {length} = attributes; i < length; i++) {
    const {value, name} = attributes[i];    
    if (value.type === PCExpressionType.BLOCK) {
      [entries, table] = inferExpressionTypes(((value as PCBlock).value as BKBind).value, table);

      const kind = attrTypeKinds[name];

      if (kind) {
        [entries, table] = stripEntryTypeKinds(entries, kind, table);
      }
    }
  }
  
  return table;
};

const addInferredChildNodeTypes = (childNodes: PCExpression[], table: InferredSymbolTable) => {

  for (const child of childNodes) {
    table = addInferredNodeTypes(child, table);
  }

  return table;
};
