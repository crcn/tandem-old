import { stringifyCSSSheet } from "./stringify-sheet";

export const stringifyVirtualNode = node => {
  switch (node.type) {
    case "Fragment":
      return stringifyChildren(node);
    case "Element": {
      let buffer = `<${node.tag_name}`;
      for (const attr of node.attributes) {
        if (attr.value) {
          buffer += ` ${attr.name}="${attr.value}"`;
        } else {
          buffer += ` ${attr.name}`;
        }
      }
      buffer += `>${stringifyChildren(node)}</${node.tag_name}>`;
      return buffer;
    }
    case "StyleElement": {
      return `<style>${stringifyCSSSheet(node.sheet)}</style>`;
    }
    case "Text": {
      return node.value;
    }
    default: {
      throw new Error(`can't handle ${node.type}`);
    }
  }
};

const stringifyChildren = node =>
  node.children.map(stringifyVirtualNode).join("");
