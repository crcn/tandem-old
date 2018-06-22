import * as xml from "xml-js";
import { createPCTextNode, createPCElement } from "paperclip";
import { EMPTY_ARRAY } from "tandem-common";

// TODO - check for SVG and convert props to style
export const xmlToPCNode = (source: string) => {
  const { elements: [root] } = JSON.parse(xml.xml2json(source)) as any;
  return convertXMLJSONToPCNode(root);
};

const convertXMLJSONToPCNode = (node) => {
  if (node.type === "element") {
    return createPCElement(node.name, {}, node.attributes, (node.elements || EMPTY_ARRAY).map(convertXMLJSONToPCNode));
  } else if (node.type === "text") {
    return createPCTextNode(node.text);
  } else {
    console.error(node);
    throw new Error("Unsupported");
  }
};