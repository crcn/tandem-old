import { parseModuleSource } from "./parser";
import { PCExpression, PCParent, PCFragment, PCElement, PCString, PCExpressionType, PCSelfClosingElement, PCStartTag, PCAttribute } from "./ast";
import { repeat } from "lodash";
import { ExpressionLocation, CSSGroupingRule, CSSStyleRule, PCTextNode, PCBlock } from "./ast";
import { CSS_STYLE_RULE_SET_STYLE, SET_ELEMENT_ATTRIBUTE_EDIT, INSERT_CHILD_NODE_EDIT, UPDATE_VALUE_NODE, REMOVE_CHILD_NODE_EDIT } from "aerial-browser-sandbox/constants";
import { Mutation, SetPropertyMutation, createStringMutation, StringMutation, InsertChildMutation, RemoveChildMutation, SetValueMutation, REMOVE_CHILD_MUTATION, INSERT_CHILD_MUTATION } from "source-mutation";

export const editPaperclipSource = (content: string, mutation: Mutation<any>) => {

  const ast = parseModuleSource(content);
  const targetNode = findTargetNode(ast, mutation.target.source);

  if (!targetNode) {
    return createStringMutation(0, 0, ``);
  }
  

  switch(mutation.type) {
    case UPDATE_VALUE_NODE: {
      return editNodeValue(targetNode as PCTextNode, mutation as SetValueMutation<any>);
    }
    case SET_ELEMENT_ATTRIBUTE_EDIT: {
      return editElementAttribute(targetNode, mutation as SetPropertyMutation<any>);
    }
    case REMOVE_CHILD_NODE_EDIT: {
      return removeChild(targetNode as PCParent, mutation as RemoveChildMutation<any, any>);
    }
    case INSERT_CHILD_NODE_EDIT: {
      return insertChild(targetNode as PCParent, mutation as RemoveChildMutation<any, any>, content);
    }
  }

  return createStringMutation(0, 0, ``);
};


const astLocationEquals = (ast: { location: Partial<ExpressionLocation> }, location: ExpressionLocation) => ast.location.start.line === location.start.line && ast.location.start.column === location.start.column && ast.location.end.line === location.end.line && ast.location.end.column === location.end.column;

const findTargetNode = (ast: PCExpression, location: ExpressionLocation) => {
  if (astLocationEquals(ast, location)) {
    return ast;
  }
  
  if (ast.type === PCExpressionType.FRAGMENT || ast.type === PCExpressionType.ELEMENT) {
    for (const child of (ast as PCFragment).childNodes) {
      const found = findTargetNode(child, location);
      if (found) return found;
    }
  }
}

const findTargetSheetRule = (ast: any, location: ExpressionLocation) => {
  if (astLocationEquals(ast, location)) {
    return ast;
  }

  for (const child of ast.children) {
    const found = findTargetSheetRule(child, location);
    if (found) return found;
  }
}

const findTargetNodeFromSub = (ast: PCExpression, location: ExpressionLocation) => {
  
  // TODO - need to check target kind as well
  // check if we're editing a string value (there may be a sep parser involved)
  if (ast.type === PCExpressionType.STRING && ((ast.location.start.line === location.start.line && ast.location.start.column <= location.start.column) || ast.location.start.line < location.start.line) && ((ast.location.end.line === location.end.line && ast.location.end.column >= location.end.column) || ast.location.end.line > location.end.line)) {
    return ast;
  }
  
  if (ast.type === PCExpressionType.FRAGMENT || ast.type === PCExpressionType.ELEMENT) {
    for (const child of (ast as PCFragment).childNodes) {
      const found = findTargetNodeFromSub(child, location);
      if (found) return found;
    }
  }
}

const removeChild = (parent: PCFragment, { index }: RemoveChildMutation<any, any>) => {
  const child = parent.childNodes[index];
  return createStringMutation(child.location.start.pos, child.location.end.pos, ``);
}

const insertChild = (parent: PCFragment, { index, child }: InsertChildMutation<any, any>, source: string) => {
  const content = child.outerHTML || child.nodeValue;
  if (parent.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    const parentElement = parent as any as PCSelfClosingElement;
    return createStringMutation(eatWhitespace(parentElement.location.end.pos - 2, source), parentElement.location.end.pos, ">" + content + `</${parentElement.name}>`);
  }
  const beforeChild = parent.childNodes[index];
  if (!beforeChild) {
    const parentElement = parent as PCElement;
    return createStringMutation(parentElement.startTag.location.end.pos, parentElement.startTag.location.end.pos, content);
  }
  return createStringMutation(beforeChild.location.start.pos, beforeChild.location.start.pos, content);
}

const eatWhitespace = (pos: number, content: string) => {
  const reverse = content.substr(0, pos).split("").reverse().join("");
  const [match, ws] = reverse.match(/^([\s\r\n\t]+)/) || ["", ""];
  return pos - ws.length;
}

const editNodeValue = (target: PCTextNode, { newValue }: SetValueMutation<any>) => {
  return createStringMutation(target.location.start.pos, target.location.end.pos, newValue);
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

        // remove the whitespace before attribute
        return createStringMutation(attr.location.start.pos - 1, attr.location.end.pos, ``);
      } else {
        return createStringMutation(attr.value.location.start.pos, attr.value.location.end.pos, mutateAttrValue);
      }
    }
  }

  if (!found) {
    const insertIndex = startTag.location.start.pos + startTag.name.length + 1;
    return createStringMutation(insertIndex, insertIndex, mutation.newValue === true ? mutateAttrName : ` ${mutateAttrName}=${mutateAttrValue}`);
  }
};
  
const editStyleRuleDeclaration = (target: CSSStyleRule, { newValue }: SetPropertyMutation<any>) => {

  const prettyStyleText = newValue.split(/\s*;\s*/g).join(";\n");

  // not tested
  return createStringMutation(
    target.location.start.pos,
    target.location.end.pos + 1,
    `${target.selectorText.trim()} {
      ${prettyStyleText}
    }`
  );
}

