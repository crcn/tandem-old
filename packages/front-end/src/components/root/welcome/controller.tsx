import * as React from "react";
import {
  openProjectButtonClicked,
  createProjectButtonClicked
} from "../../../actions";
import { BaseWelcomeProps, ProjectPill } from "./view.pc";
import { Dispatch } from "redux";
import {
  StarterKitFormOptions,
  templates,
  createProjectFiles
} from "../../../starter-kits";
import { ProjectTemplate } from "../../../state";
import { Options as FormOptions } from "../../../starter-kits/form-controller";

export type Props = {
  selectedDirectory: string;
  dispatch: Dispatch<any>;
};

enum Page {
  START = "start",
  CREATE_PROJECT = "createProject",
  NEW_PROJECT_OPTIONS = "newProjectOptions"
}

type State = {
  page: Page;
  selectedTemplate?: ProjectTemplate;
};

export default (Base: React.ComponentClass<BaseWelcomeProps>) =>
  class WelcomeController extends React.PureComponent<Props, State> {
    state = {
      page: Page.START,
      selectedTemplate: null
    };

    onOpenProjectButtonClick = () => {
      this.props.dispatch(openProjectButtonClicked());
    };
    onCreateProjectButtonClick = () => {
      this.setState({ page: Page.CREATE_PROJECT });
    };

    onPillClick = (selectedTemplate: ProjectTemplate) => {
      this.setState({ page: Page.NEW_PROJECT_OPTIONS, selectedTemplate });
    };

    onOptionsChange = (options: FormOptions) => {
      this.props.dispatch(
        createProjectButtonClicked(
          options.directory,
          createProjectFiles(this.state.selectedTemplate.id, options)
        )
      );
    };

    render() {
      const {
        onOpenProjectButtonClick,
        onCreateProjectButtonClick,
        onPillClick,
        onOptionsChange
      } = this;
      const { dispatch, selectedDirectory } = this.props;
      const { page, selectedTemplate } = this.state;
      const options = templates.map(template => {
        return (
          <ProjectPill
            onClick={() => onPillClick(template)}
            labelProps={{ text: template.label }}
            icon={template.icon && <img src={template.icon} />}
          />
        );
      });
      return (
        <Base
          variant={page}
          openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
          createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
          options={options}
          newProjectOptions={
            page === Page.NEW_PROJECT_OPTIONS ? (
              <StarterKitFormOptions
                selectedDirectory={selectedDirectory}
                dispatch={dispatch}
                template={selectedTemplate}
                onChangeComplete={onOptionsChange}
              />
            ) : null
          }
        />
      );
    }
  };
