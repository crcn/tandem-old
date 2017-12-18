import { NodeType, BaseNode, Element, ElementAttribute, ParentNode, VMObjectSource, TextNode } from "./state";

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
    case NodeType.TEXT: return [node.type, compressSource(node.source, sourceUris), (node as TextNode).value];
    case NodeType.ELEMENT: {
      const element = node as Element;
      const attribs = [];
      for (const attribute of element.attributes) {
        attribs[attribute.name] = attribs[attribute.value];
      }
      return [
        element.type,
        compressSource(node.source, sourceUris),
        element.tagName,
        attribs,
        element.shadow ? compressNode(element.shadow, sourceUris) : null,
        element.childNodes.map(child => compressNode(child, sourceUris))
      ];
    }
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const element = node as ParentNode;
      const attribs = [];
      return [
        element.type,
        compressSource(node.source, sourceUris),
        attribs,
        element.childNodes.map(child => compressNode(child, sourceUris))
      ];
    }
  }
};

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
      const [type, source, value] = node;
      return {
        type,
        source: uncompressSource(source, sources),
        value,
      } as TextNode
    }
    case NodeType.ELEMENT: {
      const [type, source, tagName, attributes, shadow, childNodes] = node;
      const atts: ElementAttribute[] = [];
      for (const [name, value] of attributes) {
        atts.push({ name, value });
      }
      return {
        type,
        source: uncompressSource(source, sources),
        shadow: shadow && uncompressNode(shadow, sources),
        childNodes: childNodes.map(child => uncompressNode(child, sources))
      } as Element
    }
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const [type, source, childNodes] = node;
      return {
        type,
        source: uncompressSource(source, sources),
        childNodes: childNodes.map(child => uncompressNode(child, sources))
      } as ParentNode;
    }
  }
};

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