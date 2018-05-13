import { memoize } from "./memoization";
import { EMPTY_ARRAY } from "./object";
import { TreeNode, DEFAULT_NAMESPACE, addTreeNodeIds } from "../state/tree";
import { xml2js } from "xml-js";
import { camelCase, repeat } from "lodash";

export const xmlToTreeNode = memoize((xml: string): TreeNode => {
  return addTreeNodeIds(normalizeTree(xml2js(xml).elements[0]));
});

const normalizeTree = ({name: nameAndNamespace, attributes, elements = EMPTY_ARRAY}: any) => {

  let [namespace, name] = nameAndNamespace.split(":");

  if (!name) {
    name = namespace;
    namespace = null;
  }

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
    namespace,
    attributes: normalizedAttributes,
    children: elements.filter(element => Boolean(element.name)).map(normalizeTree)
  };
};

export const stringifyTreeNodeToXML = memoize((node: TreeNode, level: number = 0) => {
  const tabs = repeat(" ", level * 2);

  let tagName = node.name;

  if (node.namespace && node.namespace !== DEFAULT_NAMESPACE) {
    tagName = node.namespace + ":" + tagName;
  }
  let buffer = `${tabs}<${tagName}`;

  for (const namespace in node.attributes) {
    const nsa = node.attributes[namespace];
    for (const name in nsa) {
      let value = nsa[name];

      if (name === "style") {
        value = stringifyStyle(value);
      }

      let attrName = name;

      if (namespace !== DEFAULT_NAMESPACE) {
        attrName = namespace + ":" + attrName;
      }

      if (/null|undefined/.test(String(value))) {
        continue;
      }
      const tov = typeof value;
      buffer += ` ${attrName}=${tov === "string" ? JSON.stringify(value) : `"${tov === "object" ? stringifyStyle(value) : value}"`}`
    }
  }

  buffer += `>`;

  if (node.children.length) {
    buffer += `\n`;
  }

  buffer += node.children.map(child => stringifyTreeNodeToXML(child, level + 1)).join("");

  buffer += `${node.children.length ? tabs : ""}</${tagName}>\n`;

  return buffer;
});

export const parseStyle = (source: string): any => {
  const style = {};
  source.split(/\s*;\s*/g).forEach(kv => {
    let [name, value] = kv.split(":");
    if (!name || !value) {
      return;
    }
    value = value.trim();

    style[camelCase(name.trim())] = !isNaN(Number(value)) ? Number(value) : value;
  });
  return style;
};

export const castStyle = (source: string): any => typeof source === "string" ? parseStyle(source) : source;

const stringifyStyle = (style: any) => {
  let buffer = ``;

  for (const name in style) {
    buffer += `${name}:${style[name]};`
  }

  return buffer;
}