import { parse } from "./parser";
import { PCExpression, PCParent, PCFragment, PCElement, PCString, PCExpressionType, PCSelfClosingElement, PCStartTag, PCAttribute } from "./ast";
import { SyntheticDOMElementMutationTypes } from "aerial-browser-sandbox";
import { editString, Mutation, weakMemo, ExpressionLocation, SetPropertyMutation, StringMutation, createStringMutation, expressionLocationEquals } from "aerial-common2";

export const editPCContent = weakMemo((content: string, mutation: Mutation<any>) => {
  const ast = parse(content);
  const targetNode = findTargetNode(ast, mutation.target.source);

  if (!targetNode) {
    console.warn(`Could not find PC AST node for ${mutation.$type}`);
    return content;
  }

  switch(mutation.$type) {
    case SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT: {
      return editElementAttribute(targetNode, mutation as SetPropertyMutation<any>);
    }
  }

  return content;
});

const findTargetNode = (ast: PCExpression, location: ExpressionLocation) => {
  if (ast.location.start.line === location.start.line && ast.location.start.column === location.start.column && ast.location.end.line === location.end.line && ast.location.end.column === location.end.column) {
    return ast;
  }
  
  if (ast.type === PCExpressionType.FRAGMENT || ast.type === PCExpressionType.ELEMENT) {
    for (const child of (ast as PCFragment).children) {
      const found = findTargetNode(child, location);
      if (found) return found;
    }
  }
}


const editElementAttribute = (target: PCExpression, mutation: SetPropertyMutation<any>) => {
  
    let startTag: PCSelfClosingElement | PCStartTag;

  
    if (target.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
      startTag = target as PCSelfClosingElement;
    } else if (target.type === PCExpressionType.ELEMENT) {
      startTag = (target as PCElement).startTag;
    }
  
    let found;
    
    let mutations: StringMutation[] = [];
  
    const mutateAttrName = mutation.name;
    const mutateAttrValue = mutation.newValue && `"${mutation.newValue}"`;

    for (const attribute of startTag.attributes) {
  
      // TODO - need to consider spreads
      const attr = attribute as PCAttribute;
      if (attr.name === mutateAttrName) {
        found = true;
  
        // if the attribute value is undefined, then remove it
        if (!mutateAttrValue) {
          return createStringMutation(attr.location.start.pos, attr.location.end.pos, ``);
        } else {
          return createStringMutation(attr.value.location.start.pos, attr.value.location.end.pos, mutateAttrValue);
        }
      }
    }
  
    if (!found) {
      const insertIndex = startTag.location.start.pos + startTag.name.length + 1;
      return createStringMutation(insertIndex, insertIndex, ` ${mutateAttrName}=${mutateAttrValue}`);
    }
  };
  