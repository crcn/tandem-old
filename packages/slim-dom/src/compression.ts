import { SlimVMObjectType, SlimBaseNode, SlimElement, SlimElementAttribute, SlimParentNode, VMObjectSource, SlimTextNode, SlimCSSGroupingRule, SlimCSSAtRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimStyleElement,  } from "./state";
import  { weakMemo, getVmObjectSourceUris } from "./utils";

export type CompressedFragment = [SlimVMObjectType, any[]];
export type CompressedTextNode = [SlimVMObjectType, string];
export type CompressedAttributes = [string, string];
export type CompressedElement = [SlimVMObjectType, CompressedAttributes[], any[], any[]];
export type CompressedNode = any[];

export type CompressionResult = [string[], any];

export const compressRootNode = weakMemo((root: SlimBaseNode): CompressionResult => {
  return [getVmObjectSourceUris(root), compressVMObject(root)] as any;
});

const compressVMObject = (node: SlimBaseNode) => {
  switch (node.type) {
    case SlimVMObjectType.TEXT: return [node.type, (node as SlimTextNode).value];
    case SlimVMObjectType.ELEMENT: {
      const { type, tagName, attributes, shadow, childNodes } = node as SlimElement;
      const attribs = [];
      for (const attribute of attributes) {
        attribs.push([attribute.name, attribute.value]);
      }
      const base = [
        type,
        tagName,
        attribs,
        shadow ? compressVMObject(shadow) : null,
        childNodes.map(child => compressVMObject(child))
      ];

      if (tagName === "style") {
        base.push(compressVMObject((node as SlimStyleElement).sheet));
      }

      return base;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const { type, childNodes } = node as SlimParentNode;
      return [
        type,
        childNodes.map(child => compressVMObject(child))
      ];
    }
    case SlimVMObjectType.STYLE_SHEET: {
      const { type, rules } = node as SlimCSSStyleSheet;
      return [
        type,
        rules.map(rule => compressVMObject(rule))
      ]
    }
    case SlimVMObjectType.STYLE_RULE: {
      const { type, selectorText, style, source } = node as SlimCSSStyleRule;
      const decl = [];
      for (const key in style) {
        decl.push([key, style[key]]);
      }

      return [
        type,
        selectorText,
        decl
      ]
    }
    case SlimVMObjectType.AT_RULE: {
      const { type, name, params, rules } = node as SlimCSSAtRule;
      return [
        type,
        name,
        params,
        rules.map(rule => compressVMObject(rule))
      ]
    }
  }
};

export const uncompressRootNode = ([sources, node]: CompressionResult): SlimBaseNode  => {
  return uncompressVMObject(node);
}

const uncompressVMObject = (node: any) => {
  switch(node[0]) {
    case SlimVMObjectType.TEXT: {
      const [type, value] = node;
      return {
        type,
        value,
      } as SlimTextNode;
    }
    case SlimVMObjectType.ELEMENT: {
      const [type, tagName, attributes, shadow, childNodes] = node;
      const atts: SlimElementAttribute[] = [];
      for (const [name, value] of attributes) {
        atts.push({ name, value });
      }
      let base = {
        type,
        tagName, 
        attributes: atts,
        shadow: shadow && uncompressVMObject(shadow),
        childNodes: childNodes.map(child => uncompressVMObject(child))
      } as SlimElement;

      if (tagName === "style") {
        base = {
          ...base,
          sheet: uncompressVMObject(node[5])
        } as SlimStyleElement;
      }
      return base;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const [type, childNodes] = node;
      return {
        type,
        childNodes: childNodes.map(child => uncompressVMObject(child))
      } as SlimParentNode;
    }
    case SlimVMObjectType.STYLE_SHEET: {
      const [type, rules] = node;
      return {
        type,
        rules: rules.map(rule => uncompressVMObject(rule))
      }
    }
    case SlimVMObjectType.STYLE_RULE: {
      const [type, selectorText, decls] = node;
      const style: CSSStyleDeclaration = {
      } as any;
      for (let i = 0, {length} = decls; i < length; i++) {
        const [key, value] = decls[i];
        style[key] = value;
      }
      return {
        type,
        selectorText,
        style
      }
    }
    case SlimVMObjectType.AT_RULE: {
      const [type, name, params, rules] = node;
      return {
        type,
        name,
        params,
        rules: rules.map(rule => uncompressVMObject(rule))
      } as SlimCSSAtRule;
    }
  }
};
