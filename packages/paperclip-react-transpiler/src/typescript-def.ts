/*

TODOS:

- [ ] transpile component prop types
- [ ] infer types based on how they are used in component
*/

import { upperFirst, camelCase } from "lodash";
import * as path from "path";
import { loadModuleAST, parseModuleSource, Module, Component, loadModuleDependencyGraph, DependencyGraph, Dependency, traversePCAST, PCElement, getStartTag, isTag, getChildComponentInfo, getComponentDependency, getUsedDependencies, PCExpression, PCExpressionType, PCFragment, PCSelfClosingElement, getElementModifiers, getPCElementModifier, BKExpressionType, getElementChildNodes, PCBlock, BKExpression, BKOperation, BKPropertyReference, BKVarReference, BKArray, BKBind, BKRepeat } from "paperclip";
import { basename, relative } from "path";
import { ComponentTranspileInfo, getComponentTranspileInfo, getComponentClassName, getComponentFromModule, getImportsInfo, ImportTranspileInfo, getImportFromDependency, getTemplateSlotNames } from "./utils";

export const transpileToTypeScriptDefinition = (graph: DependencyGraph, uri: string) => {
  return transpileModule(graph[uri], graph);
};

const transpileModule = (entry: Dependency, graph: DependencyGraph) => {
  let content = ``;
  const { module } = entry;

  const baseName = getImportBaseName(module.uri);
  const allDeps = getUsedDependencies(entry, graph);
  const importTranspileInfo: ImportTranspileInfo[] = getImportsInfo(entry, allDeps);

  content += `import * as React from "react";\n`;

  importTranspileInfo.forEach(({ varName, relativePath }) => {
    content += `import * as ${varName} from "${relativePath}";\n`;
  });

  content += `\n`;
  
  content += `type Enhancer<TInner, TOuter> = (BaseComponent: React.ComponentClass<TInner>) => React.ComponentClass<TOuter>;\n\n`;

  const componentTranspileInfo = module.components.map(getComponentTranspileInfo);

  componentTranspileInfo.forEach((info) => {
    content += transpileComponentTypedInformation(info, importTranspileInfo, graph)
  });

  return content;
};

const getImportBaseName = (href: string) => upperFirst(camelCase(path.basename(href).split(".").shift()));

const transpileComponentTypedInformation = ({ className, component, propTypesName, enhancerName }: ComponentTranspileInfo, importTranspileInfo: ImportTranspileInfo[], graph: DependencyGraph) => {

  const inferenceTypeInfo = inferComponentPropTypes(component);
  console.log(inferenceTypeInfo);

  // props first
  let content = ``;
  const classPropsName = propTypesName;

  content += `` +
  `export type ${classPropsName} = {\n` +
    component.properties.map(({name}) => (
      `  ${name}: any;\n`
    )).join("") +

    getTemplateSlotNames(component.template).map((slotName) => (
      `  ${slotName}: any;\n`
    )).join("") +
  `};\n\n`;

  // then hydrator
  const childComponentDependencies = getChildComponentInfo(component.template, graph);

  const childComponentClassesTypeName = `${className}ChildComponentClasses`;

  content += `type ${childComponentClassesTypeName} = {\n`;
  for (const childComponentTagName in childComponentDependencies) {
    const childComponentDependency = childComponentDependencies[childComponentTagName];
    const childComponent = getComponentFromModule(childComponentTagName, childComponentDependency.module);
    const childComponentInfo = getComponentTranspileInfo(childComponent);
    const childImport = getImportFromDependency(importTranspileInfo, childComponentDependency);
    let refPath = childImport ? `${childImport.varName}.${childComponentInfo.propTypesName}` : childComponentInfo.propTypesName;
    content += `  ${childComponentInfo.className}: React.StatelessComponent<${refPath}> | React.ComponentClass<${refPath}>;\n`
  }
  content += `};\n\n`;

  // _all_ component classes here are required to notify engineers of any changes to PC components. This only
  // happens when the typed definition file is regenerated. Internally, Paperclip doesn't care if child components are provides, and will provide the default "dumb" version of components.
  content += `export function hydrate${className}<TOuter>(enhancer: Enhancer<${propTypesName}, TOuter>, childComponentClasses: ${childComponentClassesTypeName}): React.ComponentClass<${propTypesName}>;\n\n`

  return content;
}

const transpileComponentPropTypes = ({ className, component }: ComponentTranspileInfo) => {
  let content = ``;
  const classPropsName = `${className}Props`;

  content += `` +
  `export type ${classPropsName} = {\n` +
    component.properties.map(({name}) => (
      `  ${name}: any;\n`
    )).join("") +
  `};\n\n`;



  return content;
};

enum InferredType {
  OBJECT = 1,
  ARRAY = OBJECT << 1,
  STRING = ARRAY << 1,
  BOOLEAN = STRING << 1,
  NUMBER = BOOLEAN << 1,
  OPTIONAL = NUMBER << 1,
  ANY_PRIMITIVE = STRING | NUMBER | BOOLEAN,
  ANY = OBJECT | ARRAY | ANY_PRIMITIVE,
  STRING_OR_NUMBER = STRING | NUMBER
};

type Inferred = [InferredType, any];

/**
 * analyzes the component, and infers types based on how data is used, not by the properties defined. This is to ensure that HOCs have more room to define different types that still work with the component.
 */

const inferComponentPropTypes = (component: Component) => {
  return addInferredChildNodeTypes(component.template.childNodes, [InferredType.OBJECT, {}]);
};

const addInferredNodeTypes = (node: PCExpression, context: Inferred) => {
  switch(node.type) {
    case PCExpressionType.TEXT_NODE: return context;
    case PCExpressionType.BLOCK: return addInferredTextBlockTypes((node as PCBlock), context);
    case PCExpressionType.FRAGMENT: return addInferredChildNodeTypes((node as PCFragment).childNodes, context);
    case PCExpressionType.ELEMENT:
    case PCExpressionType.SELF_CLOSING_ELEMENT: return addInferredElementTypes(node as PCElement, context);
  }
  return context;
};

const addInferredElementTypes = (element: PCElement|PCSelfClosingElement, context: Inferred) => {
  let newProps = addInferredElementAttributeTypes(element, context);

  newProps = addInferredChildNodeTypes(getElementChildNodes(element), context);

  const repeatModifierBlock = getPCElementModifier(element, BKExpressionType.IF);
  if (repeatModifierBlock) {
    console.log(newProps);
  }

  return newProps;
};

const addInferredTextBlockTypes = (block: PCBlock, context: Inferred) => {
  return mergeInferredType(context, inferExpressionTypes(block.value, context))
};

const mergeInferredType = (target: [InferredType, any], source: [InferredType, any]): [InferredType, any] => {
  if (target[0] === InferredType.OBJECT || target[0] === InferredType.ARRAY) {
    if (source[0] !== target[0]) {
      return target;
    }
    const targetProps = target[1];
    const sourceProps = source[1];
    const mergedProps = {};
    for (const key in targetProps) {
      mergedProps[key] = sourceProps[key] ? mergeInferredType(targetProps[key], sourceProps[key]) : targetProps[key];
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

const inferExpressionTypes = (block: BKExpression, context: Inferred): [InferredType, any] => {
  switch(block.type) {
    case BKExpressionType.OPERATION:
      const { left, operator, right } = block as BKOperation;

      const [leftType, leftProps] = inferExpressionTypes(left, context);

      // TODO - merge context with leftProps
      const [rightType, rightProps] = inferExpressionTypes(right, mergeInferredType(context, [leftType, leftProps]));

      let opType;

      // definitely numerical if there is a match here
      if (/^[*/-%]$/.test(operator)) {
        return [InferredType.NUMBER, null];

      // maaaaybe it's a number? Maaaybe it's a string 🤷🏻‍♂️
      } else if (operator === "+") {
        
        // a + b == unknown, so allow for string or number
        if (leftType === InferredType.ANY_PRIMITIVE && rightType === InferredType.ANY_PRIMITIVE) {
          return [InferredType.STRING_OR_NUMBER, null];
        }

        // otherwise figure out where the types are the same. Examples:
        // a + 1 == number
        // "" + a == number
        // a + true === 0 (invalid :o)
        return [InferredType.STRING_OR_NUMBER & leftType & rightType, null];
      }

    break;
    case BKExpressionType.STRING: return [InferredType.STRING, null];
    case BKExpressionType.NUMBER: return [InferredType.NUMBER, null]; 
    case BKExpressionType.VAR_REFERENCE: {
      const ref = block as BKVarReference;
      return [InferredType.OBJECT, { [ref.name]: [InferredType.ANY], ...context[1] }];
    }
    // case BKExpressionType.PROP_REFERENCE: {
    //   // const ref = block as BKPropertyReference;
    //   // let current = {};
    //   // let ccontext = context;
    //   // let i = 0;
    //   // for (let {length} = ref.path; i < length - 1; i++) {
    //   //   current[ref.path[i].name] = [InferredType.OBJECT, current = {}];
    //   //   contextPart = ccontext[1][ref.path[i].name] || current[ref.path[i].name];
    //   // }

    //   // current[ref.path[i].name] = [InferredType]
    //   // return [InferredType.OBJECT, { [ref.path.]: context[ref.name] || InferredType.ANY }];

    // }
    case BKExpressionType.ARRAY: {

      // not supported yet
      return [InferredType.ARRAY, {}];
      // const ary = block as BKArray;
      // return ary.values.reduce(([type, props], value) => {
      //   return [InferredType.ARRAY, mergeInferredType([type, props] as any, inferExpressionTypes(value, mergeInferredType([type, props], context))];
      // }, [InferredType.ARRAY, {}]) as [InferredType, any];
    }
    case BKExpressionType.BIND: {
      const v = block as BKBind;
      return inferExpressionTypes(v.value, context);
    }
    case BKExpressionType.REPEAT: {
      const v = block as BKRepeat;
      // let ret = inferExpressionTypes(v.asKey, context);

      // return inferExpressionTypes(v., context);
    }
    default: {
      throw new Error(`Unexpected expression ${block.type}`);
    }
  }
}

const addInferredElementAttributeTypes = (element: PCElement|PCSelfClosingElement, context: Inferred) => {
  let properties = context;

  const startTag = getStartTag(element);

  for (const modifier of startTag.modifiers)  {
    
  }
  
  return properties;
};

const addInferredChildNodeTypes = (childNodes: PCExpression[], context: Inferred) => {
  let properties = context;

  for (const child of childNodes) {
    properties = addInferredNodeTypes(child, properties);
  }

  return properties;
};