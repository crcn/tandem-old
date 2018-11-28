import {
  template as reactTemplate,
  createFiles as createReactFiles
} from "./react";
import {
  template as blankTemplate,
  createFiles as createBlankFiles
} from "./blank";
import { StarterKitFormOptions } from "./form.pc";
import { Props as StartKitOptionsProps } from "./form-controller";

const templatesById = {
  [blankTemplate.id]: blankTemplate,
  [reactTemplate.id]: reactTemplate
};

const fileCreatorsById = {
  [reactTemplate.id]: createReactFiles,
  [blankTemplate.id]: createBlankFiles
};

export const templates = Object.values(templatesById);

export { StarterKitFormOptions, StartKitOptionsProps };

export const createProjectFiles = (templateId: string, options: Object) =>
  fileCreatorsById[templateId](options);
