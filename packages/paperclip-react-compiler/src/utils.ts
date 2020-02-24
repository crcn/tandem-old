import { camelCase } from "lodash";
import {
  getMetaValue,
  Node,
  Element,
  getAttributeStringValue
} from "paperclip";

export const RENAME_PROPS = {
  class: "className"
};

export type Options = {
  definition?: boolean;
  omitParts?: string;
};

export const pascalCase = (value: string) => {
  const newValue = camelCase(value);
  return newValue.charAt(0).toUpperCase() + newValue.substr(1);
};

export const getBaseComponentName = (root: Node) => {
  return `Base${getComponentName(root)}`;
};

export const getComponentName = (root: Node) => {
  return getMetaValue("react-class", root) || "View";
};

export const getPartClassName = (part: Element) => {
  return pascalCase(getAttributeStringValue("id", part));
};
