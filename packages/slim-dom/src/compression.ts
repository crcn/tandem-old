import { NodeType, BaseNode, Element, ElementAttribute, ParentNode, VMObjectSource, TextNode, CSSRuleType, CSSGroupingRule, CSSMediaRule, CSSRule, CSSStyleDeclaration, CSSStyleRule, CSSStyleSheet, StyleElement } from "./state";

export type CompressedFragment = [NodeType, any[]];
export type CompressedTextNode = [NodeType, string];
export type CompressedAttributes = [string, string];
export type CompressedElement = [NodeType, CompressedAttributes[], any[], any[]];
export type CompressedNode = any[];

export type CompressionResult = [string[], any];

const memoKey = Symbol();

export const compressDocument = (root: BaseNode): CompressionResult => {
  if (root[memoKey]) {
    return root[memoKey];
  }
  const sources = [];
  return root[memoKey] = [sources, compressNode(root, sources)] as any;
};

const compressNode = (node: BaseNode, sourceUris: string[]) => {
  switch (node.type) {
    case NodeType.TEXT: return [node.type, node.id, compressSource(node.source, sourceUris), (node as TextNode).value];
    case NodeType.ELEMENT: {
      const { type, id, source, tagName, attributes, shadow, childNodes } = node as Element;
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
        base.push(compressStyleSheet((node as StyleElement).sheet, sourceUris));
      }

      return base;
    }
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const { type, id, source, childNodes } = node as ParentNode;
      return [
        type,
        id,
        compressSource(source, sourceUris),
        childNodes.map(child => compressNode(child, sourceUris))
      ];
    }
  }
};

const compressStyleSheet = (sheet: CSSStyleSheet, sources: string[]) => {
  return [
    sheet.type,
    sheet.id,
    compressSource(sheet.source, sources),
    sheet.rules.map(rule => compressStyleRule(rule, sources))
  ]
}

const compressStyleRule = (rule: CSSRule, sources: string[]) => {
  switch(rule.type) {
    case CSSRuleType.STYLE_RULE: {
      const { type, id, selectorText, style, source } = rule as CSSStyleRule;
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
    case CSSRuleType.MEDIA_RULE: {
      const { type, id, conditionText, source, rules } = rule as CSSMediaRule;
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

export const uncompressDocument = ([sources, node]: CompressionResult): BaseNode  => {
  return uncompressNode(node, sources);
}

const uncompressNode = (node: any, sources: string[]) => {
  switch(node[0]) {
    case NodeType.TEXT: {
      const [type, id, source, value] = node;
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        value,
      } as TextNode
    }
    case NodeType.ELEMENT: {
      const [type, id, source, tagName, attributes, shadow, childNodes] = node;
      const atts: ElementAttribute[] = [];
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
      } as Element;

      if (tagName === "style") {
        base = {
          ...base,
          sheet: uncompressStyleSheet(node[7], sources)
        } as StyleElement;
      }
      return base;
    }
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const [type, id, source, childNodes] = node;
      return {
        type,
        id,
        source: uncompressSource(source, sources),
        childNodes: childNodes.map(child => uncompressNode(child, sources))
      } as ParentNode;
    }
  }
};

const uncompressStyleSheet = ([type, id, source, rules]: any, sources: string[]): CSSStyleSheet => {
  return {
    id,
    type,
    source: uncompressSource(source, sources),
    rules: rules.map(rule => uncompressCSSRule(rule, sources))
  }
}
const uncompressCSSRule = (rule: any, sources: string[]) => {
  switch(rule[0]) {
    case CSSRuleType.STYLE_RULE: {
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
    case CSSRuleType.MEDIA_RULE: {
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