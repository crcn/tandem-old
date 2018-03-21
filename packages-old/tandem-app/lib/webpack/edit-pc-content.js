// // import { Mutation } from "aerial-common2";
// import { Mutation } from "source-mutation";
// module.exports = (content: string, mutation: Mutation<any>, filePath: string) => {
// }
// // import { parse } from "./parser";
// // import { PCExpression, PCParent, PCFragment, PCElement, PCString, PCExpressionType, PCSelfClosingElement, PCStartTag, PCAttribute } from "./ast";
// // import { repeat } from "lodash";
// // import { parsePCStyle } from "./style-parser";
// // import { PCStyleExpressionType, PCGroupingRule, PCStyleRule } from "./style-ast";
// // import { SyntheticDOMElementMutationTypes, CSS_STYLE_RULE_SET_STYLE } from "aerial-browser-sandbox";
// // import { editString, Mutation, weakMemo, ExpressionLocation, SetPropertyMutation, StringMutation, createStringMutation, expressionLocationEquals } from "aerial-common2";
// // export const editPCContent = weakMemo((content: string, mutation: Mutation<any>) => {
// //   const ast = parse(content);
// //   const targetNode = findTargetNode(ast, mutation.target.source);
// //   if (!targetNode) {
// //     const targetNodeFromSub = findTargetNodeFromSub(ast, mutation.target.source);
// //     if (targetNodeFromSub) {
// //       return editSubPCContent(targetNodeFromSub, content, mutation);
// //     }
// //     console.warn(`Could not find PC AST node for ${mutation.$type}`);
// //     return content;
// //   }
// //   switch(mutation.$type) {
// //     case SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT: {
// //       return editElementAttribute(targetNode, mutation as SetPropertyMutation<any>);
// //     }
// //   }
// //   return createStringMutation(0, 0, ``);
// // });
// // const editSubPCContent = (target: PCString, content: string, mutation: Mutation<any>) => {
// //   // assume CSS for now
// //   const cssAST =  parsePCStyle(repeat(" ", target.location.start.pos - (target.location.start.line - 1)) +repeat("\n", target.location.start.line - 1) + target.value);
// //   const targetRule = findTargetSheetRule(cssAST, mutation.target.source);
// //   if (!targetRule) {
// //     console.warn(`Cannot find CSS rule for ${mutation.$type}`);
// //     return createStringMutation(0, 0, ``);
// //   }
// //   switch(mutation.$type) {
// //     case CSS_STYLE_RULE_SET_STYLE: {
// //       return editStyleRuleDeclaration(targetRule, mutation as SetPropertyMutation<any>);
// //     }
// //   }
// // }
// // const astLocationEquals = (ast: { location: Partial<ExpressionLocation> }, location: ExpressionLocation) => ast.location.start.line === location.start.line && ast.location.start.column === location.start.column && ast.location.end.line === location.end.line && ast.location.end.column === location.end.column;
// // const findTargetNode = (ast: PCExpression, location: ExpressionLocation) => {
// //   if (astLocationEquals(ast, location)) {
// //     return ast;
// //   }
// //   if (ast.type === PCExpressionType.FRAGMENT || ast.type === PCExpressionType.ELEMENT) {
// //     for (const child of (ast as PCFragment).children) {
// //       const found = findTargetNode(child, location);
// //       if (found) return found;
// //     }
// //   }
// // }
// // const findTargetSheetRule = (ast: PCGroupingRule, location: ExpressionLocation) => {
// //   if (astLocationEquals(ast, location)) {
// //     return ast;
// //   }
// //   for (const child of ast.children) {
// //     const found = findTargetSheetRule(child, location);
// //     if (found) return found;
// //   }
// // }
// // const findTargetNodeFromSub = (ast: PCExpression, location: ExpressionLocation) => {
// //     // TODO - need to check target kind as well
// //     // check if we're editing a string value (there may be a sep parser involved)
// //     if (ast.type === PCExpressionType.STRING && ((ast.location.start.line === location.start.line && ast.location.start.column <= location.start.column) || ast.location.start.line < location.start.line) && ((ast.location.end.line === location.end.line && ast.location.end.column >= location.end.column) || ast.location.end.line > location.end.line)) {
// //       return ast;
// //     }
// //     if (ast.type === PCExpressionType.FRAGMENT || ast.type === PCExpressionType.ELEMENT) {
// //       for (const child of (ast as PCFragment).children) {
// //         const found = findTargetNodeFromSub(child, location);
// //         if (found) return found;
// //       }
// //     }
// //   }
// // const editElementAttribute = (target: PCExpression, mutation: SetPropertyMutation<any>) => {
// //   let startTag: PCSelfClosingElement | PCStartTag;
// //   if (target.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
// //     startTag = target as PCSelfClosingElement;
// //   } else if (target.type === PCExpressionType.ELEMENT) {
// //     startTag = (target as PCElement).startTag;
// //   }
// //   let found;
// //   let mutations: StringMutation[] = [];
// //   const mutateAttrName = mutation.name;
// //   const mutateAttrValue = mutation.newValue && `"${mutation.newValue}"`;
// //   for (const attribute of startTag.attributes) {
// //     // TODO - need to consider spreads
// //     const attr = attribute as PCAttribute;
// //     if (attr.name === mutateAttrName) {
// //       found = true;
// //       // if the attribute value is undefined, then remove it
// //       if (!mutateAttrValue) {
// //         return createStringMutation(attr.location.start.pos, attr.location.end.pos, ``);
// //       } else {
// //         return createStringMutation(attr.value.location.start.pos, attr.value.location.end.pos, mutateAttrValue);
// //       }
// //     }
// //   }
// //   if (!found) {
// //     const insertIndex = startTag.location.start.pos + startTag.name.length + 1;
// //     return createStringMutation(insertIndex, insertIndex, ` ${mutateAttrName}=${mutateAttrValue}`);
// //   }
// // };
// // const editStyleRuleDeclaration = (target: PCStyleRule, { newValue }: SetPropertyMutation<any>) => {
// //   const prettyStyleText = newValue.split(/\s*;\s*/g).join(";\n");
// //   // not tested
// //   return createStringMutation(
// //     target.location.start.pos,
// //     target.location.end.pos + 1,
// //     `${target.selectorText.trim()} {
// //       ${prettyStyleText}
// //     }`
// //   );
// // }
//# sourceMappingURL=edit-pc-content.js.map