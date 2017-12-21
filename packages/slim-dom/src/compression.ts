import { SlimVMObjectType, SlimBaseNode, SlimElement, SlimElementAttribute, SlimParentNode, VMObjectSource, SlimTextNode, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimStyleElement,  } from "./state";

export type CompressedFragment = [SlimVMObjectType, any[]];
export type CompressedTextNode = [SlimVMObjectType, string];
export type CompressedAttributes = [string, string];
export type CompressedElement = [SlimVMObjectType, CompressedAttributes[], any[], any[]];
export type CompressedNode = any[];

export type CompressionResult = [string[], any];

const memoKey = Symbol();

export const compressDocument = (root: SlimBaseNode): CompressionResult => {
  if (root[memoKey]) {
    return root[memoKey];
  }
  const sources = [];
  return root[memoKey] = [sources, compressNode(root, sources)] as any;
};

const compressNode = (node: SlimBaseNode, sourceUris: string[]) => {
  switch (node.type) {
    case SlimVMObjectType.TEXT: return [node.type, node.id, compressSource(node.source, sourceUris), (node as SlimTextNode).value];
    case SlimVMObjectType.ELEMENT: {
      const { type, id, source, tagName, attributes, shadow, childNodes } = node as SlimElement;
      const attribs = [];
      for (const attribute of attributes) {
        attribs.push([attribute.name, attribute.value]);
      }
      const base = [
        type,
        id,
        compressSource(node.source, sourceUris),
        tagName,
        attribs,
        shadow ? compressNode(shadow, sourceUris) : null,
        childNodes.map(child => compressNode(child, sourceUris))
      ];

      if (tagName === "style") {
        base.push(compressStyleSheet((node as SlimStyleElement).sheet, sourceUris));
      }

      return base;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const { type, id, source, childNodes } = node as SlimParentNode;
      return [
        type,
        id,
        compressSource(source, sourceUris),
        childNodes.map(child => compressNode(child, sourceUris))
      ];
    }
  }
};

const compressStyleSheet = (sheet: SlimCSSStyleSheet, sources: string[]) => {
  return [
    sheet.type,
    sheet.id,
    compressSource(sheet.source, sources),
    sheet.rules.map(rule => compressStyleRule(rule, sources))
  ]
}

const compressStyleRule = (rule: SlimCSSRule, sources: string[]) => {
  switch(rule.type) {
    case SlimVMObjectType.STYLE_RULE: {
      const { type, id, selectorText, style, source } = rule as SlimCSSStyleRule;
      const decl = [];
      for (const key in style) {
        decl.push([key, style[key]]);
      }

      return [
        type,
        id,
        compressSource(source, sources),
        selectorText,
        style.id,
        decl
      ]
    }
    case SlimVMObjectType.MEDIA_RULE: {
      const { type, id, conditionText, source, rules } = rule as SlimCSSMediaRule;
      return [
        type,
        id, 
        compressSource(source, sources),
        rules.map(rule => compressStyleRule(rule, sources))
      ]
    }
  }
}

const compressSource = (source: VMObjectSource, sourceUris: string[]) => {
  if (sourceUris.indexOf(source.uri) === -1) {
    sourceUris.push(source.uri);
  }
  return [
    source.type,
    sourceUris.indexOf(source.uri),
    source.range.start.line, source.range.start.column, source.range.start.pos, source.range.end.line, source.range.end.column, source.range.end.pos
  ];
}

export const uncompressDocument = ([sources, node]: CompressionResult): SlimBaseNode  => {
  return uncompressNode(node, sources);
}

const uncompressNode = (node: any, sources: string[]) => {
  switch(node[0]) {
    case SlimVMObjectType.TEXT: {
      const [type, id, source, value] = node;
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        value,
      } as SlimTextNode;
    }
    case SlimVMObjectType.ELEMENT: {
      const [type, id, source, tagName, attributes, shadow, childNodes] = node;
      const atts: SlimElementAttribute[] = [];
      for (const [name, value] of attributes) {
        atts.push({ name, value });
      }
      let base = {
        type,
        id,
        tagName, 
        attributes: atts,
        source: uncompressSource(source, sources),
        shadow: shadow && uncompressNode(shadow, sources),
        childNodes: childNodes.map(child => uncompressNode(child, sources))
      } as SlimElement;

      if (tagName === "style") {
        base = {
          ...base,
          sheet: uncompressStyleSheet(node[7], sources)
        } as SlimStyleElement;
      }
      return base;
    }
    case SlimVMObjectType.DOCUMENT_FRAGMENT: 
    case SlimVMObjectType.DOCUMENT: {
      const [type, id, source, childNodes] = node;
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        childNodes: childNodes.map(child => uncompressNode(child, sources))
      } as SlimParentNode;
    }
  }
};

const uncompressStyleSheet = ([type, id, source, rules]: any, sources: string[]): SlimCSSStyleSheet => {
  return {
    id,
    type,
    source: uncompressSource(source, sources),
    rules: rules.map(rule => uncompressCSSRule(rule, sources))
  }
}
const uncompressCSSRule = (rule: any, sources: string[]) => {
  switch(rule[0]) {
    case SlimVMObjectType.STYLE_RULE: {
      const [type, id, source, selectorText, styleId, decls] = rule;
      const style: CSSStyleDeclaration = {
        id: styleId
      } as any;
      for (let i = 0, {length} = decls; i < length; i++) {
        const [key, value] = decls[i];
        style[key] = value;
      }
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        selectorText,
        style
      }
    }
    case SlimVMObjectType.MEDIA_RULE: {
      const [type, id, source, conditionText, rules] = rule;
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        conditionText,
        rules: rules.map(rule => uncompressCSSRule(rule, sources))
      }
    }
  }
}
const uncompressSource = ([type, uriIndex, startLine, startColumn, startPos, endLine, endColumn, endPos]: any, sources: string[]): VMObjectSource => ({
  type,
  uri: sources[uriIndex],
  range: {
    start: {
      line: startLine,
      column: startColumn,
      pos: startPos,
    },
    end: {
      line: endLine,
      column: endColumn,
      pos: endPos
    }
  }
});