import { ParentNode, NodeType, Element, TextNode, BaseNode } from "./state";

export const renderDOM = (node: BaseNode, mount: HTMLElement) => {
  mount.appendChild(createNode(node, mount.ownerDocument));
};

const createNode = (node: BaseNode, document: Document) => {
  switch(node.type) {
    case NodeType.TEXT: {
      return document.createTextNode((node as TextNode).value);
    }
    case NodeType.ELEMENT: {
      const { tagName, shadow, childNodes, attributes } = node as Element;
      const ret = document.createElement(tagName);
      if (shadow) {
        ret.attachShadow({ mode: "open" }).appendChild(createNode(shadow, document));
      }
      for (let i = 0, {length} = attributes; i < length; i++) {
        const attribute = attributes[i];
        ret.setAttribute(attribute.name, attribute.value);
      }
      for (let i = 0, {length} = childNodes; i < length; i++) {
        ret.appendChild(createNode(childNodes[i], document));
      }
      return ret;
    }
    case NodeType.DOCUMENT_FRAGMENT: {
      const { childNodes } = node as ParentNode;
      const fragment = document.createDocumentFragment();
      for (let i = 0, {length} = childNodes; i < length; i++) {
        fragment.appendChild(createNode(childNodes[i], document));
      }
      return fragment;
    }
    default: {
      console.warn(`Unable to render node`);
      return document.createTextNode(``);
    }
  }
};

// TODO
export const patchDOM = (diffs: any[], container: HTMLElement) => {

};