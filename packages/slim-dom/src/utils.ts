import { ParentNode, BaseNode, NodeType, Element, TextNode } from "./state";

const weakMemo = <T extends Function>(fn: T) => {
  const key = Symbol();
  return ((arg, ...rest: any[]) => {
    if (arg[key]) return arg[key];
    return arg[key] = fn(arg, ...rest);
  }) as any as T;
};

export const pushChildNode = <TParent extends ParentNode>(parent: TParent, child: BaseNode): TParent => ({
  ...(parent as any),
  childNodes: [
    ...parent.childNodes,
    child
  ]
});

export const stringifyNode = weakMemo((node: BaseNode) => {
  switch(node.type) {
    case NodeType.TEXT: {
      const text = node as TextNode;
      return text.value;
    }
    case NodeType.ELEMENT: {
      const el = node as Element;
      let buffer = `<${el.tagName} `;
      for (let i = 0, {length} = el.attributes; i < length; i++) {
        const attr = el.attributes[i];
        buffer += ` ${attr.name}=${JSON.stringify(attr.value)}`;
      }
      buffer += `>`;
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i]);
      }
      buffer += `</${el.tagName}>`;
      return buffer;
    }
    case NodeType.DOCUMENT_FRAGMENT: 
    case NodeType.DOCUMENT: {
      const el = node as ParentNode;
      let buffer = ``;
      console.log(el.childNodes);
      for (let i = 0, {length} = el.childNodes; i < length; i++) {
        buffer += stringifyNode(el.childNodes[i]);
      }
      return buffer;
    }
  }
});
