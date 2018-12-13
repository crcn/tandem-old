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
  [reactTemplate.id]: reactTemplate,
  [blankTemplate.id]: blankTemplate
};

const fileCreatorsById = {
  [reactTemplate.id]: createReactFiles,

  // Note that this MUST go last since it doesn't have any additional setup. I.e: requires
  // a more technical user to handle.
  [blankTemplate.id]: createBlankFiles
};

export const templates = Object.values(templatesById);

export { StarterKitFormOptions, StartKitOptionsProps };

export const createProjectFiles = (templateId: string, options: Object) =>
  fileCreatorsById[templateId](options);
