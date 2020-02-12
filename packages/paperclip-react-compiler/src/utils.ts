import { camelCase } from "lodash";

export const pascalCase = (value: string) => {
  const newValue = camelCase(value);
  return newValue.charAt(0).toUpperCase() + newValue.substr(1);
};
