import { NodeType, BaseNode, Element, ElementAttribute, ParentNode, VMObjectSource, TextNode } from "./state";

export type CompressedFragment = [NodeType, any[]];
export type CompressedTextNode = [NodeType, string];
export type CompressedAttributes = [string, string];
export type CompressedElement = [NodeType, CompressedAttributes[], any[], any[]];
export type CompressedNode = any[];

export type CompressionResult = {
  sources: string[];
  node: CompressedNode;
}

const memoKey = Symbol();

export const compressDocument = (root: BaseNode): CompressionResult => {
  if (root[memoKey]) {
    return root[memoKey];
  }
  const sources = [];
  const node = compressNode(root, sources);
  return root[memoKey] = {
    sources,
    node
  };
}

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

export const uncompressDocument = (result: CompressionResult) => {

}

const uncompressSource = (source: any) => {

}