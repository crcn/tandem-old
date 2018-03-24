import { memoize, EMPTY_ARRAY } from "../common/utils";
import { TreeNode, DEFAULT_NAMESPACE } from "./tree";
import { xml2js } from "xml-js";
import { camelCase } from "lodash";

export const translateXMLToTreeNode = memoize((xml: string): TreeNode => {
  return normalizeTree(xml2js(xml).elements[0]);
});

const normalizeTree = ({name, attributes, elements = EMPTY_ARRAY}: any) => {

  const normalizedAttributes = { };

  for (const name in attributes) {
    let [namespace, name2] = name.split(":");
    if (!name2) {
      name2 = namespace;
      namespace = DEFAULT_NAMESPACE;
    }
    if (!normalizedAttributes[namespace]) {
      normalizedAttributes[namespace] = {};
    }

    let value = attributes[name];

    if (name2 === "style") {
      value = parseStyle(value);
    }

    normalizedAttributes[namespace][name2] = value;
  }
  
  return {
    name,
    attributes: normalizedAttributes,
    children: elements.map(normalizeTree)
  };
};

const parseStyle = (source: string) => {
  const style = {};
  source.split(/\s*;\s*/g).forEach(kv => {
    const [name, value] = kv.split(":");
    if (!name || !value) {
      return;
    }
    style[camelCase(name.trim())] = value.trim();
  });
  return style;
};