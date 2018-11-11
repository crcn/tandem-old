import * as React from "react";
import {
  template as reactTemplate,
  createFiles as createReactFiles,
  OptionsForm as ReactOptionsForm
} from "./react";
import { ProjectTemplate } from "../state";

const templatesById = {
  [reactTemplate.id]: reactTemplate
};

const fileCreatorsById = {
  [reactTemplate.id]: createReactFiles
};

const optionsFormComponentsById = {
  [reactTemplate.id]: ReactOptionsForm
};

export const templates = Object.values(templatesById);

export type StartKitOptionsProps = {
  template: ProjectTemplate;
  onChangeComplete: any;
};

export const hasOptionForm = (id: string) => !!optionsFormComponentsById[id];

export class StartKitOptions extends React.PureComponent<StartKitOptionsProps> {
  render() {
    return React.createElement(
      optionsFormComponentsById[this.props.template.id],
      this.props
    );
  }
}

export const createProjectFiles = (templateId: string, options: Object) =>
  fileCreatorsById[templateId](options);
